Object.defineProperty(exports, '__esModule', {
	value: true
});

exports['default'] = function (_ref) {
	var input = _ref.input;
	var deps = _ref.deps;
	var exports = _ref.exports;
	var type = _ref.type;

	deps = deps || [];

	var params = '';
	var rootParams = '';
	var es6Required = '';
	var amdRequired = '';
	var commonJSRequired = '';
	var returns = '';

	for (var i = 0; i < deps.length; i++) {
		var dependency = deps[i];

		if (typeof dependency === 'string') {
			var obj = {};
			obj[dependency] = dependency;
			dependency = obj;
		}

		for (var path in dependency) {
			var param = dependency[path];
			var sep = i < deps.length - 1 ? ', ' : '';

			es6Required += 'import ' + param + ' from \'' + path + '\';\n';
			amdRequired += '\'' + path + '\'' + sep;
			commonJSRequired += '\t\tvar ' + param + ' = require(\'' + path + '\');\n';
			params += '' + param + sep;
			rootParams += 'root.' + param + sep;
		}
	}

	if (exports) {
		switch (type) {
			case 'es6':
				returns = 'export default';
				break;

			case 'common':
				returns = 'module.exports =';
				break;

			default:
				returns = 'return';
				break;
		}
	}

	function content() {
		var output = '';
		var lines = input.replace(/\r\n/g, '\n').split('\n');
		var len = lines.length;

		for (var j = 0; j < len; j++) {
			output += '\t' + lines[j] + '\n';
		}

		return output + (exports ? '\n\t' + returns + ' ' + exports + ';' : '');
	}

	function es6() {
		return es6Required + '\n' + content();
	}

	function amd() {
		return 'define([' + amdRequired + '], function(' + params + ') {\n' + content() + '\n});';
	}

	function commonjs() {
		return commonJSRequired + '\n' + content();
	}

	function umd() {
		return '(function(root, factory) {\n\tif (typeof(define) === \'function\' && typeof(define.amd) !== \'undefined\') {\n\t\tdefine([' + amdRequired + '], function(' + params + ') {\n\t\t\t' + (exports ? 'return ' : '') + 'factory(' + params + ');\n\t\t});\n\t}\n\telse if (typeof(module) !== \'undefined\' && typeof(module.exports) !== \'undefined\') {\n' + commonJSRequired + '\n\t\t' + (exports ? 'module.exports = ' : '') + 'factory(' + params + ');\n\t}\n\telse {\n\t\t' + (exports ? 'root.' + exports + ' = ' : '') + 'factory(' + rootParams + ');\n\t}\n})(this, function(' + params + ') {\n' + content() + '\n});';
	}

	switch (type) {
		case 'es6':
			return es6();
		case 'amd':
			return amd();
		case 'common':
			return commonjs();
		default:
			return umd();
	}
};

module.exports = exports['default'];
