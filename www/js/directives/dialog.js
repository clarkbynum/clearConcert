angular.module('clearConcert', [])
.directive('dialog', function(){
	return {
		template: [
			'<div class="dialog-outer">',
			'<div class="dialog-backdrop"</div>',
			'<div class="dialog-window">',
			'<div class="dialog-title">Dialog Title',
			'</div>',
			'<div class="dialog-message>Test',
			'</div>',
			'<div class="dialog-button>',
			'<div jqm-button>',
			'</div>',
			'</div>',
			'</div>',
			'</div>'
		]
	}
})