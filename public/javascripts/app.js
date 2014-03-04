'use strict';

/* App Module */
var ksApp = angular.module('ksApp', [
	'ngRoute',
	'ngCookies',
	'ngSanitize',
	'ksControllers',
	'ksServices',
	'ksFilters',
	'ksDirectives'
	]);

ksApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
}]);