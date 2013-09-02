angular.module('clearConcert')

.directive('searchbox', ['$timeout', '$location', 'search', function($timeout, $location, search) {
    
    return {
        restrict: 'E',
        
        controller: 'SearchCtrl',

        scope: {
            label: '@'
        },
        
        template: '<form id="form" ng-submit="searchPressed(query)"><img src="images/headerSearch.png" style="padding-right:8px;padding-top:4px;" ng-hide="showInput"><input placeholder="Search for work items" type="search" ng-model="query" ng-show="showInput"></input></form>',
        
        transclude: true,
        
        link: function(scope, element, attrs) {       
            scope.showInput = false;
            
        
            var button = element.find('img'); 
            
            button.css({"height": "24px", "width":"24px", "cursor":"pointer"});      
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
}]);