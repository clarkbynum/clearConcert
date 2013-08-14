angular.module('clearConcert')
.factory('newFavorites', ['storage', 'settings' , function(storage, settings){
	var getFavs = function(){
		var	favs = JSON.parse(localStorage['favorites']);
		return favs;
	}
	var addFav = function(fav){
		var allFavs = localStorage['favorites'];
		allFavs = JSON.parse(allFavs);
		if (allFavs instanceof Array) {
			for (var i in allFavs) {
				if (fav['projectId'] == allFavs[i]['projectId'] && fav['queryId'] == allFavs[i]['queryId'] && fav['repositoryId'] == allFavs[i]['repositoryId'] && fav['type'] == allFavs[i]['type']) {
					console.log('we got a match');
					return;
				} else {
					continue;
				}
			}
		} else {
			console.log('hit');
			allFavs = [];
		}
		allFavs.push(fav);
		localStorage['favorites'] = JSON.stringify(allFavs);
	};
	var removeFav = function(projectId, queryId, type) {
		var allFavs = getFavs();
		for (i in allFavs) {
			if (projectId == allFavs[i]['projectId'] && queryId == allFavs[i]['queryId'] && settings.repository == allFavs[i]['repositoryId'] && type == allFavs[i]['type']) {


				allFavs.splice(i, 1);
				localStorage['favorites'] = JSON.stringify(allFavs);
				return;
			} else {
				continue;
			}
		}
	};
	var newQueryFav = function(projectId, queryId, type) {
		var newFav = {
			projectId: projectId,
			queryId: queryId,
			repositoryId: settings.repository,
			type: type 

		};
		return newFav;
	};
	var checkFav = function(projectId, queryId, type) {
		var allFavs = JSON.parse(localStorage['favorites']);
		for (var i in allFavs) {
			if (projectId == allFavs[i]['projectId'] && queryId == allFavs[i]['queryId'] && settings.repository == allFavs[i]['repositoryId'] && type == allFavs[i]['type']){
				return true;
			}
		}
		return false;
	};

	var Favorites = {
		getFavs: getFavs,
		addFav: addFav,
		removeFav: removeFav,
		newQueryFav: newQueryFav,
		checkFav: checkFav
	};
	return Favorites;

}]);
