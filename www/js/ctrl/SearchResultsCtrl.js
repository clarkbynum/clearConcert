angular.module('clearConcert')
.controller('SearchResultsCtrl', ['$scope','$location','$routeParams','catalog', 'search', '$q', '$loadDialog',
function($scope, $location, $routeParams, catalog, search, $q, $loadDialog){

$scope.query = $routeParams.query || '';
	$scope.isFav = false;

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
        
        
      }).then(resolved);
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

if ($scope.query) {
    $scope.searchAllProjects($scope.query);
  }

$scope.go = function(target) {
    $location.path('/');
  };

 $scope.addFavorite = function() {
	  $scope.isFav = true;
  }
  
  $scope.removeFavorite = function() {
	  $scope.isFav = false;
  }

}]);