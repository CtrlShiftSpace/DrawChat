(function() {
  var drawchatServices = angular.module('drawchatServices', ['ngResource']);
  drawchatServices.factory('Drawing', ['$resource', function($resource) {
    return $resource('http://localhost:3000/api/drawings/:id');
  }]);
})();
