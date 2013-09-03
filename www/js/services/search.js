angular.module('clearConcert')
.factory('search', 
function($http, workItems, catalog, $q, settings, $cacheFactory) {
  
  var searchCache = $cacheFactory('searchCache');

 
   
  function projectQuery(project, query, params) {

    return $http.get(project['rdf:resource'] + ".json", {
      cache: searchCache,
      params: angular.extend({
        'oslc_cm.query':"oslc_cm%3AsearchTerms%3D%22"+query+"%22",
        'oslc_cm.properties': 'dc:title,dc:description,dc:type,dc:identifier,rtc_cm:resolved'
      }, params || {})
    });
  }

  function handleSearchResponse(response) {

    return $q.all(response.data['oslc_cm:results'].map(function(r) {
      return workItems.get(settings.repository, r['dc:identifier'], r)
        .$getResource('dc:type');
    })).then(function(items) {
      return {
        items: items,
        next: response.data['oslc_cm:next'],
        total: response.data['oslc_cm:totalCount']
      };
    });
  }

  function projectResults(project, query) {
    return projectQuery(project, query, {
      'oslc_cm.pageSize': '1'
    }).then(function(response) {
      console.log(response);
      return {
        project: project,
        total: response.data['oslc_cm:totalCount']
      };
    });
  }

  return {
    clearCache: searchCache.removeAll,
    getProjectResultCounts: function(query, start, amount) { 
      //console.log(isKeyword);
      //console.log(isTag);
      var requests = [],
        projects = catalog.list(),
        max = Math.min(projects.length, start + amount);
      for (var i = start; i < max; i++) {
        requests.push(projectResults(projects[i], query));
      }
      return requests;
    },
    getResultsForProject: function(projectId, query, pageSize) {
      var project = catalog.byId(projectId);

      return projectQuery(project, query,  {

        'oslc_cm.pageSize': pageSize
      } || {})
      .then(handleSearchResponse);
    },
    getMoreResults: function(url) {
      return $http.get(url, {cache: searchCache})
      .then(handleSearchResponse);
    }
  };
});
