window.onReady = (function() {
  var isReady = false;
  var toCall = [];

  window.addEventListener('load', function() {
    isReady = true;
    if (toCall.length) {
      for (var i = 0, l = toCall.length; i < l; i++) {
        toCall[i]();
      }
    }
  });

  return function(callback) {
    if (isReady) {
      callback();
    } else {
      toCall.push(callback);
    }
  };
})();
