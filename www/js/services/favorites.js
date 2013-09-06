favoriteTypes = {
		"QUERY" : 1,
		"WORKITEM" : 2,
		"SEARCH" : 3,
		"BUILD" : 4
};

angular.module('clearConcert').factory('Favorites', ['settings', 'catalog', 'build',
                                                     function(settings, catalog, build){
	
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
			if (rawFavs == "") {
				rawFavs = "[]";
			}
			var allFavs = JSON.parse(rawFavs);
		}
		if (!(allFavs instanceof Array)) {
			allFavs = [];
		}

		if (allFavs instanceof Array) {
			for (var i in allFavs) {
				if (fav['projectId'] == allFavs[i]['projectId'] && fav['keyId'] == allFavs[i]['keyId']
					 && fav['repositoryId'] == allFavs[i]['repositoryId'] &&
					 fav['type'] == allFavs[i]['type']) {
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
	
	var removeFav = function(projectId, keyId, type) {
		var allFavs = getFavs();
		for (i in allFavs) {
			if (projectId == allFavs[i]['projectId'] && keyId == allFavs[i]['keyId'] &&
					settings.repository == allFavs[i]['repositoryId'] && type == allFavs[i]['type']) {

				allFavs.splice(i, 1);
				localStorage['favorites'] = JSON.stringify(allFavs);
				return;
			} else {
				continue;
			}
		}
	};
	
	function newQueryOrSearchFav(projectId, queryId, type) {
		var title = catalog.byId(projectId).title;
		var newFav = {
			projectId: projectId,
			keyId: queryId,
			repositoryId: settings.repository,
			type: type,
			title: title,
			key: queryId
		};
		return newFav;
	}
	
	function newBuildFav(projectId, buildId, type) {
		var title = catalog.byId(projectId).title;
		var buildName = build.getBuildName(buildId);
		var newFav = {
				projectId: projectId,
				keyId: buildId,
				repositoryId: settings.repository,
				type: type,
				title: title,
				key: buildName
		};
		return newFav;
	}
	
	function newWorkItemFav(projectArea, workItemId, type, key) {
		var newFav = {
				projectId: projectArea,
				keyId: workItemId,
				repositoryId: settings.repository,
				type: type,
				title: projectArea,
				key: key
		}
		return newFav
	}
	
	var newFav = function(projectId, keyId, type, key) {
		switch(type) {
		case favoriteTypes.QUERY:
			return newQueryOrSearchFav(projectId, keyId, type);
		case favoriteTypes.BUILD:
			return newBuildFav(projectId, keyId, type);
		case favoriteTypes.WORKITEM:
			return newWorkItemFav(projectId, keyId, type, key);
		case favoriteTypes.SEARCH:
			return newQueryOrSearchFav(projectId, keyId, type);
		}
	};
	
	var checkFav = function(projectId, keyId, type) {
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
			if(projectId == allFavs[i]['projectId'] && keyId == allFavs[i]['keyId'] &&
			   settings.repository == allFavs[i]['repositoryId'] && type == allFavs[i]['type']){
				
				return true;
				
			}
		}
		return false;
	};

	var Favorites = {
		getFavs: getFavs,
		addFav: addFav,
		removeFav: removeFav,
		newFav: newFav,
		checkFav: checkFav,
		getFavsByType: getFavsByType
	};
	return Favorites;

}]);
