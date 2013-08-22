angular.module('clearConcert')
.controller('HomeCtrl',['$scope','$location',
function($scope, $location){
	$scope.search={
		text:""
	};

	$scope.clearSearch = function(e){
        
       angular.element(e.srcElement).parent().children()[0].focus();

        $scope.search.text = "";
    };
    
    $scope.showX = function () {
    	return $scope.search.text ==="";
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

}]);