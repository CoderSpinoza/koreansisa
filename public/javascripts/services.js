'use strict';

/* ********** *
 *  Services  *
 * ********** */

var ksServices = angular.module('ksServices', []).config(function($httpProvider) {
	$httpProvider.interceptors.push('ksHttpInterceptor');
}).factory('ksHttpInterceptor', function($q, $rootScope, $window) {
	$rootScope.pendingRequests = 0;
  return {
    request: function (config) {
	    $rootScope.pendingRequests++;
	    if (config.url.match(/\/?api/) && $window.localStorage.token) config.url = config.url + "?token=" + $window.localStorage.token;
	    return config || $q.when(config);
    },

    requestError: function(rejection) {
      $rootScope.pendingRequests--;
      return $q.reject(rejection);
    },

    response: function(response) {
      $rootScope.pendingRequests--;
      return response || $q.when(response);
    },

    responseError: function(rejection) {
      $rootScope.pendingRequests--;
      return $q.reject(rejection);
    }
	};
}).service('userService', ['$http', '$window', function($http, $window) {
  var userService = {};

  if ($window.localStorage.currentUser) {
    userService.currentUser = JSON.parse($window.localStorage.currentUser);
  }
  userService.setUser = function(user) {
    userService.currentUser = user;
  };
  return userService;
}]);