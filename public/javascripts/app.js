'use strict';

/* App Module */
var ksApp = angular.module('ksApp', [
	'ngRoute',
	'ngCookies',
	'ngSanitize',
	'ksControllers',
	'ksServices',
	'ksFilters',
	'ksDirectives',
	'ui.router'
	]);

// .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
// 	$routeProvider.when('/home', {
// 		templateUrl: '/home/index.html',
// 		controller: 'homeCtrl'
// 	}).when('/issues', {
// 		templateUrl: '/issues/index.html',
// 		controller: 'issuesCtrl'
// 	}).otherwise({
// 		redirectTo: '/home'
// 	})
// }]).
ksApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	
	$stateProvider
		.state('home', {
			url: "/home",
			templateUrl: "home/index.html"
		})
		.state('register', {
			url: "/register",
			onEnter: function($stateParams, $state, $modal) {
				$modal.open({
					templateUrl: "partials/register.html",
					controller: 'registerCtrl'
				}).result.then(function(result) {

				}, function() {
					return $state.transitionTo("home");
				});
			}
		}).state('login', {
			url: "/login",
			onEnter: function($stateParams, $state, $modal) {
				$modal.open({
					templateUrl: "partials/login.html",
					controller: 'loginCtrl'
				}).result.then(function(result) {
				}, function(){
					return $state.transitionTo("home");
				});
			}
		});
	$urlRouterProvider.otherwise("/home");

}]);