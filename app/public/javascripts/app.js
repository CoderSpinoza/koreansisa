'use strict';

/* App Module */
var ksApp = angular.module('ksApp', [
	'ngCookies',
	'ngSanitize',
	'ngAnimate',
	'ksControllers',
	'ksServices',
	'ksFilters',
	'ksDirectives',
	'ui.router',
	'facebook',
	'textAngular'
	]);

ksApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('home', {
			url: "/home",
			views: {
				'root@': {
					templateUrl: "home/index.html"
				}
			}
		})
		.state('issues', {
			url: "/issues",
			views: {
				'root@': {
					templateUrl: "issues/index.html"
				}
			}
		})
		.state('issues.new', {
			url: "/new",
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
		.state('issues.show', {
			url: "/:issueId",
			templateUrl: "issues/show.html"
		})
		.state('issues.show.new', {
			url: "/new",
			templateUrl: "posts/new.html"
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
			views: {
				'root@': {
					templateUrl: "users/edit.html"
				}
			}
		})
		.state('posts', {
			url: "/posts",
			views: {
				'root@': {
					templateUrl: "posts/index.html"
				}
			}
		})
		.state('posts.new', {
			url: "/new",
			views: {
				'root@': {
					templateUrl: "posts/new.html"
				}
			}
			
		})
		.state('posts.show', {
			url: "/:postId",
			views: {
				'root@': {
					templateUrl: "posts/show.html"
				}
			}
		})
		.state('posts.edit', {
			url: "/:postId/edit",
			views: {
				'root@': {
					templateUrl: "/posts/edit.html"
				}
			}
		});
	$urlRouterProvider.otherwise("/home");
}]);

ksApp.config(['FacebookProvider', function(FacebookProvider) {
	FacebookProvider.init('221620501369131');
}]).config(function() {
	OAuth.initialize('BERJco2TyCVe_oCOR-flsHo9CTM', {cache: true});
});

ksApp.value('$anchorScroll', angular.noop);