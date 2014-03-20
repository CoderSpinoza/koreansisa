angular.module('ksControllers').controller('newCommentsCtrl', ['$scope', '$http', '$window', 'userService', '$routeParams', function($scope, $http, $window, userService, $routeParams) {
	$scope.currentUser = userService.currentUser;
	$scope.comment = {};
	$scope.submit = function() {
		$scope.comment.user = $scope.currentUser._id;
		$scope.comment.post = $routeParams.postId;
		$http({
			method: 'POST',
			url: '/api/comments',
			data: $scope.comment,
			headers: {
				'Content-type': 'application/json'
			}
		}).success(function(data, status, config, headers) {
			$scope.post.comments = data.comments;
			$scope.comment = {};
		}).error(function(data, status, config, headers) {

		});
	};
}]);