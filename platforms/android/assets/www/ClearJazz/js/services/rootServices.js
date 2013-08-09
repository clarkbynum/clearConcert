//rootservices.js
angular.module('clearJazz')
.factory('rootServices', ['$http', '$rootScope', '$q', '$timeout', '$log',
function($http, $rootScope, $q, $timeout, $log) {
	var _rootServices = "";
	var _isLoaded = false;

	var parser = new DOMParser();
	var servicesPath = "rootservices";

	$rootScope.$on('auth.logout', function() {
		_isLoaded = false;
	});

	function getRootServices(repository) {
		_rootServletUrl="";
		_isLoaded = false;
		if (repository[repository.length-1] != '/') {
	      repository += '/';
	    }
		return $http.get(repository + "rootservices").then(function(response) {
			return parseRootServicesItems(response.data);
		}).then(function(data) {
			_isLoaded = true;
			_rootServletUrl = data;
			if (_rootServletUrl[_rootServletUrl.length-1] != '/') {
		      _rootServletUrl += '/';
		    }
			$rootScope.$broadcast("rootservices.loaded");
            $log.info("rootservices:get:success");
			return _rootServletUrl;
		}, function error(response) {
			$log.error("Could not retrieve rootservices", response.data);
		});
	};

	//return the rootservices as xml
	function parseRootServicesItems(data) {
		var rooturl = "";
		_rootServices = parser.parseFromString(data, "text/xml");
		// rooturl = xml.getElementsByTagNameNS("http://jazz.net/xmlns/prod/jazz/discovery/1.0/", "viewletServiceRoot")[0].getAttribute("rdf:resource");


		return _rootServices;
	}

	return {
		load: function() {
			if (!_isLoaded) {
				var deferred = $q.defer();
				var removeListener = $rootScope.$on('rootservices.loaded', function(){ 
					deferred.resolve();
					removeListener();
				});
				return deferred.promise;
			} else {
				return $q.when(true);
			}
		},
		getRootServiceXML: function() {
			return _rootServices;
		},

		fetch: function(repositoryUrl) {
			return getRootServices(repositoryUrl);
			//return this.load();
		}
	};
}]);