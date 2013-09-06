angular.module('clearConcert').
controller('ApprovalCtrl',['$scope', '$location', 'approvalService',
function($scope, $location, approvalService){
	//alert('stop here');
	$scope.item = approvalService.item;
	$scope.approver = approvalService.approver;

	$scope.approverClick = function(approver){
		approvalService.approver = approver;
		$location.path('approve');
	};

	//https://rtc.clearblade.com/jazz/service/com.ibm.team.workitem.common.internal.rest.IWorkItemRestService/approvalTypes?projectAreaItemId=_GtuwwPghEeGkj9-_5VhsPg


}]);