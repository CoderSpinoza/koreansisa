angular.module('ksDirectives', []).directive('csDnd', function($parse) {
	return {
		restrict: 'A',
		link: function($scope, elem, attrs) {
			var target = attrs.csDndTarget ? elem[0].querySelector("#" + attrs.csDndTarget) : elem[0];
			target.ondragover = function(e) { e.preventDefault(); e.stopPropagation(); this.classList.add('hover');};
			target.ondragleave = function(e) { e.preventDefault(); e.stopPropagation(); this.classList.remove('hover');};
			target.ondrop = function(e) { 
				e.preventDefault(); 
				e.stopPropagation(); 
				this.classList.remove('hover');
				$scope.$eval(attrs.csDnd)(e);
			};
		}
	};
}).directive('csFocus', function($parse) {
	return {
		restrict: 'A',
		link: function($scope, elem, attrs) {
			$scope.$watch(attrs.csFocus, function(value) {
				if (value) elem[0].childNodes[1].focus();
			});
		}
	};
});