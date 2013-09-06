angular.module('clearConcert').
controller('BuildDetailsCtrl', ['$scope', '$routeParams', '$loadDialog', '$location', 'build',
function($scope, $routeParams, $loadDialog, $location, build) {
	
	$scope.go = function(target) {
	    $location.path('/'+target);
	};
	
	

	$scope.selectLog = function(selectedLog) {
        // $location.path("/build/$0/$1/$2/$3".format($routeParams['proj'], $routeParams['build'],
								// 				$routeParams['result'],selectedLog.filename));
		// build.getLogFile(selectedLog).then(function(data){
	 //    	$scope.logFile = data;
	 //    	return data;
	 //    });
	    build.logContentPath = selectedLog.filecontent;
	    $location.path("/build/$0/$1/$2/log".format($routeParams['proj'], $routeParams['build'],
								 				$routeParams['result']));
    }; 

    

    $scope.resultDetail = {};
	var promise = build.detailsForResult($routeParams['result']).then(function(data) {
		$scope.resultDetail = data;
		return data;
	});
	$loadDialog.waitFor(promise, "Fetching Details...");
}]);