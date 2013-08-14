angular.module('clearConcert')
.service('build', ['settings', '$http', '$q',
function(settings, $http, $q){

	this.getAutomationProjects = function(){
		return $http.get("$0oslc/automation/catalog".format(settings.repository)
      
	    }).then(function(response) {
	      return parseAutomationProjects(response.data);
	      });
	    }).then(function(data){
	    	debugger;
	    });
	};

	//return the rootservices as xml
	function parseAutomateProjects(data) {
		var rooturl = "";
		var _automationProjects = parser.parseFromString(data, "text/xml");
		// rooturl = xml.getElementsByTagNameNS("http://jazz.net/xmlns/prod/jazz/discovery/1.0/", "viewletServiceRoot")[0].getAttribute("rdf:resource");


		return _automationProjects;
	}

	this.buildsForProject = function(projectId) {
    return $http.get("$0oslc/automation/catalog".format(settings.repository), {
      //cache: queryCache,
      params: {
        'oslc_cm.properties': 'dc:title',
        'oslc_cm.query': 'rtc_cm:projectArea="$0"'.format(projectId)
      }
    }).then(function(response) {
      return response.data['oslc_cm:results'].map(function(item, i) {
        return {
          title: item['dc:title'],
          queryId: item['dc:title']
        };
      });
    });
  };
}]);