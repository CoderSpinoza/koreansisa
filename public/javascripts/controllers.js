'use strict';

/* *********** *
 * Controllers *
 * *********** */

var ksControllers = angular.module('ksControllers', []);

ksControllers.controller('menuCtrl', ['$scope', '$location', function($scope, $location) {
	$scope.name = "Hara Kang";
}]);