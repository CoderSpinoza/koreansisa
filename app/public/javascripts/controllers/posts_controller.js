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

	$scope.deleteAlert = globalAlertsService.deleteAlert;

}]).controller('postsNewCtrl', ['$window', '$scope', '$http', 'userService', 'issuesService', '$routeParams', '$location', '$q', function($window, $scope, $http, userService, issuesService, $routeParams, $location, $q) {
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
	$scope.uploadingImage = false;
	$scope.alerts = [];

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


	// file uploading
	$scope.data = [];
	$scope.files = [];
	var reader = new FileReader();
	$scope.progress = 0;


	$scope.textAngularOpts = {};

	$scope.$watch('credentials', function(credentials) {
		if (credentials) {
			var index = $scope.data.length - 1;
			var key = 'images/' + new Date().getUTCFullYear() + "/" + (new Date().getUTCMonth() + 1) + "/" + new Date().getUTCDate() + "/" + Date.now() + $scope.data[$scope.data.length - 1].name;
			var data = {
				bucket: 'koreansisa',
				AWSAccessKeyId: credentials.s3Key,
				key: key,
				acl: 'public-read',
				policy: credentials.policyBase64,
				'Content-Type': $scope.data[$scope.data.length - 1].type,
				signature: credentials.signature,
				file: $scope.data[$scope.data.length - 1]
			};
			var formData = new FormData();
			for (var v in data) {
				formData.append(v, data[v]);
			}
			var xhr = new XMLHttpRequest();

			// XmlHttpRequest events
			xhr.upload.addEventListener("progress", function(e) {
				if (e.lengthComputable) {
					$scope.$apply(function() {
						$scope.data[index].progress = (e.loaded / e.total) * 100;
					});			
				}
			});
			xhr.addEventListener("load", function(e) {
				$scope.$apply(function() {
					$scope.uploadingImage = false;
					$scope.readyToInsert = true;
					$scope.data[index].link = 'https://' + credentials.s3Policy.conditions[0].bucket + '.s3.amazonaws.com/' + key;
				});
				
				document.execCommand("insertImage", false, $scope.data[index].link);
			});
			xhr.addEventListener("error", function(e) {

			});
			xhr.addEventListener("abort", function(e) {

			});				
			
			xhr.open('POST', 'https://' + credentials.s3Policy.conditions[0].bucket + '.s3.amazonaws.com/', true);
			xhr.send(formData);
			$scope.readyToInsert = false;
			$scope.uploadingImage = true;
		};
	});

	reader.onload = function(e) {
		$scope.files.push(e.target.result);
		$http({
			method: 'GET',
			url: '/api/s3/credentials/' + $scope.data[$scope.data.length - 1].type.split('/')[1]
		}).success(function(data, status, config, headers) {
			$scope.credentials = data.credentials;
		});
	};

	$scope.dropEvent = function(event) {
		for (var i = 0; i < event.dataTransfer.files.length; i++) {
			$scope.$apply(function() {
				$scope.data.push(event.dataTransfer.files[i]);
			});
      reader.readAsDataURL(event.dataTransfer.files[i]);
		}
	};

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};

	$scope.uploadComplete = function(file) {
		return file.progress == 100;
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