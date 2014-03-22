'use strict';

/* *********** *
 * Controllers *
 * *********** */

var ksControllers = angular.module('ksControllers', ['ui.bootstrap', 'ksServices']);

ksControllers.controller('menuCtrl', ['$scope', '$location', '$modal', '$window', 'userService', function($scope, $location, $modal, $window, userService) {
	$scope.menus = [{
		"id": "home",
		"name": "Home",
		"url": "home"
	}, {
		"id": "issues",
		"name": "Issues",
		"url": "issues"
	}, {
		"id": "trending",
		"name": "Trending",
		"url": "posts"
	}];

	$scope.navCollapsed = true;

	$scope.toggleNavbar = function() {
		$scope.navCollapsed = !$scope.navCollapsed;
	}

	$scope.getClass = function(path) {
		return $location.path().substr(0,path.length) === path ? "active" : "";
	};
	$scope.currentUser = userService.currentUser;
	$scope.$watch(function() { return userService.currentUser; }, function(currentUser) {
		if (currentUser) {
			$scope.currentUser = currentUser;
		} else {
			$scope.currentUser = undefined;
		}
	});

	$scope.loginButtonPressed = function() {
		$modal.open({
			templateUrl: "users/login.html",
			controller: 'loginCtrl',
			windowClass: 'wider-modal'
		});
	};

	$scope.logout = function() {
		$window.localStorage.removeItem('currentUser');
		$window.localStorage.removeItem('token');
		userService.setUser(undefined);
		$scope.currentUser = undefined;
	}

}]).controller('homeCtrl', ['$scope', '$http', function($scope, $http) {
	$http({
		method: 'GET',
		url: '/api/issues'
	}).success(function(data, status, config, headers) {
		$scope.issues = data.issues;
	}).error(function(data, status, config, headers) {

	});

	$http({
		method: 'GET',
		url: '/api/posts'
	}).success(function(data, status, config, headers) {
		$scope.posts = data.posts;
		console.log($scope.posts);
	}).error(function(data, status, config, headers) {

	});
}]);