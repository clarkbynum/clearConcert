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

  $scope.testConnection = function(repository){
    settings.setUntrusted(true);

   $scope.standardizeUrl(repository);

    var xhr = new XMLHttpRequest();

    var rs0 = false;
      var rs1 = false;
      var rs2 = false;
      var rs3 = false;
      var rs4 = false;

    xhr.onreadystatechange=function(){
      
      if(xhr.readyState == 0 && !rs0){
        alert("request not initialized");
        rs0 = true;
      }else if(xhr.readyState == 1 && !rs1){
        alert("server connection established");
        rs1 = true;
      }else if(xhr.readyState == 2 && !rs2){
        rs2 = true;
        alert("request received");
      }else if(xhr.readyState == 3 && !rs3){
        rs3 = true;
        alert("processing request");
      }else if(xhr.readyState == 4 && !rs4){
        rs4 = true;
        alert("request finished. Status: " + xhr.status + "Response Text: " + xhr.responseText);
      }
    }

    xhr.open("GET", repository + "rootservices", true);
    xhr.send();

  };

  $scope.onRepositoryDone = function(repositoryUrl, allowUntrusted){
    if (angular.isDefined(allowUntrusted)) {
      settings.setUntrusted(allowUntrusted);
    }
    repositoryUrl = $scope.standardizeUrl(repositoryUrl);
    if ($scope.repositoryIsValid(repositoryUrl)){
     repositoryUrl = repositoryUrl.toLowerCase();
     settings.repository = repositoryUrl;

     var promise = rootServices.fetch(repositoryUrl);
     $loadDialog.waitFor(promise, "Getting Root Services");

     promise.then(function(){
      $location.path("/login-credentials");
     },  function(response){
         alert('Invalid server. Please check to ensure you have the correct URL ')
         console.log(response);

    }); 
   }else{
        alert('Please ensure the URL includes http:// or https://');
    }
  };




  $scope.setRepoFromRecent = function(repo){
	settings.username = repo.username;
	settings.repository = repo.repository;
	$location.path('/login-credentials');
  };
  $scope.go = function(target) {
	$location.path('/' + target);
  };

  $scope.onCredentialDone = function(repositoryUrl, username, password, allowUntrusted) {
    if (angular.isDefined(allowUntrusted)) {
      settings.setUntrusted(allowUntrusted);
    }
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
      alert("Login Failed: " + message);
    });
    //promiseTracker('fullSpin').addPromise(promise, 'Logging in...');
    return promise;
  };

}]);
