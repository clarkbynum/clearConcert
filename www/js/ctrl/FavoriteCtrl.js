angular.module('clearConcert')
.controller('FavoriteCtrl',['$scope', '$routeParams', 'newFavorites',
function($scope, $routeParams, $newFavorites){
	$scope.favorites;
	$scope.favoriteType = $routeParams.favoriteType;
	if ($scope.favoriteType==='queries') {
    	$scope.$favorites = newFavorites.getFavs();
  	}

}]);