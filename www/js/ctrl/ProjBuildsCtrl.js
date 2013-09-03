angular.module('clearConcert').controller('ProjBuildsCtrl',
		['$scope', '$routeParams', '$location', 'build',
		 function($scope, $routeParams, $location, build) {
	
	$scope.go = function(target) {
	    $location.path('/'+target);
	};
	
	$scope.projBuilds = [];
	$scope.projBuilds = build.buildsForProject($routeParams['proj']);
	
	$scope.selectBuild = function(selectedBuild) {
		$location.path("/build/$0/$1".format($routeParams['proj'], selectedBuild.identifier));
	};
}]);