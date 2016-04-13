(function(root, factory) {
	if (typeof(define) === 'function' && typeof(define.amd) !== 'undefined') {
		define(['riot', 'jquery', 'underscore', '/path/to/custom/module'], function(riot, $, _, CustomModule) {
			return factory(riot, $, _, CustomModule);
		});
	}
	else if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
		var riot = require('riot');
		var $ = require('jquery');
		var _ = require('underscore');
		var CustomModule = require('/path/to/custom/module');

		module.exports = factory(riot, $, _, CustomModule);
	}
	else {
		root.Test = factory(root.riot, root.$, root._, root.CustomModule);
	}
})(this, function(riot, $, _, CustomModule) {
	function Test() {
	
	}

	return Test;
});