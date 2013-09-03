angular.module('clearConcert').controller('BuildDetailsCtrl',
		['$scope', '$routeParams', '$loadDialog', '$location', 'build',
		 function($scope, $routeParams, $loadDialog, $location, build) {
	
	$scope.go = function(target) {
	    $location.path('/'+target);
	};
	
	$scope.resultDetail = {};
	var promise = build.detailsForResult($routeParams['result']).then(function(data) {
		$scope.resultDetail = data;
		return data;
	});
	$loadDialog.waitFor(promise, "Fetching Details...");
}]);