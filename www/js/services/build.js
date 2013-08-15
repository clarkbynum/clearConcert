angular.module('clearConcert')
.service('build', ['settings', '$http', '$q', '$loadDialog',
		function(settings, $http, $q, $loadDialog){

			this.getAutomationProjects = function(){
				// return $http.get("$0oslc/automation/catalog".format(settings.repository)

				//    ).then(function(response) {
				//      return parseAutomationProjects(response.data);

				//    }).then(function(data){
				//    	debugger;
				//    });
			};

			//return the rootservices as xml
			function parseAutomateProjects(data) {
				// var rooturl = "";
				// var _automationProjects = parser.parseFromString(data, "text/xml");
				// // rooturl = xml.getElementsByTagNameNS("http://jazz.net/xmlns/prod/jazz/discovery/1.0/", "viewletServiceRoot")[0].getAttribute("rdf:resource");


				// return _automationProjects;
			};

			var getUrl = function(build, proj){
				var deferred  = $q.defer();

				var headers = {
					'Accept': 'application/rdf+xml, application/xml, text/html'
				};
				$http.get("$0oslc/contexts/$1/automation/plans".format(settings.repository, proj), {headers: headers}).success(function(data){
					var xml = parser.parseFromString(data, 'text/xml');
					var resultsURL = "";	
					var plans = xml.getElementsByTagName("plan");
					for ( var i in plans) {
						if (plans[i].getElementsByTagName("identifier")[0].firstChild.textContent ==  build) {
							resultsURL = plans[i].getElementsByTagName("results")[0].getAttribute("oslc_cm:collref");
							deferred.resolve(resultsURL);
							break;
						} 
					}
				});
				return deferred.promise;
			};
			var getData = function(url) {
				var deferred = $q.defer();
				$http.get(url).success(function(data) {
					var useable = []
					var stuff = data['oslc_cm:results'];
					for(var i in stuff) {
						var newObj = {};
						newObj['name'] = stuff[i]['dc:name'];
						newObj['state'] = stuff[i]['oslc_auto:state'];
						useable.push(newObj);
					}
					deferred.resolve(useable);
				});
				return deferred.promise;
			};

			this.resultsForBuild = function(build, proj) {
				return getUrl(build, proj).then(function(data){
					return getData(data);
				});
			};
			//test
			var parser = new DOMParser();
			this.buildsForProject = function(projectId) {
				console.log(projectId);
				var headers = {
					'Accept': 'application/rdf+xml, application/xml, text/html'
				};
				return $http.get("$0oslc/contexts/$1/automation/plans".format(settings.repository, projectId), {headers: headers
				}).then(function(response) {
					var xml = parser.parseFromString(response.data, 'text/xml');
					var builds = [];
					angular.forEach(xml.getElementsByTagName("plan"), function(plan) {
						console.log(plan);
						var title = plan.getElementsByTagName("title")[0].firstChild.textContent;
						if (plan.getElementsByTagName("description")[0].firstChild == null) {
							var description = "";
						} else {
							var description = plan.getElementsByTagName("description")[0].firstChild.textContent;
						}
						var identifier = plan.getElementsByTagName("identifier")[0].firstChild.textContent;
						var fullBuildDefinition = {
							title: title,
						description: description,
						identifier: identifier
						};
						builds.push(fullBuildDefinition);
					});
					return builds;
				});
			};
		}]);
