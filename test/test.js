'use strict';
var assert = require('assert');
var fs = require('fs');
var Modularize = require('../lib/index');

function extend(out) {
	out = out || {};

	for (var i = 1; i < arguments.length; i++) {
		if (!arguments[i])
			continue;

		for (var key in arguments[i]) {
			if (arguments[i].hasOwnProperty(key)) {
				var newVal = arguments[i][key];

				if (typeof(newVal) === 'undefined' && typeof(out[key]) !== 'undefined')
					continue;

				out[key] = arguments[i][key];
			}
		}
	}

	return out;
}

var options ={
	deps: [
		'riot',
		{'jquery': '$'},
		{'underscore': '_'},
		{'/path/to/custom/module': 'CustomModule'}
	],
	exports: 'Test'
};

describe('Modularize', function () {
	it('should return AMD wrapped code', function () {
		var type = 'amd';
		var input = fs.readFileSync('test/fixture.txt', 'utf8');
		var expected = fs.readFileSync('test/expected_' + type + '.txt', 'utf8');

		var output = Modularize(extend({}, options, { type: type, input: input }));

		assert.equal(output, expected);
	});

	it('should return CommonJS wrapped code', function () {
		var type = 'common';
		var input = fs.readFileSync('test/fixture.txt', 'utf8');
		var expected = fs.readFileSync('test/expected_' + type + '.txt', 'utf8');

		var output = Modularize(extend({}, options, { type: type, input: input }));

		assert.equal(output, expected);
	});

	it('should return UMD wrapped code', function () {
		var type = 'umd';
		var input = fs.readFileSync('test/fixture.txt', 'utf8');
		var expected = fs.readFileSync('test/expected_' + type + '.txt', 'utf8');

		var output = Modularize(extend({}, options, { input: input }));

		assert.equal(output, expected);
	});
});