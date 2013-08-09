angular.module('clearConcert')
.service('storage', function() {
  this.set = function(key, value) {
    if (angular.isObject(value) || angular.isArray(value)) {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  };
  this.get = function(key) {
    var value = localStorage.getItem(key);
    try {
      return JSON.parse(value);
    } catch(e){ 
      return value;
    }
  };
  this.remove = function(key) {
    localStorage.removeItem(key);
  };
});
