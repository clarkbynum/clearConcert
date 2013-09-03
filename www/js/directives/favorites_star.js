angular.module("clearConcert").directive("favoritesStar", function(Favorites) {
	return {
		restrict: 'E',
		templateUrl: 'template/directives/favorites_star.html',
		scope: {
			projectId: '=',
			queryId: '=',
			favType: '='
		},
		link: function(scope) {
			console.log("Running link again");
			scope.isFav = Favorites.checkFav(scope.projectId, scope.queryId, scope.favType);
			
			scope.addFavorite = function() {
				var newFav = Favorites.newQueryFav(scope.projectId, scope.queryId, scope.favType);
				Favorites.addFav(newFav);
				scope.isFav = true;
			};
			
			scope.removeFavorite = function() {
				Favorites.removeFav(scope.projectId, scope.queryId, scope.favType);
				scope.isFav = false;
			};
			
			
			// TODO: These should not be necessary, something weird is happening with navigation
			// that prevents the link function from being fired more then once.  Try to remove
			scope.$watch('queryId', function() {
				scope.isFav = Favorites.checkFav(scope.projectId, scope.queryId, scope.favType);
			}, true);
			
			scope.$watch('projectId', function() {
				scope.isFav = Favorites.checkFav(scope.projectId, scope.queryId, scope.favType);
			}, true)
		}
	};
});