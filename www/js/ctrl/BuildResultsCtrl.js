angular.module('clearConcert').controller('BuildResultsCtrl',
		['$scope', '$loadDialog', '$routeParams', '$location', 'build',
		 function($scope, $loadDialog, $routeParams, $location, build){
	
	$scope.go = function(target) {
	    $location.path('/'+target);
	};
	
	$scope.buildResults = [];
	var promise = build.resultsForBuild($routeParams['build'], $routeParams['proj']).then(function(data) {
		$scope.buildResults = data;
		return data;

	});
	console.log(promise);
	$loadDialog.waitFor(promise, "Fetching Results...");
	
	$scope.selectResult = function(selectedResult) {
		$location.path("/build/$0/$1/$2".format($routeParams['proj'], $routeParams['build'],
												selectedResult.resultId));
	};

}]);