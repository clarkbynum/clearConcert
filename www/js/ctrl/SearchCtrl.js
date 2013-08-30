angular.module('clearConcert')
.controller('SearchCtrl', ['$scope','$location','$routeParams','catalog', 'search', '$q', '$loadDialog',
function($scope, $location, $routeParams, catalog, search, $q, $loadDialog){

	$scope.search = {
     includeTags:"",
     includeKeywords:""
  };


  //sets the tag and keyword toggle switches to 'on'
  $scope.search.includeTags = "1";
  $scope.search.includeKeywords = "1";

  $scope.query = $routeParams.query || '';
	$scope.isFav = false;
	//We page our requests: Only send 20 requests out at a time.
  //This is because the server is so slow sometimes

  $scope.query = $routeParams.query || '';
  $scope.isFav = false;
  
  //We page our requests: Only send 20 requests out at a time.
  //This is because the server is slow sometimes

  var requestPageSize = 20;
  function searchNextProjects(query) {
    function resolved() {
    	$scope.resolvedCount++;
    }

    var requests = search.getProjectResultCounts(
      query, $scope.resolvedCount, requestPageSize
    );
    
    requests.forEach(function(request) {
      request.then(function(result) {
        if (result.total > 0 && result.project.include==="1") {
          $scope.results.push(result);
        }
      }).then(resolved, resolved);
    });
    var all = $q.all(requests).then(function() {
      if ($scope.resolvedCount < catalog.list().length &&
          !$scope.$$destroyed) {
        searchNextProjects(query);
      }
    });
    //$scope.moreLoading.addPromise(all);
    $loadDialog.waitFor(all);
  }

  $scope.searchAllProjects = function(query) {
    $scope.requestCount = catalog.list().length;
    $scope.resolvedCount = 0;
    $scope.results = [];
    searchNextProjects(query);
  };

  $scope.resultPressed = function(result) {
    $location.path('/search/$0/$1'.format($scope.query, result.project.projectId));
  };

  $scope.refresh = function() {
    search.clearCache();
    var refreshPromise = catalog.fetch();
    promiseTracker('fullSpin').addPromise(refreshPromise, 'Loading...');
  };
	
	$scope.searchPressed = function(criteria) {
    //If it's a number, go straight to it
    
    if (criteria == +criteria) {
      $location.path('/workitem/$0'.format(criteria));
    } else { 
      $location.path('/search/$0'.format(criteria));
    }
  };

  $scope.projects = catalog.list(); 
  var projects = $scope.projects;

  //sets the project area toggle switches to 'on'
  projects.forEach(function(project){
    project.include = "1";
  })
    
  $scope.go = function(target) {
    $location.path('/');
  };
  
  $scope.addFavorite = function() {
	  $scope.isFav = true;
  }
  
  $scope.removeFavorite = function() {
	  $scope.isFav = false;
  }

  if ($scope.query) {
    $scope.searchAllProjects($scope.query);
  }


}]);