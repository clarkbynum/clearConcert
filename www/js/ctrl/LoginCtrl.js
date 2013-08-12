angular.module('clearConcert')
.controller('LoginCtrl', ['$scope', 'rootServices', 'settings', '$loadDialog', '$location', 'auth',
  function($scope, rootServices, settings, $loadDialog, $location, auth){


   $scope.repository = settings.repository;
   $scope.username = settings.username;
   $scope.password = settings.password;

  $scope.$on('auth.logout', function() {
    $scope.repository = $scope.username = $scope.password = '';
  });

  $scope.allowUntrusted = settings.isUntrusted;
  $scope.$watch('allowUntrusted', function(val) {
    if (angular.isDefined(val) && val != settings.isUntrusted) {
      settings.setUntrusted(val);
    }
  });
	
  $scope.repos = settings.savedRepos;
  $scope.repositoryIsValid = function(repositoryUrl){
    if(repositoryUrl.indexOf("https://") > -1 || repositoryUrl.indexOf("http://") > -1 || 
      repositoryUrl.indexOf("Https://")  >-1 || repositoryUrl.indexOf("Http://") > -1){
      
      return true;
    }
  return false;
  };

  $scope.standardizeUrl = function(repositoryUrl) {
    if (repositoryUrl[repositoryUrl.length-1] != '/') {
      repositoryUrl += '/';
    }
    return repositoryUrl;
  }

  $scope.onRepositoryDone = function(repositoryUrl){
    repositoryUrl = $scope.standardizeUrl(repositoryUrl);
    if ($scope.repositoryIsValid(repositoryUrl)){
     repositoryUrl = repositoryUrl.toLowerCase();
     settings.repository = repositoryUrl;
     var promise = rootServices.fetch(repositoryUrl);
     $loadDialog.waitFor(promise, "Getting Root Services");
     promise.then(function(){
      $location.path("/login-credentials");
    }); 
   }
  };
  $scope.setRepoFromRecent = function(repo){
	settings.username = repo.username;
	settings.repository = repo.repository;
	$location.path('/login-credentials');
  };

  $scope.onCredentialDone = function(repositoryUrl, username, password, allowUnstrusted) {
    //i think this forces the keyboard down on different devices
    repositoryUrl = $scope.standardizeUrl(repositoryUrl);
    document.activeElement && document.activeElement.blur && document.activeElement.blur();
    var promise = auth.login(repositoryUrl, username, password)
    .then(function() {
      $location.path('/');
    }, function(err) { 
      var message;
      if (angular.isString(err)) {
        message = err;
      } else if (angular.isObject(err)) {
        if (err.status != 404) {
          message = err.statusText || err.errorText;
          if (angular.isObject(err.data)) {
            message = err.data['oslc_cm:message'] || err.data.text || err.data.message;
          } else if (angular.isString(err.data)) {
            message = err.data;
          }
        }
      }
      //No message -> Bad serve r
      // if (!message) {
      //   if (!settings.isUntrusted) {
      //     return Dialog.confirm("Login Failed", "Your server is not responding.<br>You are currently not allowing untrusted servers.  Would you like to try again with 'Allow Untrusted Servers' turned on?", "No", "Yes", function(wasNo) {
      //       $scope.$apply(function() {
      //         if (wasNo) {
      //           $location.path('/login-repository');
      //         } else {
      //           settings.setUntrusted(true).then($scope.login);
      //         }
      //       });
      //     });
      //   } else {
      //     message = 'Your server is not responding.<br>Your repository address may be incorrect, or your internet may disconnected.';
      //     return Dialog.message("Login Failed", message, function() {
      //       $scope.$apply(function() {
      //         $location.path('/login-repository');
      //       });
      //     });
      //   }
      // }
      // Dialog.message("Login Failed", message);
      alert("Login Failed: "+message);
    });
    //promiseTracker('fullSpin').addPromise(promise, 'Logging in...');
    return promise;
  };

}]);
