angular.module('ksControllers').controller('issuesCtrl', ['$scope', '$http', 'userService', '$location', function($scope, $http, userService, $location) {
	$scope.currentUser = userService.currentUser;

	$http({
		method: 'GET',
		url: '/api/issues'
	}).success(function(data, status, config, headers) {
		$scope.issues = data.issues;
	}).error(function(data, status, config, headers) {
	});

	$scope.clickIssue = function(issueId) {
		$location.path("/issues/" + issueId);
	}

	$scope.numConservative = function(issue) {
		return issue.posts.filter(function(post) {return post.side == "Conservative"}).length;
	};
	$scope.numLiberal = function(issue) {
		return issue.posts.filter(function(post) {return post.side == "Liberal"}).length;
	};

	$scope.hover = function(issue) {
		issue.hover = !issue.hover;
	};
	
}]).controller('issuesShowCtrl', ['$scope', '$http', 'userService', '$stateParams', 'issuesService', function($scope, $http, userService, $stateParams, issuesService) {

	$scope.issueId = $stateParams.issueId;
	$http({
		method: 'GET',
		url: '/api/issues/' + $stateParams.issueId
	}).success(function(data, status, config, headers) {
		$scope.issue = data.issue;
		issuesService.issue = $scope.issue;
	}).error(function(data, status, config, headers) {

	});
}]).controller('newIssueCtrl', ['$scope', '$http', '$location', '$modalInstance', function($scope, $http, $location, $modalInstance) {
	$scope.issue = {};

	$scope.submit = function() {
		$http({
			method: 'POST',
			url: '/api/issues',
			data: $scope.issue
		}).success(function(data, status, config, headers) {
			$modalInstance.close();
			$location.path("/issues");
		}).error(function(data, status, config, headers) {

		});
	};

}]);