module.exports = function (grunt) {
	grunt.initConfig({
		clean: {
			default: {
				src: ['lib']
			}
		},

		babel: {
			options: {
				blacklist: ['strict'],
				sourceMap: false
			},
			compile: {
				files: [
					{
						expand: true,
						cwd: 'src',
						src: '**/*.js',
						dest: 'lib'
					}
				]
			}
		},
		mochaTest: {
			modularize: {
				options: {
					reporter: 'spec'
				},
				src: ['test/**/*.js']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.registerTask('default', ['clean', 'babel', 'mochaTest']);
};
