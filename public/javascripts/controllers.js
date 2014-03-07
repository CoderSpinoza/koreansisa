'use strict';

/* *********** *
 * Controllers *
 * *********** */

var ksControllers = angular.module('ksControllers', ['ui.bootstrap', 'ksServices']);

ksControllers.controller('menuCtrl', ['$scope', '$location', '$modal', function($scope, $location, $modal) {
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

	$scope.openModal = function() {
		var modalInstance = $modal.open({
			templateUrl: 'partials/login.html',
			controller: 'loginCtrl'
		});
	};
}]).controller('homeCtrl', ['$scope', function($scope) {

}]).controller('issuesCtrl', ['$scope', function($scope) {

}]).controller('loginCtrl', ['$scope', '$http', '$modal', '$modalInstance', function($scope, $http, $modal, $modalInstance) {
	$scope.closeModal = function() {
		$modalInstance.close();
	};

	$scope.registerButtonClicked = false;

	$scope.clickRegisterButton = function() {
		$scope.registerButtonClicked = !$scope.registerButtonClicked;
		$modalInstance.close();
		console.log("clicked register");
	};

	$modalInstance.result.then(function() {
		if ($scope.registerButtonClicked) {
			console.log("Register gogo");
			var modalInstance = $modal.open({
				templateUrl: 'partials/register.html',
				controller: 'registerCtrl'
			});
		}
	}, function() {
		console.log("closed");
	})
	// $scope.registerButtonClicked = function() {
	// 	$modalInstance.close(function(result) {
	// 		result.then(function() {
	// 			console.log("Success");
	// 		}, function(){
	// 			console.log("Reject");
	// 		});
	// 	});
	// };

}]).controller('registerCtrl', ['$scope', '$http', '$modalInstance', function($scope, $http, $modalInstance) {
	$scope.closeModal = function() {
		$modalInstance.close();
	};

	$scope.user = {gender: 1};
	$scope.submitting = false;
	$scope.submit = function() {
		console.log("submit");
	};
}]);