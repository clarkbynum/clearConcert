angular.module('clearConcert')
.controller('QueryCtrl', ['$scope', 'catalog', '$location', '$log', 'query', '$loadDialog', '$routeParams',
function($scope, catalog, $location, $log, query, $loadDialog, $routeParams) {

  var projectId = $routeParams.projectId;

	$scope.projects = function() {
	    return catalog.list();
	  };
	$scope.getProjectQueries = function(projectId) {
    var promise = query.queriesForProject(projectId).then(function(queries) {
      $scope.queries = queries;
      return queries;
    }, function(response) {
      //Dialog.error("Error Fetching Project Queries");
      alert("Error Fetching Project Queries");
    });
    $loadDialog.waitFor(promise, 'Loading Queries...');
    //promiseTracker('fullSpin').addPromise(promise, 'Loading Queries...');
    return promise;
  };

  $scope.filterQueries = function(results) {
    if ($scope.resultFilterInput) {
      results = filterFilter(results, $scope.resultFilterInput);
    }
    /*
    return orderByFilter(results, function(item) {
      return item.identifier;
    });*/
    return results;
  };

  $scope.selectProject = function(proj) {
    $scope.getProjectQueries(proj.projectId).then(function(queries) {
      $scope.queries = queries;
      if (queries.length === 0) {
        var err = "No Queries found in '$0'";
        //Toast.show(err.format(proj.title));
        alert(err.format(proj.title));
      } else {
        $location.path("/query/$0".format(proj.projectId));
      }
    });
  };

  $scope.go = function(target) {
    $location.path('/'+target);
  };

  $scope.selectQuery = function(queryObj) {
    query.resultsForQuery(projectId, queryObj.queryId).then(function(result) {
      if (result.items.length === 0) {
        queryObj.noResults = true;
      } else {
        $location.path("/query/$0/$1".format(projectId, queryObj.queryId));
      }
    });
  };

  if (projectId) {
    $scope.getProjectQueries(projectId);
    $scope.projectTitle = catalog.byId(projectId).title;
  }

}]);