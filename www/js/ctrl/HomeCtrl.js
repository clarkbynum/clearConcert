angular.module('clearConcert')
.controller('HomeCtrl',['$scope','$location',
function($scope, $location){
	$scope.search={
		text:""
	};

	$scope.searchPressed = function(criteria){
		//If it's a number, go straight to it
		console.log('called');
		$scope.$hidePanel();
		if (criteria == +criteria) {
			$location.path('/workitem/$0'.format(criteria));
		} else { 
			$location.path('/search/$0'.format(criteria));
		}
	};
	$scope.go = function(target) {
		$scope.$hidePanel();
		$location.path('/' + target);
	};

}]);