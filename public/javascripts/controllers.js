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
	}];

	$scope.getClass = function(path) {
		return $location.path().substr(0,path.length) === path ? "active" : "";
	};
	console.log(userService);
	$scope.currentUser = userService.currentUser;
	// console.log($scope.currentUser);
	$scope.$watch(function() { return userService.currentUser; }, function(currentUser) {
		if (currentUser) {
			$scope.currentUser = currentUser;
		} else {
			$scope.currentUser = undefined;
		}
	});

	$scope.logout = function() {
		$window.localStorage.removeItem('currentUser');
		$window.localStorage.removeItem('token');
		userService.setUser(undefined);
	}

	$scope.openModal = function() {
		var modalInstance = $modal.open({
			templateUrl: 'partials/login.html',
			controller: 'loginCtrl'
		});
	};
}]).controller('homeCtrl', ['$scope', function($scope) {

}]).controller('issuesCtrl', ['$scope', function($scope) {

}]).controller('loginCtrl', ['$scope', '$http', '$modal', '$modalInstance', '$window', 'userService', '$location', function($scope, $http, $modal, $modalInstance, $window, userService, $location) {
	$scope.closeModal = function() {
		$modalInstance.close();
	};

	$scope.registerButtonClicked = false;
	$scope.submitting = false;

	$scope.clickRegisterButton = function() {
		$modalInstance.close();
		$location.path("/register");

	};

	$modalInstance.result.then(function() {
		if ($scope.registerButtonClicked) {
			var modalInstance = $modal.open({
				templateUrl: 'partials/register.html',
				controller: 'registerCtrl'
			});
		}
	}, function() {
	});

	// user model

	$scope.user = {};

	$scope.submit = function() {
		$http({
			method: 'POST',
			url: '/login',
			data: $scope.user,
		}).success(function(data, status,header, config) {
			$window.localStorage.currentUser = JSON.stringify(data.user);
			$window.localStorage.token = data.user.apikey;
			userService.setUser(data.user);
			$scope.submitting = false;
			$modalInstance.close();
			$location.path("/");
		}).error(function(error, response) {
			if (response.statusCode == 404) {

			}
			$scope.submitting = false;
		});
		$scope.submitting = true;
	}

}]).controller('registerCtrl', ['$scope', '$http', '$modalInstance', 'userService', '$location', '$window', function($scope, $http, $modalInstance, userService, $location, $window) {
	$scope.closeModal = function() {
		$modalInstance.close();
	};

	$scope.user = {gender: 1, provider: 'local'};
	$scope.submitting = false;
	$scope.submit = function() {
		$http({
			method: 'POST',
			url: '/register',
			data: $scope.user,
		}).success(function(data) {
			$window.localStorage.currentUser = JSON.stringify(data.user);
			$window.localStorage.token = data.user.apikey;
			userService.setUser(data.user);
			$scope.submitting = false;
			$modalInstance.close();
			$location.path("/");
		}).error(function(error, response) {
			$scope.submitting = false;
		});
		$scope.submitting = true;
	};
}]);