angular.module('ksControllers').controller('issuesCtrl', ['$scope', '$http', 'userService', '$location', '$modal', function($scope, $http, userService, $location, $modal) {
	$scope.currentUser = userService.currentUser;

	var getIssue = function() {
		$http({
			method: 'GET',
			url: '/api/issues'
		}).success(function(data, status, config, headers) {
			$scope.issues = data.issues;
		}).error(function(data, status, config, headers) {
		});
	};

	getIssue();

	$scope.$watch('loadAgain', function(loadAgain) {
		if (loadAgain) getIssue();
	});

	$scope.newIssueClicked = function() {
		$modal.open({
			templateUrl: "issues/new.html",
			controller: 'newIssueCtrl',
		}).result.then(function(loadAgain) {
			$scope.loadAgain = loadAgain;
		});
	};
	
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
	
}]).controller('issuesShowCtrl', ['$scope', '$http', 'userService', '$routeParams', 'issuesService', function($scope, $http, userService, $routeParams, issuesService) {
	$scope.$watch(function() { return userService.currentUser; }, function(currentUser) {
		$scope.currentUser = userService.currentUser;
	});

	$scope.issueId = $routeParams.issueId;

	$http({
		method: 'GET',
		url: '/api/issues/' + $routeParams.issueId
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
			$modalInstance.close(true);
			$location.path("/issues");
		}).error(function(data, status, config, headers) {

		});
	};

}]);