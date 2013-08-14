angular.module('clearConcert')
.factory('newFavorites', ['storage', 'settings' , function(storage, settings){
	var getFavs = function(){
		var	favs = localStorage['favorites'];
		return favs;
	}
	var addFav = function(fav){
		console.log(fav);
		var allFavs = localStorage['favorites'];
		console.log("favorites: " + localStorage['favorites']);
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
		console.log("new favorites: " + localStorage['favorites']);
	};
	var removeFav = function(fav) {
		var allFavs = getFavs();
		for (i in allFavs) {
			if (fav == allFavs[i]) {
				allFavs.splice(i, 1);
				return;
			} else {
				continue;
			}
		}
	};
	var newQueryFav = function(projectId, queryId) {
		var newFav = {
			projectId: projectId,
			queryId: queryId,
			repositoryId: settings.repository,
			type: 1
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
		console.log(projectId + " : "+ allFavs[i]['projectId']);
		console.log(queryId + " : " + allFavs[i]['queryId']);
		console.log(settings.repository + " : " + allFavs[i]['repositoryId']);
		console.log(type + " : " + allFavs[i]['type']);	
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
