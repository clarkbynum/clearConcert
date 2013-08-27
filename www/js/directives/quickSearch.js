angular.module('clearConcert')

.directive('searchbox', function($timeout) {
    
    return {
        restrict: 'E',
        
        scope: {
            label: '@'
        },
        
        template: '<form id="form"><button id="btn" ng-hide="showInput"><img src="images/search.png"></button><input placeholder="Search for work items" type="search" ng-model="search" ng-show="showInput"></input></form>',
        
        transclude: true,
        
        link: function(scope, element, attrs) {       
            scope.showInput = false;
            
        
            var button = element.find('button'); 
            var htmlBtn = button[0];
            button.css({"height": "33px", "width":"42px", "cursor":"pointer"});      
            var input = element.find('input');
        
            button.bind("click", function() {
                scope.showInput = true;            
                scope.$apply();
            
                input[0].focus();            
                input.css({"width":"300px", "height":"33px", "transition":"width .5s"});            
            });
        
            input.bind('blur', function() {
                
                input.css({'width':'50px', 'transition':'.5s'});
                scope.showInput = false; 

                $timeout(function() { scope.$apply(); }, 500);           
            
                                       
            });        
        }
    };
})