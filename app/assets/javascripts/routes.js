(function() {
  var router = angular.module('drawchatRouter', []);
  router.config([
    '$routeProvider',
    function($routeProvider){
      $routeProvider.
      //
      when("/drawings", {
        // templateUrl: 'views/grumbles/index.html',
        controller: 'drawchatController',
        controllerAs: 'dcCtrl'
      }).
      //
      otherwise({
       redirectTo: "/drawings"
     })
  ])
})()
