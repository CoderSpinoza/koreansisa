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
	$scope.currentUser = userService.currentUser;
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

}]).controller('loginCtrl', ['$scope', '$http', '$modal', '$modalInstance', '$window', 'userService', '$location', 'Facebook', function($scope, $http, $modal, $modalInstance, $window, userService, $location, Facebook) {
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

	// facebook functions
	$scope.checkFbLoginStatus = function() {
		Facebook.getLoginStatus(function(response) {
			if (response.status == 'connected') {
				$scope.$apply(function() {
					$scope.fbLoggedIn = true;
				});
			} else {
				$scope.$apply(function() {
					$scope.fbLoggedIn = false;
				});
			}
		});
	};

	$scope.fbLogin = function() {
		Facebook.login(function(response) {
			if (response.status == 'connected') {
				$scope.$apply(function() {
					$scope.fbLoggedIn = true;
				});
			}
			
		}, {scope: 'email'});
	};

	$scope.me = function() {
		Facebook.api('/me?fields=email,name,gender', function(response) {
			$scope.fbUser = response;
			$scope.fbId = response.id;
		});
	};

	$scope.$watch('fbLoggedIn', function(fbLoggedIn) {
		if (fbLoggedIn == undefined) {
		} else if (fbLoggedIn == true) {
			$scope.me();
		} else if (fbLoggedIn == false) {
			$scope.fbLogin();
		}
	});

	$scope.$watch('fbId', function(fbId) {
		if (fbId) {
			$http({
				method: 'GET',
				url: '/user/facebook',
				params: { fbId: fbId }
			}).success(function(data, status, config, headers) {
				$window.localStorage.currentUser = JSON.stringify(data.user);
				$window.localStorage.token = data.user.apikey;
				userService.setUser(data.user);
				$modalInstance.close();
				$location.path("/");
			}).error(function(data, status, config, headers) {
				if (status == 404) {
					userService.fbUser = $scope.fbUser;
					$modalInstance.close();
					$location.path("/register");
				}
			});
		}
	});

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

}]).controller('registerCtrl', ['$scope', '$http', '$modalInstance', 'userService', '$location', '$window', 'Facebook', function($scope, $http, $modalInstance, userService, $location, $window, Facebook) {

	$scope.closeModal = function() {
		$modalInstance.close();
	};

	$scope.user = {gender: 1};

	if (userService.fbUser) {
		$scope.user.email = userService.fbUser.email;
		$scope.user.name = userService.fbUser.name;
		$scope.user.facebook = true;
		$scope.user.facebookId = userService.fbUser.id;
		$scope.user.gender = userService.fbUser.gender == "male" ? 1 : 0;
	}

	$scope.submitting = false;

	$scope.$watch(function() {
		return Facebook.isReady();
	}, function(newVal) {
		$scope.facebookReady = true;
	});

	$scope.fbLogin = function() {
		Facebook.login(function(response) {
			if (response.status == 'connected') {
				$scope.$apply(function() {
					$scope.fbLoggedIn = true;
				});
			}
			
		}, {scope: 'email'});
	};

	$scope.checkFbLoginStatus = function() {
		Facebook.getLoginStatus(function(response) {
			if (response.status == 'connected') {
				$scope.$apply(function() {
					$scope.fbLoggedIn = true;
				});
			} else {
				$scope.$apply(function() {
					$scope.fbLoggedIn = false;
				});
			}
		});
	};

	$scope.me = function() {
		Facebook.api('/me?fields=email,name,gender', function(response) {
			$scope.fbUser = response;
			$scope.fbId = response.id;
		});
	};

	$scope.$watch('fbLoggedIn', function(fbLoggedIn) {
		if (fbLoggedIn == undefined) {
		} else if (fbLoggedIn == true) {
			$scope.me();
		} else if (fbLoggedIn == false) {
			$scope.fbLogin();
		}
	});

	$scope.$watch('fbId', function(fbId) {
		if (fbId) {
			$http({
				method: 'GET',
				url: '/user/facebook',
				params: { fbId: fbId }
			}).success(function(data, status, config, headers) {
				$window.localStorage.currentUser = JSON.stringify(data.user);
				$window.localStorage.token = data.user.apikey;
				userService.setUser(data.user);
				$modalInstance.close();
				$location.path("/");
			}).error(function(data, status, config, headers) {
				if (status == 404) {
					$scope.user.name = $scope.fbUser.name;
					$scope.user.email = $scope.fbUser.email;
					$scope.user.facebook = true;
					$scope.user.facebookId = $scope.fbUser.id;
					$scope.user.gender = $scope.fbUser.gender == "male" ? 1 : 0;
				}
			});
		}
	});

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