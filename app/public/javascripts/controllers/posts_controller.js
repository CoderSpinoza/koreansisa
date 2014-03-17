angular.module('ksControllers').controller('postsIndexCtrl', ['$location', '$http', function($location, $http) {
	$http({
		method: 'GET',
		url: '/api/posts'
	}).success(function(data, status, config, headers) {

	}).error(function(data, status, config, headers) {

	});
}]).controller('postsNewCtrl', ['$window', '$scope', '$http', 'userService', 'issuesService', '$state', '$stateParams', '$location', function($window, $scope, $http, userService, issuesService, $state, $stateParams, $location) {

	if (!userService.currentUser) {
		$window.localStorage.prevUrl = $location.path();
		$location.path("/login");
		return;
	}
	$http({
		method: 'GET',
		url: '/api/issues/' + $stateParams.issueId
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
			console.log(data);
			$location.path("/issues/" + $stateParams.issueId);
		}).error(function(data, status, config, headers) {

		});
	};

}]).controller('postsEditCtrl', ['$scope', '$http', 'userService', '$state', '$stateParams', '$location', function($scope, $http, userService, $state, $stateParams, $location) {

	$http({
		method: 'GET',
		url: '/api/posts/' + $stateParams.postId
	}).success(function(data, status, config, headers) {
		$scope.post = data.post;
		console.log($scope.post);
	}).error(function(data, status, config, headers) {

	});

	$scope.submit = function() {
		$http({
			method: 'PUT',
			url: "/api/posts/" + $stateParams.postId
		}).success(function(data, status, config, headers) {

		}).error(function(data, status, config, headers) {

		});
	}



}]).controller('postsShowCtrl', ['$scope', '$http', 'userService', '$state', '$stateParams', '$location', function($scope, $http, userService, $state, $stateParams, $location) {

	$http({
		method: 'GET',
		url: '/api/posts/' + $stateParams.postId
	}).success(function(data, status, config, headers) {
		$scope.post = data.post;
	}).error(function(data, status, config, headers) {

	});
}]);