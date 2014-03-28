angular.module('ksDirectives', []).directive('taDnd', function($parse) {
	return {
		restrict: 'A',
		link: function($scope, elem, attrs) {
			var ta = elem[0].childNodes[1];

			ta.ondragover = function(e) { e.preventDefault(); e.stopPropagation(); this.classList.add('hover');};
			ta.ondragleave = function(e) { e.preventDefault(); e.stopPropagation(); this.classList.remove('hover');};
			ta.ondrop = function(e) { 
				e.preventDefault(); 
				e.stopPropagation(); 
				this.classList.remove('hover'); 
				$scope.$eval(attrs.taDnd)(e.dataTransfer.files);
			};
		}
	};
});