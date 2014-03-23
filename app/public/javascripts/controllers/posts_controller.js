angular.module('ksControllers').controller('postsIndexCtrl', ['$location', '$http', '$scope', 'globalAlertsService', function($location, $http, $scope, globalAlertsService) {
	$http({
		method: 'GET',
		url: '/api/posts'
	}).success(function(data, status, config, headers) {
		$scope.posts = data.posts;
	}).error(function(data, status, config, headers) {

	});
	$scope.alerts = globalAlertsService.alerts;

	$scope.$watch(function() { return globalAlertsService.alerts; }, function(alerts) {
		$scope.alerts = globalAlertsService.alerts;
	});

	$scope.deleteAlert = globalAㅣlertsService.deleteAlert;

}]).controller('postsNewCtrl', ['$window', '$scope', '$http', 'userService', 'issuesService', '$routeParams', '$location', function($window, $scope, $http, userService, issuesService, $routeParams, $location) {

	if (!userService.currentUser) {
		$window.localStorage.prevUrl = $location.path();
		$location.path("/login");
		return;
	}
	$http({
		method: 'GET',
		url: '/api/issues/' + $routeParams.issueId
	}).success(function(data, status, config, headers) {
		$scope.issue = data.issue;
	}).error(function(data, status, config, headers) {

	});

	$scope.currentUser = userService.currentUser;
	$scope.post = {};

	$scope.submit = function() {
		$scope.post.side = $scope.post.side == true ? "Conservative" : "Liberal";
		$scope.post.author = $scope.currentUser._id;
		$scope.post.issue = $scope.issue._id;
		$http({
			method: 'POST',
			url: "/api/posts",
			data: $scope.post,
			headers: {
        'Content-type': 'application/json'
    	}
		}).success(function(data, status, config, headers) {
			$location.path("/issues/" + $routeParams.issueId);
		}).error(function(data, status, config, headers) {

		});
	};

}]).controller('postsEditCtrl', ['$scope', '$http', 'userService', '$routeParams', '$location', function($scope, $http, userService, $routeParams, $location) {

	$http({
		method: 'GET',
		url: '/api/posts/' + $routeParams.postId
	}).success(function(data, status, config, headers) {
		$scope.post = data.post;
	}).error(function(data, status, config, headers) {

	});

	$scope.submit = function() {
		$http({
			method: 'PUT',
			url: "/api/posts/" + $routeParams.postId
		}).success(function(data, status, config, headers) {

		}).error(function(data, status, config, headers) {

		});
	}



}]).controller('postsShowCtrl', ['$scope', '$http', 'userService', '$routeParams', '$location', '$modal', 'globalAlertsService', function($scope, $http, userService, $routeParams, $location, $modal, globalAlertsService) {

	$http({
		method: 'GET',
		url: '/api/posts/' + $routeParams.postId
	}).success(function(data, status, config, headers) {
		$scope.post = data.post;
	}).error(function(data, status, config, headers) {
	});

	$scope.deletePostModal = function() {
		$modal.open({
			templateUrl: 'posts/confirmation.html',
			controller: 'postsDeleteCtrl'
		}).result.then(function() {
			deletePost();
		}, function() {
		});
	};

	var deletePost = function() {
		$http({
			method: 'DELETE',
			url: '/api/posts/' + $routeParams.postId
		}).success(function(data, status, config, headers) {
			globalAlertsService.alerts.push({type: 'success', message: data.message});
			$location.path("/posts");
		}).error(function(data, status, config, headers) {

		});
	};
}]).controller('postsDeleteCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {
	$scope.yes = function() {
		$modalInstance.close();
	};

	$scope.no = function() {
		$modalInstance.dismiss('cancel');
	};
}]);