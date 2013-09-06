angular.module('clearConcert')
.service('approvalService', ['$http', '$q', 'settings',
function($http, $q, settings){
	var self = this;
	self.item = {};
	self.approval = {};
	self.projectAreaId = {};
	self.repository ={};
  self.approvalValue={};

	var itemHeaders = {
	    "Accept": "text/json",
      "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With":"XMLHttpRequest",
      "OSLC-Core-Version":"2.0"
	};

	this.getTypes = function(){
		var deferred = $q.defer();
		var url = "";
    url = url + self.repository;
    url = url + "service/com.ibm.team.workitem.common.internal.rest.IWorkItemRestService/approvalStates";
    url = url + "?projectAreaItemId="+self.projectAreaId;
    $http.get(url, { headers: itemHeaders }
      
    ).then(function(response) {
      console.log(response);
      //var dp = new DOMParser();
      //var xDoc = dp.parseFromString(response.data, "text/xml");
      //self.approvals = response.data["soapenv:Body"]["response"]["returnValue"]["value"]["approvals"];
      deferred.resolve(response);
    }, function(err){
      deferred.failure(err);
    });
    return deferred.promise;
	};

  this.setApproval = function(newState) {
    var newState = "com.ibm.team.workitem.approvalState.rejected"
    var url = "https://rtc.clearblade.com/jazz/service/com.ibm.team.workitem.common.internal.rest.IWorkItemRestService/workItem2";
    var ApprovalPost  ={"id":self.item.id,
                        "cmd":"updateApprover",
                        "param":{
                          "user":self.approver.approver.itemId,
                          "state":newState,
                        }};
    var formData = "itemId="+ self.approvalValue.itemId;
    formData = formData + "&type=task";
    formData = formData + "&stateId="+self.approvalValue.stateId;
    formData = formData + "&updateApprovals="+encodeURI(JSON.stringify(ApprovalPost))
;
    formData = formData + "&additionalSaveParameters=com.ibm.team.workitem.common.internal.updateBacklinks";
    formData = formData + "&projectAreaItemId="+self.projectAreaId;

    //formData = "id":"test","value":"aaron"};
    $http.post(url, formData, {headers:itemHeaders}).then(function(response){
      console.log(repsonse);
    });
  };

}]);