angular.module('clearConcert')
.filter('ellipsis', function() {
  return function(text, max) {
    if (!text) {
      return text;
    } else if (text.length <= max) {
      return text;
    } else {
      return text.substr(0,max) + " ... ";
    }
  };
});