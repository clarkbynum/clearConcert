


// String.format: simple string formatter
// Example:
//   "a $0 string tastes like $1".format('cool','pizza') --> "a cool string tastes like pizza"
String.prototype.format = function() {
  var args = Array.prototype.slice.call(arguments);
  return args.reduce(function(prev, current, index) {
    return prev.replace(new RegExp('\\$'+index, 'g'), current);
  }, this);
};
String.prototype.escapeHTML = function() {
  return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
};
String.prototype.unescapeHTML = function() {
  return this.replace(/&amp;/g,'&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g,'"');
};



  
