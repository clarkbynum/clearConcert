//types
// 1 - query
// 2 - work item
// 3 - search
// 4 - build

angular.module('clearConcert')
.factory('newFavorites', ['storage', 'settings' , function(storage, settings){
	

	var getFavsByType = function(repository, type){
		var favs = getFavs();
		var ret =[];
		for (var i = 0; i < favs.length; i++) {
			if (favs[i].type==type && favs[i].repositoryId === repository){
				ret.push(favs[i]);
			}
		};
		
		return ret;
	};

	var getFavs = function(){
		var rawFavs = localStorage['favorites'];
		
		if(rawFavs) {
			return JSON.parse(localStorage['favorites']);
		} else {
			return {};
		}
	};

	var addFav = function(fav){
		var rawFavs = localStorage['favorites'];
		if (typeof rawFavs === 'string') {
			if (rawFavs == "" ) {
				rawFavs = "[]";
			}
			var allFavs = JSON.parse(rawFavs);
		}
		if (!(allFavs instanceof Array)) {
			allFavs = [];
		}


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
		var rawFavs = localStorage['favorites'];
		if (typeof rawFavs === 'string') {
			if (rawFavs == "" ) {
				rawFavs = "[]";
			}
			var allFavs = JSON.parse(rawFavs);
		}
		if (!(allFavs instanceof Array)) {
			allFavs = [];
		}

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
		checkFav: checkFav,
		getFavsByType: getFavsByType
	};
	return Favorites;

}]);
