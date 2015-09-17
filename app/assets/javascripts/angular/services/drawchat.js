(function() {
  var drawchatServices = angular.module('drawchatServices', ['ngResource']);
  drawchatServices.factory('Drawing', ['$resource', function($resource) {
    return $resource('/api/drawings/:id', {}, {
      update: {method:'PUT'}
    });
  }]);
})();
