angular.module('ksControllers').controller('postsNewCtrl', ['$scope', '$http', 'userService', 'issuesService', '$state', '$stateParams', '$location', function($scope, $http, userService, issuesService, $state, $stateParams, $location) {
	$http({
		method: 'GET',
		url: '/api/issues/' + $stateParams.issueId
	}).success(function(data, status, config, headers) {
		$scope.issue = data.issue;
		$state.transitionTo($state.$parent);
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

}]);