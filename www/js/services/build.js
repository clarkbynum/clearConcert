angular.module('clearConcert')
.service('build', ['settings', '$http', '$q', '$loadDialog',
		function(settings, $http, $q, $loadDialog){
	
			idToNameMap = {};

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
						newObj['resultId'] = stuff[i]['dc:identifier'];
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

			var getDetails = function(result) {
				var deferred = $q.defer();
				$http.get("$0oslc/automation/results/$1".format(settings.repository, result)).success(function(data) {
					var detObj = {};
					detObj['label'] = data['dc:name'];
					detObj['definition'] = data['oslc_auto:plan']['rdf:resource'];
					detObj['creator'] = data['dc:creator']['rdf:resource'];
					detObj['start'] = data['oslc_auto:started'];
					detObj['end'] = data['oslc_auto:ended'];
					detObj['logs'] = data['oslc_auto:contributions']['rdf:resource'];
					deferred.resolve(detObj);
				});
				return deferred.promise;
			};

			var getDetailDefinition = function(detObj) {
				var deferred = $q.defer();
				var headers = {
					'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
					'Cache-Control': 'max-age=0'
				};
				$http.get(detObj['definition'], {headers: headers}).success(function(data) {
					var xml = parser.parseFromString(data, 'text/xml');
					var definition = xml.getElementsByTagName("plan")[0].getElementsByTagName("title")[0].firstChild.textContent;
					detObj['definition'] = definition;
					deferred.resolve(detObj);
				});
				return deferred.promise;
			};

			var getDetailCreator = function(detObj) {
				var deferred = $q.defer();
				$http.get(detObj['creator']).success(function(data) {
					detObj['creator'] = data['foaf:name'];
					deferred.resolve(detObj);
				});
				return deferred.promise;
			};
			var getDetailLogs = function(detObj) { 
				var deferred = $q.defer();
				$http.get(detObj['logs']).success(function(data) {
					detObj['logs'] = [];
					for (var i in data['oslc_cm:results']) {
						if (data['oslc_cm:results'][i]['rtc_build:contributionType'] == "com.ibm.team.build.common.model.IBuildResultContribution.log") {
							logObj = {};
							logObj['filename'] = data['oslc_cm:results'][i]['oslc_auto:fileName'];
							logObj['filesize'] = data['oslc_cm:results'][i]['oslc_auto:fileSize'];
							logObj['filecontent'] = data['oslc_cm:results'][i]['oslc_auto:fileContent'];
							detObj['logs'].push(logObj);
						}
					}
					deferred.resolve(detObj);
				});
				return deferred.promise;
			};

			this.detailsForResult = function(result) {
				return getDetails(result).then(function(dets) {
					return getDetailDefinition(dets).then(function(detsWithDefinition) {
						return getDetailCreator(detsWithDefinition).then(function(detsWithCreator) {
							return getDetailLogs(detsWithCreator);
						});
					});
				});
			};

			//variable to store and share the lookup path for the log file
			this.logContentPath="";
			//function to look up the log file content
			this.getLogFile = function(logContentPath){
				if (logContentPath != "" ){
					var deferred = $q.defer();
					$http.get(logContentPath).success(function(data) {
	            		//alert(data);
	            		deferred.resolve(data);
	        		});
	        		return deferred.promise;
	        	} 
	        	return;
			}
			//test
			var parser = new DOMParser();
			this.buildsForProject = function(projectId) {
				var headers = {
					'Accept': 'application/rdf+xml, application/xml, text/html'
				};
				return $http.get("$0oslc/contexts/$1/automation/plans".format(settings.repository,
																			   projectId), {headers: headers
				}).then(function(response) {
					var xml = parser.parseFromString(response.data, 'text/xml');
					var builds = [];
					angular.forEach(xml.getElementsByTagName("plan"), function(plan) {
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
						idToNameMap[identifier] =  title;
						builds.push(fullBuildDefinition);
					});
					return builds;
				});
			};
			
			this.getBuildName = function(buildId) {
				return idToNameMap[buildId];
			}
		}]);
