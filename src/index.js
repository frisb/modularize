export default function (options) {
	let {input, deps, exports, type} = options;
	deps = deps || [];

	let params = '';
	let rootParams = '';
	let amdRequired = '';
	let commonJSRequired = '';
	let returns = '';

	for (let i = 0; i < deps.length; i++) {
		let dependency = deps[i];

		if (typeof(dependency) === 'string') {
			let obj = {};
			obj[dependency] = dependency;
			dependency = obj;
		}

		for (let path in dependency) {
			let param = dependency[path];
			let sep = i < deps.length - 1 ? ', ' : '';

			amdRequired += `'${path}'${sep}`;
			commonJSRequired += `\t\tvar ${param} = require('${path}');\n`;
			params += `${param}${sep}`;
			rootParams += `root.${param}${sep}`;
		}
	}

	if (exports)
		returns = 'return ';

	function content() {
		let output = '';
		let lines = input.replace(/\r\n/g, '\n').split('\n');
		let len = lines.length;

		for (let j = 0; j < len; j++) {
			output += `\t${lines[j]}\n`;
		}

		return output + (exports ? `\n\treturn ${exports};` : '');
	}

	function amd() {
		return `define([${amdRequired}], function(${params}) {
${content()}
});`;
	}

	function commonjs() {
		return `${commonJSRequired}
${content()}`;
	}

	function umd() {
		return `(function(root, factory) {
	if (typeof(define) === 'function' && define.amd) {
		define([${amdRequired}], function(${params}) {
			${returns}factory(${params});
		});
	}
	else if (typeof(module) !== 'undefined' && typeof module.exports !== 'undefined') {
${commonJSRequired}
		${returns}factory(${params});
	}
	else {
		${returns}factory(${rootParams});
	}
})(this, function(${params}) {
${content()}
});`;
	}

	switch (type) {
		case 'amd': return amd();
		case 'common': return commonjs();
		default: return umd();
	}
}