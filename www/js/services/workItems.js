angular.module('clearConcert')
.factory('workItems', ['$http', '$q', 'settings', '$cacheFactory', 'catalog', '$log',
function($http, $q, settings, $cacheFactory, catalog, $log) {

  var itemHeaders = {
    "Content-Type": "application/x-oslc-cm-change-request+json", 
    "Accept": "text/json"
  };

  var itemJTSHeaders = {
    "Content-Type": "application/rdf+xml",
    "Accept": "application/rdf+xml"
  };

  var defaultPropsToGet = ['dc:type','dc:identifier','dc:title','oslc_cm:severity','rtc_cm:state','rtc_cm:ownedBy','oslc_cm:priority','rtc_cm:projectArea','rtc_cm:filedAgainst','dc:created','rtc_cm:plannedFor','dc:modified','rtc_cm:due','rtc_cm:estimate','rtc_cm:resolved','rtc_cm:resolvedBy','dc:description','rtc_cm:comments'];

  function WorkItem(options) {
    var self = this;
    self.repository = options.repository;
    self.identifier = options.identifier || (options.data && options.data['dc:identifier'] || '') || '';
    self.item = {};
    self.resource = {};
    self.comments = [];
    self.isNew = true;

    if (options.data) {
      setData(options.data);
    }

    self.url = function() {
      return self.repository + "oslc/workitems/" + self.identifier;
    };

    self.$save = function() {
      function itemKeys(list) {
        var obj = {};
        list = list.split(' ');
        for (var i=0, ii=list.length; i<ii; i++) {
          obj[list[i]] = self.item[list[i]];
        }
        return obj;
      }
      return $http({
        url: self.url(),
        method: "PUT",
        data: itemKeys('rtc_cm:ownedBy dc:description dc:title dc:type rtc_cm:due oslc_cm:priority oslc_cm:severity rtc_cm:estimate rtc_cm:filedAgainst rtc_cm:state'),
        params: { //State is the only weird thing: requires an extra parameter
          "_action": self.item['rtc_cm:state']['rdf:resource']
        },
        headers: angular.extend(itemHeaders, { 'If-Match': self.etag/*.substr(1,self.etag.length-2)*/ })
      }).then(function(response) {
        return self.$fetch().then(function() {
          return self.$getAllResources().then(function() {
            return self;
          });
        });
      });
    };

    self.$create = function() {
      return $http.post(self.item['rtc_cm:projectArea']['rdf:resource'], self.item, {headers:itemHeaders}).then(function(response) {
        return response.data['dc:identifier'];
      });
    };

    function setData(item) {
      self.isNew = false;
      self.identifier = item['dc:identifier'];
      angular.extend(self.item, item);
      cachePutItem(self.repository, self.identifier, self);
    }

    self.$getResource = function(property, fetch) {
      if (self.item[property] && self.item[property]['rdf:resource']) {
        var value = self.resource[property];
        var modified = self.item['dc:modified'];
        //If this was fetched after item was modified last (or if item was
        //never modified), just use the old value
        if (!fetch && value && (!modified || value.$timestamp > new Date(modified))) {
          return $q.when(self);
        } else {
          console.log(self.item[property]);

          //whelp, RTC doesnt support JSON on the jts calls which include information about users... back to
          //parsing xml
          if (property==="rtc_cm:ownedBy") {
            return $http.get(self.item[property]['rdf:resource'], {headers:itemJTSHeaders}).then(
              function(response) {
                var dp = new DOMParser();
                var xDoc = dp.parseFromString(response.data, "text/xml");
                var r = {'dc:title':'Mr Test','rtc_cm:emailAddress':'test@aa.com','rtc_cm:userId':"test"};
                // self.resource[property]['dc:title']="";
                // self.resource[property]['rtc_cm:emailAddress']="";
                // self.resource[property]['rtc_cm:userId']="";
                self.resource[property] = r; //response.data;
                self.resource[property].$timestamp = new Date();
              return self;
            }, 
            function(error){
              $log.log("workitems.getResource: "+error);
              
            });  
          }else{
            return $http.get(self.item[property]['rdf:resource'], {headers:itemHeaders}).then(
              function(response) {
                self.resource[property] = response.data;
                self.resource[property].$timestamp = new Date();
              return self;
            }, 
            function(error){
              $log.log("workitems.getResource: "+error);
              
            });
          }
        }
      }
      return $q.when(self);
    };

    function getComment(comment) {
      return $http.get(comment['rdf:resource']).then(function(resp) {
        var comment = resp.data;
        return $http.get(comment['dc:creator']['rdf:resource'])
        .then(function(response) {
          comment['dc:creator'] = response.data;
          return comment;
        });
      });
    }

    self.$addComment = function(text) {
      return $http.post(self.url() + "/rtc_cm:comments", {
        'dc:description': text
      }, { headers: itemHeaders }).then(function(response) {
        return getComment(response.data).then(function(comment) {
          self.comments.push(comment);
        });
      });
    };

    self.$getComments = function() {
      return $http.get(self.url() + "/rtc_cm:comments").then(function(resp) {
        return $q.all(resp.data.map(getComment));
      }).then(function(comments) {
        return self.comments = comments.sort(function(a,b) {
          return new Date(a['dc:created']) > new Date(b['dc:created']);
        });
      });
    };

    self.$getAllResources = function(fetch) {
      var resourcesToDownload = [
        'rtc_cm:plannedFor', 'rtc_cm:modifiedBy', 'oslc_cm:severity',
        'rtc_cm:state', 'rtc_cm:resolvedBy', 'rtc_cm:filedAgainst',
        'rtc_cm:ownedBy', 'oslc_cm:priority', 'rtc_cm:projectArea', 'dc:type'
      ];
      var promises = resourcesToDownload.map(function(res) {
        return self.$getResource(res, fetch);
      });
      promises.push(self.$getComments());
      return $q.all(promises).then(function() {
        return self;
      }, function() {
        return self;
      });
    };

    //Can define just which properties to fetch
    self.$fetch = function() {
      var propsToGet;
      if (arguments.length === 0) {
        propsToGet = defaultPropsToGet;
      } else {
        propsToGet = [];
        angular.forEach(arguments, function(arg) {
          propsToGet.push(arg);
        });
      }
      if (propsToGet.indexOf('dc:identifier') < 0) {
        propsToGet.push('dc:identifier');
      }

      return $http.get(self.url() + ".json", {
        params: {'oslc_cm.properties': propsToGet.join(',')}
      }).then(function(response) {
        self.$timestamp = new Date();
        setData(response.data);
        return self;
      }, function(response){
        return response;
      });
    };

    self.$update = function() {
      if ((+new Date()) > (self.$timestamp || 0) + 120 * 1000) {
        return self.$fetch.apply(self, [].slice.call(arguments));
      } else {
        return $q.when(self);
      }
    };
  }

  var itemCache = $cacheFactory('workItems', {capacity: 1000});
  function cacheGetItem(repo, id) {
    return itemCache.get(repo + id);
  }
  function cachePutItem(repo, id, item) {
    itemCache.put(repo + id, item);
  }
  return {
    create: function(repository) {
      var item = new WorkItem({ repository: repository });
      return item;
    },
    get: function(repository, identifier, itemData) {
      var item;
      //console.log(identifier, cacheGetItem(identifier));
      if (!(item = cacheGetItem(repository, identifier))) {
        item = new WorkItem({
          repository: repository,
          identifier: identifier,
          data: itemData
        });
        cachePutItem(repository, identifier, item);
      }
      return item;
    }
  };
}]);
