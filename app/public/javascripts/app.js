'use strict';

/* App Module */
var ksApp = angular.module('ksApp', [
	'ngRoute',
	'ngCookies',
	'ngSanitize',
	'ngAnimate',
	'ksControllers',
	'ksServices',
	'ksFilters',
	'ksDirectives',
	'facebook',
	'textAngular'
	]);

ksApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider.
		when('/home', {
			templateUrl: '/home/index.html'
		}).
		when('/about', {
			templateUrl: '/home/about.html'
		}).
		when('/issues', {
			templateUrl: '/issues/index.html'
		}).
		when('/issues/:issueId/new', {
			templateUrl: '/posts/new.html'
		}).
		when('/issues/:issueId', {
			templateUrl: '/issues/show.html'
		}).
		when('/posts', {
			templateUrl: '/posts/index.html'
		}).
		when('/posts/:postId', {
			templateUrl: '/posts/show.html'
		}).
		when('/profile', {
			templateUrl: '/users/edit.html'
		}).
		otherwise({
			redirectTo: '/home'
		});
}]);

ksApp.config(['FacebookProvider', function(FacebookProvider) {
	FacebookProvider.init('221620501369131');
}]).config(function() {
	OAuth.initialize('BERJco2TyCVe_oCOR-flsHo9CTM', {cache: true});
});

ksApp.value('$anchorScroll', angular.noop);