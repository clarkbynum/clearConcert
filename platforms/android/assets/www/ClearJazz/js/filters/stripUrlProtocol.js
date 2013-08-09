angular.module('clearJazz')
.filter('stripUrlProtocol', function() {
  return function(input) {
    return input && input.length && input.replace('https://','').replace('http://','') || '';
  };
});
