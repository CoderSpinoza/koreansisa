angular.module('ksControllers').controller('issuesCtrl', ['$scope', '$http', 'userService', function($scope, $http, userService) {
	$scope.currentUser = userService.currentUser;

	$http({
		method: 'GET',
		url: '/api/issues'
	}).success(function(data, status, config, headers) {
		$scope.issues = data.issues;
	}).error(function(data, status, config, headers) {
	});

	$scope.scroll = function(element) {
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