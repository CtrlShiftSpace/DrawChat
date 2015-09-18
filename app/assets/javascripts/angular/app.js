'use strict';

(function() {
  var app = angular.module('drawchat', [
    'ngRoute',
    'ngResource',
    'drawchatRouter',
    'drawchatServices',
    'drawchatControllers'
  ])

  // config(['PusherServiceProvider',
  //   function(PusherServiceProvider) {
  //     PusherServiceProvider
  //     .setToken('bc4a213f7e5bda1951c6')
  //     .setOptions({});
  //   }
  // ]);
})()
