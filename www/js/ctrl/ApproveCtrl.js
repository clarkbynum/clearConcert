angular.module('clearConcert')
.controller('ApproveCtrl',['$scope', '$location', 'approvalService', '$loadDialog',
function($scope, $location, approvalService, $loadDialog){
	$scope.approver = approvalService.approver;
	$scope.types = [{id:"test1",label:"Test 1"}, {id:"test2",label:"Test 2"},{id:"test3",label:"Test 3"}];
	$scope.state = "Pending";
	var getApprovalTypes = function() {
		var promise = approvalService.getTypes().then(function(types){
			//alert('loaded types: '+types);
			$scope.types= types.data["soapenv:Body"].response.returnValue.values;
			//for
		});
		$loadDialog.waitFor(promise, "Fetching Approval Types");
	};

	getApprovalTypes();

	$scope.saveApprove=function(){
		approvalService.setApproval($scope.state);
	}
}]);