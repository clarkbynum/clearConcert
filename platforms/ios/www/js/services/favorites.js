
angular.module('clearConcert')
.service('favorites', ['workItems','settings','$q', 'storage','$rootScope',
function(workItems, settings, $q, storage, $rootScope) {
  var favService = this;

  var TYPE_SEARCH = 0;
  var TYPE_QUERY = 1;
  var TYPE_WORKITEM = 2;

  function save() {
    storage.set('favorites', _favorites.map(function(favorite) {
      return favorite.json();
    }));
  }
  function loadFavoritesForRepository(repo) {
    return (storage.get('favorites') || [])
      .filter(function(json) {
        return json.repository == repo;
      })
      .map(function(json) {
        //Support old versions of the app where strings are used
        if (json.type == TYPE_QUERY || json.type == "query") {
          return new FavoriteQuery(json);
        } else if (json.type == TYPE_SEARCH || json.type == "search") {
          return new FavoriteSearch(json);
        } else if (json.type == TYPE_WORKITEM || json.type == "workitem") {
          return new FavoriteWorkitem(json);
        }
      });
  }
  var _favorites = [];

  $rootScope.$on('auth.login', function($event, repository) {
    _favorites = loadFavoritesForRepository(repository);
  });

  function exists(favorite) {
    return _favorites.some(function(fav) {
      return favorite.equals(fav);
    });
  }
  function add(favorite) {
    _favorites.push(favorite);
    save();
  }
  function remove(favorite) {
    var index = _favorites.indexOf(favorite);
    _favorites.splice(index, 1);
    save();
  }
  function addIfNotExists(favorite) {
    if (!exists(favorite)) {
      add(favorite);
    }
  }
  function removeIfExists(favorite) {
    if (exists(favorite)) {
      remove(favorite);
    }
  }

  function FavoriteQuery(options) {
    var self = this;
    self.type = TYPE_QUERY;
    self.repository = options.repository || settings.repository;
    self.projectId = options.projectId;
    self.queryId = options.queryId;

    self.equals = function(other) {
      return other.repository == self.repository &&
        other.projectId == self.projectId &&
        other.queryId == self.queryId;
    };

    self.path = function() {
      return "/query/$0/$1".format(
        self.projectId,
        angular.isDefined(self.queryId) ? self.queryId : ''
      );
    };

    self.json = function() {
      return self;
    };
  }
  function FavoriteSearch(options) {
    var self = this;
    self.type = TYPE_SEARCH;
    self.repository = options.repository || settings.repository;
    self.query = options.query;
    self.projectId = options.projectId;

    self.equals = function(other) {
      return other.repository == self.repository &&
        other.query == self.query && 
        other.projectId == self.projectId;
    };

    self.path = function() {
      return "search/$0/$1".format(self.query,
        angular.isDefined(self.projectId) ? self.projectId : '');
    };

    self.json = function() {
      return self;
    };
  }
  function FavoriteWorkitem(options) {
    var self = this;
    self.type = TYPE_WORKITEM;
    self.repository = options.repository || settings.repository;
    self.identifier = options.identifier;

    self.equals = function(other) {
      return other.repository == self.repository &&
        other.identifier == self.identifier;
    };

    self.path = function() {
      return '/workitem/$0'.format(self.identifier);
    };

    self.json = function() {
      return { 
        type: self.type,
        repository: self.repository,
        identifier: self.identifier
      };
    };
  }

  favService.TYPE_WORKITEM = TYPE_WORKITEM;
  favService.TYPE_SEARCH = TYPE_SEARCH;
  favService.TYPE_QUERY = TYPE_QUERY;

  favService.addWorkitem = function(identifier) {
    var favorite = new FavoriteWorkitem({
      identifier: identifier
    });
    addIfNotExists(favorite);
    return favorite;
  };
  favService.getWorkitemFavorite = function(identifier) {
    return _favorites.filter(function(fav) {
      return fav.type == TYPE_WORKITEM && fav.identifier == identifier;
    })[0];
  };
      
  favService.addQuery = function(projectId, queryId) {
    var favorite = new FavoriteQuery({
      projectId: projectId,
      queryId: queryId
    });
    addIfNotExists(favorite);
    return favorite;
  };
  favService.getQueryFavorite = function(projectId, queryId) {
    return _favorites.filter(function(fav) {
      if (projectId == fav.projectId) {
        //If this is a project-only favorite with no queryId, and we didn't
        //give a queryId, then this is a match! hooray!
        if (!angular.isDefined(queryId) && !angular.isDefined(fav.queryId)) {
          return true;
        } else {
          return queryId == fav.queryId;
        }
      }
    })[0];
  };

  favService.addSearch = function(query, projectId) {
    var favorite = new FavoriteSearch({
      query: query,
      projectId: projectId
    });
    addIfNotExists(favorite);
    return favorite;
  };
  favService.getSearchFavorite = function(query, projectId) {
    return _favorites.filter(function(fav) {
      if (projectId == fav.projectId) {
        //If this is a project-only favorite with no query, and we didn't
        //give a query, then this is a match! hooray!
        if (!angular.isDefined(query) && !angular.isDefined(fav.query)) {
          return true;
        } else {
          return query == fav.query;
        }
      }
    })[0];
  };

  favService.remove = function(favorite) {
    removeIfExists(favorite);
  };
  favService.list = function(repository) {
    return _favorites;
  };
}]);
