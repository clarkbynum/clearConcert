angular.module('clearJazz')
.factory('settings', ['$rootScope','$q','$timeout','$loadDialog','stripUrlProtocolFilter',
function($rootScope, $q, $timeout,$loadDialog,stripUrlProtocolFilter) {
  Base64.extendString();
  var settings = {};
  var remember = true;
  function load() {
    try {
      settings = JSON.parse(localStorage.settings || "{}") || {};
      if (settings.password) {
        settings.password = settings.password.fromBase64();
      }
    }catch(e) { erase(); }
  }
  function save() {
    if (remember) {
      var setts = angular.extend({}, settings, {
        password: settings.password.toBase64()
      });
      localStorage.settings = JSON.stringify(setts);
    }
  }
  function erase() {
    localStorage.removeItem("settings");
    settings.repository = settings.username = settings.password = null;
  }
  load();

  settings.isUntrusted = localStorage.isUntrusted === "true";
  settings.setUntrusted = function(isUntrusted) {
    isUntrusted = !!isUntrusted;
    localStorage.isUntrusted = settings.isUntrusted = isUntrusted;
    var deferred = $q.defer();
    if (typeof cordova !== "undefined") {
      document.addEventListener("deviceready", function() { 
        cordova.exec( 
         function success() {},
         function error() {},
         'Certificates', 
         'setUntrusted',
         [isUntrusted]
         );
      });
      
    } 
    $timeout(deferred.resolve, 100);
    return deferred.promise;
  };

  settings.testFunct = function(){
    return 15;
  };

  var readyToAuth = $q.defer();
  settings.setUntrusted(settings.isUntrusted).then(readyToAuth.resolve);
  
  settings.ready = function() {
    return readyToAuth.promise;
  };

  settings.savedRepos = JSON.parse(localStorage.savedRepos || "[]");
  //Convert old style string repos to objects
  settings.savedRepos = settings.savedRepos.map(function(repo) {
    if (angular.isString(repo)) {
      return { repository: repo, username: '' };
    }
    return repo;
  });

  function saveUsedRepo(repo, username) {
    //If this username/repo already exists, remove it
    settings.savedRepos = settings.savedRepos.filter(function(saved) {
      if (saved.repository == repo && saved.username == (username || '')) {
        return false;
      }
      return true;
    });

    //Put the newest at the top of the list
    settings.savedRepos.unshift({
      repository: repo,
      username: username
    });

    //Arbitrarily limit to 8
    if (settings.savedRepos.length > 8) {
      settings.savedRepos.length = 8;
    }
    localStorage.savedRepos = JSON.stringify(settings.savedRepos);
  }

  $rootScope.$on('auth.login', function($event, repository, username, password) {
    settings.repository = repository || '';
    settings.username = username || '';
    settings.password = password || '';
    save();
    saveUsedRepo(repository, username);
    // setTimeout(function() { 
    //   Toast.show("Signed in to $0 as $1".format(
    //     stripUrlProtocolFilter(settings.repository),
    //     settings.username
    //     ), 2500);
    // }, 800);
    $loadDialog.show("Signed in to "+stripUrlProtocolFilter(settings.repository)+" as "+settings.username);
    
    setTimeout(function() { 
      $loadDialog.hide();
    },2500)

  }); 
  $rootScope.$on('auth.logout', erase);

  return settings;
}]);
