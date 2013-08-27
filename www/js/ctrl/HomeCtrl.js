angular.module('clearConcert')
.controller('HomeCtrl',['$scope','$location',
function($scope, $location){
	$scope.search={
		text:""
	};

	
	$scope.textHasFocus = false;

	$scope.captureClick = function(e){
		var elem = angular.element(e.srcElement);
		console.log(elem);
		if(elem.hasClass("clear") || elem.hasClass("searchImg")){
			console.log("button");
			var form = elem.parent();
			console.log(form);
			var htmlTxtBox = form.children()[1];
			console.log(htmlTxtBox);
			var txtBox = angular.element(htmlTxtBox);
			
			//htmlTxtBox.focus();
			$scope.textHasFocus=true;
			//setTimeout("angular.element(document.getElementById('searchBox')).css('width','50px')",10);
			//setTimeout("angular.element(document.getElementById('searchBox')).css({'width':'500px','transition':'width 1s'})",10);
			
			setTimeout("document.getElementById('searchBox').focus()", 10);
		} else{
			//txtBox.css({"width":"50px", "transition":"1s"})
			$scope.textHasFocus = false;
		}
	}	

	$scope.clearSearch = function(e){
        
       var textBox = angular.element(e.srcElement).parent().children()[1];
       console.log(textBox);
       textBox.focus();
       //console.log(document.activeElement);
       

       $scope.search.text = "";
    };
    
    $scope.showX = function () {
    	return $scope.search.text ==="";
};

	$scope.searchPressed = function(criteria){
		//If it's a number, go straight to it
		$scope.$hidePanel();
		if (criteria == +criteria) {
			$location.path('/workitem/$0'.format(criteria));
		} else { 
			$location.path('/search/$0'.format(criteria));
		}
	};
	$scope.go = function(target) {
		$scope.$hidePanel();
		$location.path('/' + target);
	};

}]);