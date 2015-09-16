(function() {
  var drawchatServices = angular.module('drawchatServices', ['ngResource']);
  drawchatServices.factory('DrawChat', ['$resource', function($resource) {
    return $resource('/drawings/:id', {}, {
      update: {method:'PUT'}
    });
  }]);
})();
