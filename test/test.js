'use strict';
var assert = require('assert');
var fs = require('fs');
var Modularize = require('../lib/index');

describe('Modularize', function () {
	it('should return AMD and CommonJS wrapped code', function () {
		var input = fs.readFileSync('test/fixture.txt', 'utf8');
		var expected = fs.readFileSync('test/expected.txt', 'utf8');

		var output = Modularize({
			input: input,
			deps: [
				'riot',
				{'jquery': '$'},
				{'underscore': '_'},
				{'/path/to/custom/module': 'CustomModule'}
			],
			exports: 'Test'
		});

		assert.equal(output, expected);
	});
});