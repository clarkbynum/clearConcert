angular.module('clearConcert')
.controller('SettingsCtrl', ['$scope','settings','$rootScope','auth','$location',
function($scope, settings, $rootScope, auth,$location) {
  $scope.repository = settings.repository;
  $scope.username = settings.username;

  $scope.showErrorsSwitch = $rootScope.showErrors;
  $scope.$watch('showErrorsSwitch', function(val) {
    localStorage.showErrors = $rootScope.showErrors = val;
  });

  $scope.logout = function() {
	console.log('logged out');
	auth.logout();
  };
}]);
