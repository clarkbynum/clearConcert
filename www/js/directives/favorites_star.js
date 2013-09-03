angular.module("clearConcert").directive("favoritesStar", function(Favorites) {
	return {
		restrict: 'E',
		templateUrl: 'template/directives/favorites_star.html',
		scope: {
			projectId: '@',
			queryId: '@',
			favType: '@'
		},
		link: function(scope) {
			scope.favType = parseInt(scope.favType);
			scope.isFav = Favorites.checkFav(scope.projectId, scope.queryId, scope.favType);
			
			scope.addFavorite = function() {
				var newFav = Favorites.newFav(scope.projectId, scope.queryId, scope.favType);
				Favorites.addFav(newFav);
				scope.isFav = true;
			};
			
			scope.removeFavorite = function() {
				Favorites.removeFav(scope.projectId, scope.queryId, scope.favType);
				scope.isFav = false;
			};
		}
	};
});