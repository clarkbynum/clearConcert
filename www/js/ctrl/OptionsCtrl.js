angular.module('clearConcert')
.controller('OptionsCtrl', ['$scope','$location', 'auth', function($scope,$location, auth){
	$scope.search={
		text:""
	};

	$scope.searchPressed = function(criteria){
		//If it's a number, go straight to it
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

	$scope.logout = function() {
		console.log('logged out');
		$scope.$hidePanel();
		auth.logout();
		//$location.path('/splash');
	  };


}]);
