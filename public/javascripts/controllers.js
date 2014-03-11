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
		"url": "trending"
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
		$location.path("/");
	}

}]).controller('homeCtrl', ['$scope', function($scope) {

}]).controller('issuesCtrl', ['$scope', '$http', 'userService', function($scope, $http, userService) {
	$scope.currentUser = userService.currentUser;

	$http({
		method: 'GET',
		url: '/issues'
	}).success(function(data, status, config, headers) {
		$scope.issues = data.issues;
	}).error(function(data, status, config, headers) {

	});
}]).controller('loginCtrl', ['$scope', '$http', '$modal', '$modalInstance', '$window', 'userService', '$location', 'Facebook', function($scope, $http, $modal, $modalInstance, $window, userService, $location, Facebook) {
	$scope.closeModal = function() {
		$modalInstance.close();
	};

	$scope.submitting = false;

	$scope.clickRegisterButton = function() {
		$modalInstance.close();
		$location.path("/register");

	};

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

	$scope.twitterUser;
	// twitter oauth
	$scope.checkTwitterLoginStatus = function() {
		OAuth.popup('twitter', function(err, result) {
			result.get('/1.1/account/verify_credentials.json').done(function(data) {
				$scope.twitterUser = data;
				if ($scope.twitterUser.id) {
					$http({
						method: 'GET',
						url: '/user/twitter',
						params: {twitterId: $scope.twitterUser.id, email: $scope.twitterUser.email}
					}).success(function(data, status, config, headers) {
						$window.localStorage.currentUser = JSON.stringify(data.user);
						userService.setUser(data.user);
						$modalInstance.close();
						$location.path("/");
					}).error(function(data, status, config, headers) {
						if (status == 404) {
							$scope.user.name = $scope.twitterUser.name;
							$scope.user.twitter = true;
							$scope.user.twitterId = $scope.twitterUser.id;
						}
					});
				}
			});
		});
	};

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
				params: { fbId: fbId, email: $scope.user.email }
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

	$scope.twitterUser;
	// twitter oauth
	$scope.checkTwitterLoginStatus = function() {
		OAuth.popup('twitter', function(err, result) {
			result.get('/1.1/account/verify_credentials.json').done(function(data) {
				$scope.twitterUser;
				if ($scope.twitterUser.id) {
					$http({
						method: 'GET',
						url: '/user/twitter',
						params: {twitterId: $scope.twitterUser.id, email: $scope.twitterUser.email}
					}).success(function(data, status, config, headers) {

					}).error(function(data, status, config, headers) {
						if (status == 404) {
							$scope.user.name = $scope.twitterUser.name;
							$scope.user.twitter = true;
							$scope.user.twitterId = $scope.twitterUser.id;
						}
					});
				}
			});
		});
	};

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
}]).controller('newIssueCtrl', ['$scope', '$http', '$location', '$modalInstance', function($scope, $http, $location, $modalInstance) {
	$scope.issue = {};

	$scope.submit = function() {
		$http({
			method: 'POST',
			url: '/issues',
			data: $scope.issue
		}).success(function(data, status, config, headers) {
			$modalInstance.close();
			$location.path("/issues");
		}).error(function(data, status, config, headers) {

		});
	};

}]).controller('userShowCtrl', ['$scope', '$http', '$location', 'userService', function($scope, $http, $location, userService) {
	$scope.user = JSON.parse(window.localStorage.currentUser);
	console.log($scope.user);
	$scope.connectTwitter = function() {
		OAuth.popup('twitter', function(err, result) {
			result.get('/1.1/account/verify_credentials.json').done(function(data) {
				$scope.twitterUser = data;
				if ($scope.twitterUser.id) {
					$http({
						method: 'GET',
						url: '/twitter/connect',
						params: {twitterId: $scope.twitterUser.id, id: $scope.user._id}
					}).success(function(data, status, config, headers) {
						window.localStorage.currentUser = JSON.stringify(data.user);
						userService.setUser(data.user);
						$scope.user = data.user;
					}).error(function(data, status, config, headers) {
						// if (status == 404) {
						// 	$scope.user.name = $scope.twitterUser.name;
						// 	$scope.user.twitter = true;
						// 	$scope.user.twitterId = $scope.twitterUser.id;
						// }
					});
				}
			});
		});
	};

}]);