angular.module('clearConcert').
controller('BuildCtrl',['$scope', '$loadDialog', '$location', '$routeParams', 'catalog', 'build',
function($scope, $loadDialog, $location, $routeParams, catalog, build){
	var projectId = $routeParams.projectId;

	$scope.projects = function() {
	    return catalog.list();
	  };
	$scope.getProjectBuilds = function(projectId) {
    var promise = build.buildsForProject(projectId).then(function(builds) {
      $scope.builds = builds;
      return builds;
    }, function(response) {
      //Dialog.error("Error Fetching Project Builds");
      alert("Error Fetching Project Builds");
    });
    $loadDialog.waitFor(promise, 'Loading Builds...');
    return promise;
  };

  $scope.filterBuilds = function(results) {
    if ($scope.resultFilterInput) {
      results = filterFilter(results, $scope.resultFilterInput);
    }
    /*
    return orderByFilter(results, function(item) {
      return item.identifier;
    });*/
    return results;
  };

  $scope.selectProject = function(proj) {
    $scope.getProjectBuilds(proj.projectId).then(function(builds) {
      $scope.builds = builds;
      if (builds.length === 0) {
        var err = "No Builds found in '$0'";
        //Toast.show(err.format(proj.title));
        alert(err.format(proj.title));
      } else {
        $location.path("/build/$0".format(proj.projectId));
      }
    });
  };
}]);