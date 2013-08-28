angular.module('clearConcert')

.directive('searchbox', function($timeout, $location) {
    
    return {
        restrict: 'E',
        
        scope: {
            label: '@'
        },
        
        template: '<form id="form" ng-submit="searchPressed(search)"><img src="images/search.png" ng-hide="showInput"><input placeholder="Search for work items" type="search" ng-model="search" ng-show="showInput"></input></form>',
        
        transclude: true,
        
        link: function(scope, element, attrs) {       
            scope.showInput = false;
            
        
            var button = element.find('img'); 
            
            button.css({"height": "33px", "width":"35px", "cursor":"pointer"});      
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

                scope.searchPressed = function(criteria){
                    //If it's a number, go straight to it
                    
                    if (criteria == +criteria) {
                        $location.path('/workitem/$0'.format(criteria));
                    } else { 
                        $location.path('/search/$0'.format(criteria));
                    }
                };       
        }
    };
})