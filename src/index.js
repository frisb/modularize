export default function ({input, deps, exports, type}) {
	deps = deps || [];

	let params = '';
	let rootParams = '';
	let es6Required = '';
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

			es6Required += `import ${param} from '${path}';\n`;
			amdRequired += `'${path}'${sep}`;
			commonJSRequired += `\t\tvar ${param} = require('${path}');\n`;
			params += `${param}${sep}`;
			rootParams += `root.${param}${sep}`;
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
		let output = '';
		let lines = input.replace(/\r\n/g, '\n').split('\n');
		let len = lines.length;

		for (let j = 0; j < len; j++) {
			output += `\t${lines[j]}\n`;
		}

		return output + (exports ? `\n\t${returns} ${exports};` : '');
	}

	function es6() {
		return `${es6Required}
${content()}`;
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
	if (typeof(define) === 'function' && typeof(define.amd) !== 'undefined') {
		define([${amdRequired}], function(${params}) {
			${exports ? 'return ' : ''}factory(${params});
		});
	}
	else if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
${commonJSRequired}
		${exports ? 'module.exports = ' : ''}factory(${params});
	}
	else {
		${exports ? 'root.' + exports + ' = ' : ''}factory(${rootParams});
	}
})(this, function(${params}) {
${content()}
});`;
	}

	switch (type) {
		case 'es6': return es6();
		case 'amd': return amd();
		case 'common': return commonjs();
		default: return umd();
	}
}