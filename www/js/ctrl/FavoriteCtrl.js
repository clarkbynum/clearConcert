angular.module('clearConcert')
.controller('FavoriteCtrl',['$scope', '$routeParams', 'Favorites', 'settings', 'query', '$location',
	function($scope, $routeParams, Favorites, settings, query, $location){
		$scope.favs=[];
		$scope.title;
		$scope.favs = Favorites.getFavsByType(settings.repository, $routeParams.favoriteType);

		$scope.favTypeQuery = false;
		$scope.favTypeItem = false;
		$scope.favTypeSearch = false;
		$scope.favTypeBuilds = false;

		switch($routeParams.favoriteType){
			case '1':
			$scope.title="Queries";
			$scope.favTypeQuery=true;
			break;
			case ('2'):
			$scope.title="Work Items";
			$scope.favTypeItem = true;
			break;
			case ('3'):
			$scope.title="Searches";
			$scope.favTypeSearch = true;
			break;
			case ('4'):
			$scope.title="Builds";
			$scope.favTypeBuilds = true;
			break;
		}

		$scope.selectQuery = function(queryObj) {
			query.resultsForQuery(queryObj.projectId, queryObj.queryId).then(function(result) {
				$location.path("/query/$0/$1".format(queryObj.projectId, queryObj.queryId));
			});



		};

		$scope.goHome = function() {
			$location.path("/");
		};

		$scope.goConfig = function() {
			
		}
	}]);