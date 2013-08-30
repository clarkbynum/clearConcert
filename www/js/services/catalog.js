angular.module('clearConcert')
.factory('catalog', ['$http','$rootScope','$q','settings','$timeout','$log',
function($http, $rootScope, $q, settings, $timeout, $log) {
  var _catalogItems = [];
  var _isLoaded = false;
  
  var parser = new DOMParser();
  var catalogPath = "oslc/workitems/catalog";

  $rootScope.$on('auth.logout', function() {
    _isLoaded = false;
  });

  function getCatalog(repository, catalogPath) {
    _catalogItems.length = 0;
    _isLoaded = false;
    return $http.get(repository + catalogPath).then(function(response) {
      //console.log(response);
      //console.log(response.data);
      return parseCatalogItems(response.data);
    }).then(function(catalogList) {
    //	debugger;
      return $http.get(repository + "oslc/categories")
      .then(function(categoriesResponse) {
        var categories = categoriesResponse.data['oslc_cm:results'];
        //Get all the categories that match each project in the _catalogItems
        catalogList.forEach(function(project) {
          //debugger;
          project.categories = categories.filter(function(category) {
            var resource = category['rtc_cm:projectArea']['rdf:resource'];
            return resource.indexOf(project.projectId) > -1;
          });
        });
        
        return catalogList;
      });
    }).then(function(catalogList) {
      _catalogItems = catalogList;
      _isLoaded = true;
      $rootScope.$broadcast("catalog.loaded");
      return catalogList;
    }, function error(response) {
        $log.error("Could not retrieve workitems _catalogItems", response.data);
    });
  }

  function parseCatalogItems(data) {
    //console.log(data);
    var projects = [];
    var xml = parser.parseFromString(data, "text/xml");
    angular.forEach(xml.getElementsByTagName("ServiceProvider"), function(provider) {
      var title = provider.getElementsByTagName("title")[0].firstChild.textContent;
      var resource = provider.getElementsByTagName("services")[0].getAttribute("rdf:resource");
      var detailsUrl = provider.getElementsByTagName("details")[0].getAttribute("rdf:resource");
      projects.push({
        title: title,
        'rdf:resource': resource.substring(0, resource.indexOf("services.xml")),
        projectId: detailsUrl.substring(detailsUrl.lastIndexOf("/")+1),
        categories: []
      });
    //  debugger;
    });
    return projects;
  }

  return {
    load: function() {
      if (!_isLoaded) {
        var deferred = $q.defer();
        $rootScope.$on('catalog.loaded', function(){ 
          deferred.resolve();
        });
        return deferred.promise;
      } else {
        return $q.when(true);
      }
    },
    list: function() {
      return _catalogItems;
    },
    byId: function(id) {
      return _catalogItems.filter(function(project) {
        return project.projectId == id;
      })[0];
    },
    fetch: function() {
      getCatalog(settings.repository, catalogPath);
      return this.load();
    }
  };
}]);
