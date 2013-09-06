angular.module('clearConcert')
.controller('FavoriteCtrl',['$scope', '$routeParams', 'Favorites', 'settings', 'query', '$location',
	function($scope, $routeParams, Favorites, settings, query, $location){
		$scope.favs=[];
		$scope.title;
		$scope.select = null;
		
		$scope.favs = Favorites.getFavsByType(settings.repository, $routeParams.favoriteType);
		
		function selectQuery(queryObj) {
			query.resultsForQuery(queryObj.projectId, queryObj.keyId).then(function(result) {
				$location.path("/query/$0/$1".format(queryObj.projectId, queryObj.keyId));
			});
		}
		
		function selectBuild(buildObj) {
			$location.path("/build/$0/$1".format(buildObj.projectId, buildObj.keyId));
		}
		
		function selectWorkItem(workItem) {
			$location.path("/workitem/$0".format(workItem.keyId));
		}
		
		function selectSearch(searchObj) {
			$location.path("/search/$0/$1".format(searchObj.keyId, searchObj.projectId));
		}

		switch($routeParams.favoriteType){
		case '1':
			$scope.title="Queries";
			$scope.select = selectQuery;
			break;
		case ('2'):
			$scope.title="Work Items";
			$scope.select = selectWorkItem;
			break;
		case ('3'):
			$scope.title="Searches";
			$scope.select = selectSearch;
			break;
		case ('4'):
			$scope.title="Builds";
			$scope.select = selectBuild;
			break;
		}

		$scope.goHome = function() {
			$location.path("/");
		};

		$scope.goConfig = function() {
			
		}
	}]);