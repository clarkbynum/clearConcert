angular.module('clearConcert')
.controller('FavoriteCtrl',['$scope', '$routeParams', 'newFavorites', 'settings', 'query', '$location',
function($scope, $routeParams, newFavorites, settings, query, $location){
	$scope.favs=[];
	$scope.title;
	$scope.favs = newFavorites.getFavsByType(settings.repository, $routeParams.favoriteType);
	
	switch($routeParams.favoriteType){
		case '1':
			$scope.title="Queries";
			break;
		case ('2'):
			$scope.title="Work Items";
			break;
		case ('3'):
			$scope.title="Searches";
			break;
		case ('4'):
			$scope.title="Builds";
			break;
	}

	$scope.selectQuery = function(queryObj) {
    query.resultsForQuery(queryObj.projectId, queryObj.queryId).then(function(result) {
      if (result.items.length === 0) {
        queryObj.noResults = true;
      } else {
        $location.path("/query/$0/$1".format(queryObj.projectId, queryObj.queryId));
      }
    });
  };
}]);