angular.module('clearConcert').
controller('BuildLogCtrl', ['$scope', '$routeParams', '$loadDialog', '$location', 'build',
function($scope, $routeParams, $loadDialog, $location, build) {
	
	$scope.go = function(target) {
	    $location.path('/'+target);
	};
	
	
	$scope.logFile = {};
	if (build.logContentPath != "" ){
		var promise = build.getLogFile(build.logContentPath).then(function(data){
	    	$scope.logFile = data;
	    	return data;
	    });
	    $loadDialog.waitFor(promise, "Fetching Log...");
	}
}]);