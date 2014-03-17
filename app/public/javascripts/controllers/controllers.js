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
		$location.path("/");
	}

}]).controller('homeCtrl', ['$scope', function($scope) {

}]);