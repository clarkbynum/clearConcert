angular.module('clearConcert')
.controller('SearchCtrl', ['$scope','$location','$routeParams','catalog', 'search',
function($scope, $location, $routeParams, catalog, search){


  $scope.search = {
     includeTags:"",
     includeKeywords:""
  };


  $scope.project = {
    include:""
  };

  $scope.allSwitch = {
    value:""
  };

  $scope.projects = catalog.list(); 

  $scope.$apply();

  search.setInclude($scope.search);

  $scope.toggleAll = function(){
    
    if($scope.allSwitch.value==="1"){

      $scope.projects.forEach(function(project){
        project.include="1";
      });
    }
    else {
  
      $scope.projects.forEach(function(project){
        project.include="0";
      });
    }
  };
  

   //We page our requests: Only send 20 requests out at a time.
  //This is because the server is slow sometimes

  
  

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
    
  $scope.go = function(target) {
    $location.path('/');
  };
  
 
}]);