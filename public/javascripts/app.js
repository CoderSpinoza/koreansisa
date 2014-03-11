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
	'ui.router',
	'facebook'
	]);

ksApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('home', {
			url: "/home",
			templateUrl: "home/index.html"
		})
		.state('issues', {
			url: "/issues",
			templateUrl: "issues/index.html"
		})
		.state('issues.new', {
			url: "/issues/new",
			onEnter: function($stateParams, $state, $modal) {
				$modal.open({
					templateUrl: "issues/new.html",
					controller: "newIssueCtrl"
				}).result.then(function(result) {

				}, function() {
					return $state.transitionTo("issues");
				});
			}
		})
		.state('register', {
			url: "/register",
			onEnter: function($stateParams, $state, $modal) {
				$modal.open({
					templateUrl: "users/register.html",
					controller: 'registerCtrl'
				}).result.then(function(result) {

				}, function() {
					return $state.transitionTo("home");
				});
			}
		})
		.state('login', {
			url: "/login",
			onEnter: function($stateParams, $state, $modal) {
				$modal.open({
					templateUrl: "users/login.html",
					controller: 'loginCtrl',
					windowClass: 'wider-modal'
				}).result.then(function(result) {
				}, function(){
					return $state.transitionTo("home");
				});
			}
		})
		.state('profile', {
			url: "/profile",
			templateUrl: "users/show.html"
		})
		.state('trending', {
			url: "/trending",
			templateUrl: "posts/index.html"
		});
	$urlRouterProvider.otherwise("/home");
}]);

ksApp.config(['FacebookProvider', function(FacebookProvider) {
	FacebookProvider.init('221620501369131');
}]).config(function() {
	OAuth.initialize('BERJco2TyCVe_oCOR-flsHo9CTM', {cache: true});
});