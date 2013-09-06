angular.module("clearConcert").directive('headerBar', ['$location', function($location) {
	
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: "template/directives/header.html",
		link: function(scope) {

			scope.go = function(target) {
			    $location.path('/'+target);
			};
		}
	};
	
}]);