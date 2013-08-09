angular.module('clearConcert')
.service('query', ['settings', '$http', '$q', 'catalog', 'workItems', '$cacheFactory', 
function(settings, $http, $q, catalog, workItems, $cacheFactory) {

  //Store queries for a specific projectarea
  var queryCache = $cacheFactory('projectAreaQueries');

  this.queriesForProject = function(projectId, queryId) {
    return $http.get("$0/oslc/queries.json".format(settings.repository), {
      cache: queryCache,
      params: {
        'oslc_cm.properties': 'dc:title',
        'oslc_cm.query': 'rtc_cm:projectArea="$0"'.format(projectId)
      }
    }).then(function(response) {
      return response.data['oslc_cm:results'].map(function(item, i) {
        return {
          title: item['dc:title'],
          queryId: item['dc:title']
        };
      });
    });
  };

  function handleQueryResponse(response) {
    var query = response.data['oslc_cm:results'][0];
    return $q.all(query['rtc_cm:results'].map(function(result) {
      var url = result['rdf:resource'];
      var id = url.substr(url.lastIndexOf("/")+1);
      return workItems.get(settings.repository, id)
        .$update('dc:type','dc:title')
        .then(function(item) {
          return item.$getResource('dc:type');
        });
    }))
    .then(function(items) {
      return {
        items: items,
      };
    });
  }
  
  this.resultsForQuery = function(projectId, queryId) {
    return $http.get("$0/oslc/queries.json".format(settings.repository), {
      cache: queryCache,
      params: {
        'oslc_cm.properties': 'rtc_cm:results',
        'oslc_cm.query': 'rtc_cm:projectArea="$0" and dc:title="$1"'
          .format(projectId, queryId)
      }
    }).then(handleQueryResponse);
  };

  this.getMoreResults = function(url) {
    return $http.get(url, {cache: queryCache})
    .then(handleQueryResponse);
  };

  this.clearCache = queryCache.removeAll;

}]);
