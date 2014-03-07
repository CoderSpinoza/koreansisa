'use strict';

/* App Module */
var ksApp = angular.module('ksApp', [
	'ngRoute',
	'ngCookies',
	'ngSanitize',
	'ksControllers',
	'ksServices',
	'ksFilters',
	'ksDirectives'
	]);

ksApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider.when('/home', {
		templateUrl: '/home/index.html',
		controller: 'homeCtrl'
	}).when('/issues', {
		templateUrl: '/issues/index.html',
		controller: 'issuesCtrl'
	}).otherwise({
		redirectTo: '/home'
	})
}]);
// .config(['$provider', '$httpProvider', function($provider, $httpProvider) {

// 	// Intercepting HTTP calls with AngularJS.
// 	$provide.factory('KsHttpInterceptor', function($q, $rootScope) {

// 		$rootScope.pendingRequests = 0;
// 		return {
// 			request: function(config) {
// 				$rootScope.pendingRequests++;
// 				return config || $q.when(config);
// 			},
// 			requestError: function(rejection) {
// 				$rootScope.pendingRequests--;
// 				return $q.reject(rejection);
// 			},
// 			response: function(response) {
// 				$rootScope.pendingRequests--;
// 				if (response.status === 401) {
// 					$rootScope.hasToLogin = true;
// 					return $q.reject(response);
// 				}
// 				return response || $q.when(response);
// 			},
// 			responseError: function(rejection) {
// 				$rootScope.pendingRequests--;
// 				return $q.reject(rejection);
// 			}
// 		};
// 	});

// 	$httpProvider.interceptors.push('KsHttpInterceptor');
// }]);
