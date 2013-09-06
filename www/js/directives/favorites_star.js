angular.module("clearConcert").directive("favoritesStar", function(Favorites) {
	return {
		restrict: 'E',
		templateUrl: 'template/directives/favorites_star.html',
		scope: {
			projectId: '@',
			keyId: '@',
			favType: '@',
			key: '@'
		},
		link: function(scope) {
			scope.favTypeInt = parseInt(scope.favType);
			scope.isFav = Favorites.checkFav(scope.projectId, scope.keyId, scope.favTypeInt);
			
			scope.addFavorite = function() {
				var newFav = Favorites.newFav(scope.projectId, scope.keyId, scope.favTypeInt, scope.key);
				Favorites.addFav(newFav);
				scope.isFav = true;
			};
			
			scope.removeFavorite = function() {
				Favorites.removeFav(scope.projectId, scope.keyId, scope.favTypeInt);
				scope.isFav = false;
			};
		}
	};
});