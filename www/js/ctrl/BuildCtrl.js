angular.module('clearConcert').
controller('BuildCtrl',['$scope', '$loadDialog', '$location', '$routeParams', 'catalog', 'build',
		function($scope, $loadDialog, $location, $routeParams, catalog, build){
			var projectId = $routeParams.projectId;



			$scope.projects = function() {
				// var promise = build.getAutomationProjects().then(function(projects){
				// 	return projects();
				// })
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
			$scope.projBuilds = [];
			if ($routeParams['proj'] && !$routeParams['build']){
				$scope.projBuilds = build.buildsForProject($routeParams['proj']);
			}
			$scope.buildResults = [];
			if ($routeParams['proj'] && $routeParams['build'] && !$routeParams['result']) {
				var promise = build.resultsForBuild($routeParams['build'], $routeParams['proj']).then(function(data) {
					$scope.buildResults = data;
					return data;

				});
				console.log(promise);
				$loadDialog.waitFor(promise, "Fetching Results...");

			}
			$scope.resultDetail = {};
			if ($routeParams['proj'] && $routeParams['build'] && $routeParams['result']) {
				var promise = build.detailsForResult($routeParams['result']).then(function(data) {
					$scope.resultDetail = data;
					return data;
				});
				$loadDialog.waitFor(promise, "Fetching Details...");
			}
			$scope.selectResult = function(selectedResult) {
				console.log("/build/$0/$1/$2".format($routeParams['proj'], $routeParams['build'], selectedResult.resultId));
				$location.path("/build/$0/$1/$2".format($routeParams['proj'], $routeParams['build'], selectedResult.resultId));
			};
			$scope.selectBuild = function(selectedBuild) {	
				//build.resultsForBuild(selectedBuild, $routeParams['proj']).then(function(){
				$location.path("/build/$0/$1".format($routeParams['proj'], selectedBuild.identifier));
			};

			$scope.selectProject = function(proj) {
				console.log(proj);
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
			$scope.go = function(target) {
			    $location.path('/'+target);
			  };
			}]);
