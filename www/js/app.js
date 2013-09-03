//todo remove ngfocus and ngblur

var clearConcert = angular.module('clearConcert', ['jqm','ngMobile', 'clearJazz', 'mobiSelect'])

.config(['$routeProvider',
  function($routeProvider){
   $routeProvider.when('/', {
    templateUrl: 'template/home.html',
    animation: 'page-pop',
    controller: 'HomeCtrl'
  })
   .when('/splash', {
    templateUrl: 'template/splash.html',
    animation: 'page-pop',
   controller: 'LoginCtrl'
  })
  .when('/login-repository',{
    controller: 'LoginCtrl',
    templateUrl: 'template/login-repository.html',
    animation: 'page-pop'
  })
  .when('/login-credentials', {
    templateUrl:'template/login-credentials.html',
    controller: 'LoginCtrl',
    animation: 'page-pop'
  })
  .when('/settings', {
    templateUrl:'template/settings.html',
    controller: 'SettingsCtrl',
  })
   .when('/about', {
    templateUrl:'template/about.html',
    //controller: 'SettingsCtrl',
  })
  .when('/login-recent', {
    templateUrl: 'template/login-recent.html',
    controller: 'LoginCtrl'
  })
  .when('/quick-search/:query',{
    controller: 'QuickSearchCtrl',
    templateUrl: 'template/search-projects.html'
  })
  .when('/search',{
    controller: 'SearchCtrl',
    templateUrl: 'template/search.html'
  })
  .when('/search/:query', {
    controller: 'SearchCtrl',
    templateUrl: 'template/search-projects.html',
    resolve: {
      loadCatalog: loadCatalog
    },
    animation: 'page-pop'
  })
  .when('/search/:query/:projectId', {
    controller: 'ResultCtrl',
    templateUrl: 'template/results.html',
    resolve: {
      resultData: function($route, SearchResultData, catalog) {
        return catalog.load().then(function() {        
          return SearchResultData($route.current.params.query, $route.current.params.projectId);
        });
      },
      loadCatalog: loadCatalog
    },
    animation: 'page-pop'
  })
  .when('/workitem/:id/', {
    controller: 'WorkItemCtrl',
    templateUrl: 'template/workitem.html',
    resolve : {
      workItem: resolveWorkItem,
      loadCatalog: loadCatalog
    },
    animation: 'page-pop'
  })
  .when('/workitem/:id/:prop', {
    controller: 'WorkItemCtrl',
    templateUrl: 'template/workitem-edit.html',
    resolve: {
      workItem: resolveWorkItem
    }
  })
  .when('/create-workitem', {
      controller: 'WorkItemCtrl',
      templateUrl: 'template/workitem.html',
      resolve: {
        workItem: function(workItems, settings) {
          return workItems.create(settings.repository);
        },
        loadCatalog: loadCatalog
      }
    })
  .when('/query', {
    controller: 'QueryCtrl',
    templateUrl: 'template/query.html',
    resolve: {
      loadCatalog: loadCatalog
    },
    animation: 'page-pop'
  })
  .when('/query/:projectId', {
    controller: 'QueryCtrl',
    templateUrl: 'template/query-select.html',
    resolve: {
      loadCatalog: loadCatalog
    },
    animation: 'page-pop'
  })
  .when('/query/:projectId/:queryId', {
    controller: 'ResultCtrl',
    templateUrl: 'template/results.html',
    reloadOnSearch: false,
    resolve: {
      resultData: function($route, QueryResultData, catalog) {
        return catalog.load().then(function() {
          return QueryResultData($route.current.params.projectId, $route.current.params.queryId);
        });
      }
    },
    animation: 'page-pop'
  })
  .when('/build', {
    controller: 'BuildCtrl',
    templateUrl: 'template/build.html',
    animation: 'page-pop'
  })
  .when('/favorites/:favoriteType', {
    controller: 'FavoriteCtrl',
    templateUrl: 'template/favorites.html',
    animation: 'page-pop'
  })
  .when('/build/:proj', {
	  controller: 'ProjBuildsCtrl',
	  templateUrl: 'template/projbuilds.html',
    animation: 'page-pop'
  })
  .when('/build/:proj/:build', {
	controller: 'BuildResultsCtrl',
	templateUrl: 'template/buildresults.html',
  	animation: 'page-pop'
  })
  .when('/build/:proj/:build/:result', {
	controller: 'BuildDetailsCtrl',
	templateUrl: 'template/build_details.html',
    animation: 'page-pop'
  })  
  .otherwise({
    redirectTo: '/splash'
  });
  // then change page and inject workitem into the ctrl
  function resolveWorkItem($rootScope, $q, workItems, $route, settings, $loadDialog ) {
    var id = $route.current.params.id;
    if (id == 'new') {
      return workItems.create(settings.repository);
    } else {
      var promise = workItems.get(settings.repository, id).$fetch().then(function(item) {
        if (typeof item.status == 'undefined'){
          //item.$getAllLinks();
          return item.$getAllResources();
        }else{
         window.history.back();
        }
      });

      promise.then(function() {
        var deferred = $q.defer();
        $rootScope.$on('$pageTransitionSuccess', function() {
          deferred.resolve();
        });
        return deferred.promise;
      });
      $loadDialog.waitFor(promise, "Loading");
      //keep the spinner not just until the workitem is loaded, but the whole workitem page is parsed successfully
      // promiseTracker('fullSpin').addPromise(promise.then(function() {
      //   var deferred = $q.defer();
      //   $rootScope.$on('$pageTransitionSuccess', function() {
      //     deferred.resolve();
      //   });
      //   return deferred.promise;
      // }), 'Loading...');

      return promise;
    }
  }

  //Wait to load some pages until catalog is ready
  function loadCatalog(catalog) {
    return catalog.load();
  }

}])

.run(['settings','auth','$rootScope', '$location', '$http', '$templateCache',
  function(settings, auth, $rootScope, $location, $http, $templateCache){
  //just skip this so we can develop ui
  //return;
  if (settings.repository) {
    settings.ready().then(function() {
      return auth.login(settings.repository, settings.username, settings.password);
    })
    .then(appReady);
  } else {
    appReady();
  }

  function appReady() {
    if (auth.loggedIn()) {
      $location.path("/");
    } else {
      $location.path("/splash");
    }
    setTimeout(function() {
      document.addEventListener("deviceready", function() {
        navigator.splashscreen.hide();
      }, false);
    }, 750);

  }

  $rootScope.openExternalBrowser = function(url) {
    window.open(url, "_system");
  };

  //Make templates out of all the work item edit types
  $http.get('template/workitem-edit-types.html').then(function(response) {
  
    var htmlObject = document.createElement('div');
    htmlObject.innerHTML = response.data;
    var sections = htmlObject.getElementsByTagName('section');
    
    for(var i = 0; i < sections.length; i++){
      var url = 'template/edit/' + sections[i].id + '.html';
      $templateCache.put(url, '<div>' + sections[i].innerHTML + '</div>');
    }

  });

}])


.controller('AppCtrl', ['$scope', '$location', function($scope, $location){
   $scope.state={};
   $scope.$back = function(){
    window.history.back();
  };

  $scope.$hidePanel = function(){
    $scope.state.panel='';

  };
} ])

.directive('ngFocus', ['$parse', function($parse) {
  return function(scope, element, attr) {
    var fn = $parse(attr['ngFocus']);
    element.find('input').bind('focus', function(event) {
      scope.$apply(function() {
       fn(scope, {$event:event});
     });
    });
  };
}])

.directive('ngBlur', ['$parse', function($parse) {
  return function(scope, element, attr) {
    var fn = $parse(attr['ngBlur']);
    element.find('input').bind('blur', function(event) {
      scope.$apply(function() {
        fn(scope, {$event:event});
      });
    });
  };
}])
.run(['$rootScope', '$location', 'settings', function($rootScope, $location, settings) {
	$rootScope.$on('auth.logout', function() {
		settings.repository = null;
		settings.username = null;
		settings.password = null;
		$location.path('/splash');
	});
}]);
