angular.module('clearConcert')
.controller('HomeCtrl',['$scope','$location', 'Favorites', 'settings', 
                        function($scope, $location, Favorites, settings){
	$scope.search={
		text:""
	};
	
	$scope.queryFavsLength = Favorites.getFavsByType(settings.repository, favoriteTypes.QUERY).length;

	$scope.go = function(target) {
		$scope.$hidePanel();
		$location.path('/' + target);
	};

}]);