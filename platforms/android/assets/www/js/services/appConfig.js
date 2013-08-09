angular.module('clearConcert')
.factory('appConfig', function() {
	var _appConfig={};
	var _isLoaded = false;

	function loadStrings() {
		_appConfig.appName= "ClearConcert";
	}

	function getLabel(id){
		return(eval(id));
	}
	if (!_isLoaded){
		loadStrings();
		_isLoaded = true;
	}
	
	return _appConfig;
});