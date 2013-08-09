angular.module('clearJazz')
.controller('LoginCtrl', function($scope, auth,  $location, settings, promiseTracker, $dialog, rootServices, appConfig) {
 $scope.repository = settings.repository;
 $scope.username = settings.username;
 $scope.password = settings.password;

  $scope.appname = appConfig.appName;


  $scope.repositoryIsValid = function(){
		if($scope.repository.indexOf("https://") > -1 || $scope.repository.indexOf("http://") > -1 || 
				$scope.repository.indexOf("Https://")  >-1 || $scope.repository.indexOf("Http://") > -1){
		      return true;
		}
    return false;
  };
  
  $scope.setRepository = function() {
	if($scope.repositoryIsValid()){
	    settings.repository = $scope.repository.toLowerCase();
      var promise = rootServices.fetch().then(function(){
        $location.path("/login-credentials");
      });    
	}
  };

  $scope.$watch('username', function(u) {
    settings.username = u;
  });
  $scope.$watch('password', function(p) {
    settings.password = p;
  });

  $scope.go = function(target){
    $location.path(target);
  };
  
  $scope.$on('auth.logout', function() {
    $scope.repository = $scope.username = $scope.password = '';
  });



  $scope.login = function() {
    document.activeElement && document.activeElement.blur && document.activeElement.blur();
  
    var promise = auth.login($scope.repository, $scope.username, $scope.password)
    .then(function() {
      $scope.$nav.go('/');
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
      if (!message) {
        if (!settings.isUntrusted) {
          return Dialog.confirm("Login Failed", "Your server is not responding.<br>You are currently not allowing untrusted servers.  Would you like to try again with 'Allow Untrusted Servers' turned on?", "No", "Yes", function(wasNo) {
            $scope.$apply(function() {
              if (wasNo) {
                $scope.go('/login-repository', true);
              } else {
                settings.setUntrusted(true).then($scope.login);
              }
            });
          });
        } else {
          message = 'Your server is not responding.<br>Your repository address may be incorrect, or your internet may disconnected.';
          alert(message);//AA Remove this
          $scope.go('/login-repository', true);
          // return Dialog.message("Login Failed", message, function() {
          //   $scope.$apply(function() {
          //     $scope.go('/login-repository', true);
          //   });
          // });
        }
      }
      alert("Login Failed"); //AA Remove this
      //Dialog.message("Login Failed", message);
    });
    promiseTracker('fullSpin').addPromise(promise, 'Logging in...');
    return promise;
  };

  $scope.allowUntrusted = settings.isUntrusted;
  $scope.$watch('allowUntrusted', function(val) {
    if (angular.isDefined(val) && val != settings.isUntrusted) {
      settings.setUntrusted(val);
    }
  });

  $scope.repos = settings.savedRepos;
  $scope.setRepoFromRecent= function(r){
      settings.repository = r.repository; 
      settings.username = r.username;
      var promise = rootServices.fetch().then(function(){
        $location.path("/login-credentials");
      }); 
  };
});