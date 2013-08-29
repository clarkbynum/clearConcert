
angular.module('mobiSelect', [])

.directive('mobiSelect', function() {
  return {
    require: 'ngModel',
    restrict: 'E',
    template: '<ul ng-transclude></ul>',
    replace: true,
    transclude: true,
    controller: function($scope) {
      this.addOption = function(opt) {
        $scope.addOption(opt);
      };
      this.removeOption = function(opt) {
        $scope.removeOption(opt);
      };
      this.selectOption = function(opt) {
        $scope.selectOption(opt);
      };
    },
    link: function(scope, elm, attrs, modelCtrl) {
      var options = [];
      scope.selectOption = function(opt) {
        angular.forEach(options, function(opt) {
          opt.selected = false;
        });
        opt.selected = true;
        modelCtrl.$setViewValue(opt.value);
      };
      scope.addOption = function(opt) {
        options.push(opt);
        if (opt.value == modelCtrl.$viewValue) {
          scope.selectOption(opt);
        }
      };
      scope.removeOption = function(opt) {
        options.splice(options.indexOf(opt), 1);
        opt.select = null;
      };
    }
  };
})

.directive('mobiOption', function() {
  return {
    require: '^mobiSelect',
    restrict: 'E',
    scope: {
      value: '='
    },
    template: [
    '<div>',
      '<li jqm-li-entry ng-click="select()" class="pair mobiSelect" ng-style="{color: selected && \'white\', \'background-color\': selected && \'#046DE6\'}">',
        '<span class="left mobiSelect" style="max-width:95%; padding-right: 0;" ng-transclude></span>',
        '<span class="right mobiSelect"><i ng-class="{\'icon-ok\': selected}" style="color:white;"></i></span>',
      '</li>',
      '</div>'
    ].join(''),
    transclude: true,
    replace: true,
    link: function(scope, elm, attrs, selectCtrl) {
      selectCtrl.addOption(scope);
      scope.select = function() {
        selectCtrl.selectOption(scope);
      };
      scope.$on('$destroy', function() {
        selectCtrl.removeOption(scope);
      });
    }
  };
});

