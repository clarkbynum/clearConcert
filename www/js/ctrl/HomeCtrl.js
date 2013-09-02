angular.module('clearConcert')
.controller('HomeCtrl',['$scope','$location',
function($scope, $location){
	$scope.search={
		text:""
	};

	

	$scope.go = function(target) {
		$scope.$hidePanel();
		$location.path('/' + target);
	};

}]);