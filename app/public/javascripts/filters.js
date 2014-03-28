'use strict';

/* ********** *
 *  Filters   *
 * ********** */

angular.module('ksFilters', []).filter('timeago', function() {
	return function(date) {
		return moment(date).fromNow();
	};
}).filter('capitalize', function() {
	return function(input) {
		return input.substring(0, 1).toUpperCase() + input.substring(1);
	};
}).filter('localDate', function() {
	return function(date) {
		return moment(date).local().format('YYYY-MM-DD HH:mm:ss');
	};
}).filter('filesize', function() {
  return function(size) {
    if (isNaN(size)) size = 0;
    if (size < 1024) return size + 'Bytes';
    size /= 1024;
    var types = [' Kb', ' Mb', ' Gb', ' Tb'];
    for (var i = 0; i < types.length; i++) {
      if (size < 1024) return size.toFixed(2) + types[i];
      size /= 1024;
    }
  };
});