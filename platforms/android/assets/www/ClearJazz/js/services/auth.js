angular.module('clearJazz')
.factory('auth', ['$rootScope','$http','$q','$timeout','catalog','rootServices','appConfig',
function($rootScope, $http, $q, $timeout, catalog, rootServices, appConfig) {
  var authService = {};
  var loggedIn = false;
  

  function setLoggedIn(isIn) {
    loggedIn = isIn; 
  }

  authService.login = function login(repository, username, password) {
    //RRC logs in through the JTS domain.... need to pull that url from rootservices
    var loginUrl = repository;
    if (appConfig.appName==="ClearComposer") {
      var rootServiceXML = rootServices.getRootServiceXML();
      loginUrl = rootServiceXML.getElementsByTagNameNS("http://jazz.net/xmlns/prod/jazz/discovery/1.0/", "viewletServiceRoot")[0].getAttribute("rdf:resource");
    }

    var loginDeferred = $q.defer();

    if (!loginUrl || !username || !password) {
      return $q.reject("You need to fill in a valid repository address, username, and password.");
    }
    if (loginUrl[loginUrl.length-1] != '/') {
      loginUrl += '/';
    }

    function success() {
      $rootScope.$broadcast("auth.login", repository, username, password);
      setLoggedIn(true);
    }

    var usernameEncoded = encodeURIComponent(username);
    var passwordEncoded = encodeURIComponent(password);

    var paramCredentials = {
      j_username: usernameEncoded,
      j_password: passwordEncoded
    };
    var credentialForm = "j_username="+ username+"&j_password="+password;
    
    var identityHeaders = { 
      'Authorization': 'Basic ' +((username + ":" + password).toBase64())
    }; 

    var securityHeaders = {
      'Authorization': 'Basic ' +((username + ":" + password).toBase64()),
      'Content-Type':'application/x-www-form-urlencoded',
      'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'X-Requested-With':'XMLHttpRequest',
      'OSLC-Core-Version':'2.0',
      'X-com-ibm-team-notCSRF':'true'
    };

    function checkIdentity() {
      return $http.get(loginUrl + 'authenticated/identity'//, {headers: identityHeaders}
      ).then(function(response) {
    	  // check to see if we already have a good credential
        if ( typeof response.data.userId!='undefined'){
          //just return
          return response;
        }
        return $http.post(loginUrl + "authenticated/j_security_check", 
          credentialForm,
          {headers: securityHeaders}
        );
      }).then(function(response) {
    	 
        //check failure for RTC
        switch (appConfig.appName){
          case "ClearConcert":
          case "ClearComposer":
            var authMessage = response.headers()['x-com-ibm-team-repository-web-auth-msg'];
            if (authMessage == "authfailed") {
              return $q.reject("Your username or password was invalid.");
            }
            break;
          case "ClearQuality":
            debugger;
            break;
        }
          
        var deferred = $q.defer();
        var http = new XMLHttpRequest();
        var url = loginUrl;
        http.onreadystatechange = function(response) {
          if (http.readyState == 4) {
            if (http.status == 200 || http.status == 404) {
              deferred.resolve(response);
            } else {
              deferred.reject(response);
            }
            $rootScope.$apply();
          }
        };
        //debugger;
        http.open("GET", repository, true, usernameEncoded, passwordEncoded);
        http.send(null);
        return deferred.promise;
      });
    }

    var timedOut = false;
    $timeout(function() {
      timedOut = true;
      loginDeferred.reject();
    }, 10 * 1000);

    checkIdentity().then(function() {
      if (!timedOut) {
        success();
        return catalog.fetch().then(loginDeferred.resolve);
      }
    }, loginDeferred.reject);

    return loginDeferred.promise;
  };

  authService.logout = function() { 
    setLoggedIn(false);
    $rootScope.$broadcast('auth.logout');
  };

  authService.loggedIn = function() {
    return loggedIn;
  };
  return authService;
}]);
    /*
    function checkIdentity(doNotRetry) {
      var deferred = $q.defer();
      $ajax({ url: identityUrl, headers: headers })
      .then(function(args) {
        $ajax({
          type: "POST",
          url: securityUrl,
          data: data,
          headers: headers
        }).then(function(args) {
          var response = args[0], headers = args[1];
          var authMessage = headers['X-com-ibm-team-repository-web-auth-msg'];
          if (authMessage == "authfailed") {
            return deferred.reject("Invalid username or password.");
          } else {
            return deferred.resolve();
          }
          var http = new XMLHttpRequest();
          var url = repository;
          http.onreadystatechange = function(response) {
            if (http.readyState == 4) {
              if (http.status == 200 || http.status == 404) {
                deferred.resolve(response);
              } else {
                deferred.reject(response);
              }
              $rootScope.$apply();
            }
          };
          http.open("GET", url, true, username, password);
          http.send(null);
        }, deferred.reject);
      }, deferred.reject);
      return deferred.promise;
    }
    var retriedJazzNet = false;
    return checkIdentity().then(success, function(err) {
      if (!retriedJazzNet && repository.indexOf("jazz.net/jazz") > -1) {
        retriedJazzNet = true;
        return checkIdentity().then(success);
      } else {
        return err;
      }
    });*/
