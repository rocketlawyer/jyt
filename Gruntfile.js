
var childProcess = require('child_process');

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                force: true
            },
            files: [
                'lib/**/*.js'
            ]
        },

        concat: {
            options: {
                banner: '/*!\n\n <%= pkg.name %> v<%= pkg.version %>\n\n<%= grunt.file.read("LICENSE") %>\n@license\n*/\n',
                process: function(src, name) {
                    var match = /\/\/ BEGIN\(BROWSER\)\n((?:.|\n)*)\n\/\/ END\(BROWSER\)/.exec(src);
                    return '\n// ' + name + '\n' + (match ? match[1] : src);
                },
                separator: ';'
            },
            dist: {
                src: [
                    'lib/jeff/browser-prefix.js.txt',
                    'lib/jeff/base.js',
                    'lib/jeff/utils.js',
                    'lib/jeff/runtime.js',
                    'lib/jeff/browser-suffix.js.txt'
                ],
                dest: 'dist/jeff.js'
            }
        },
        uglify: {
            options: {
                mangle: true,
                compress: true,
                preserveComments: 'some'
            },
            dist: {
                src: 'dist/jeff.js',
                dest: 'dist/jeff.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //grunt.loadTasks('tasks');

    grunt.registerTask('dist-dir', function() {
        grunt.file.delete('dist');
        grunt.file.mkdir('dist');
    });

    grunt.registerTask('test', function() {
        var done = this.async();

        var runner = childProcess.fork('./test/env/runner', [], {stdio: 'inherit'});
        runner.on('close', function(code) {
            if (code != 0) {
                grunt.fatal(code + ' tests failed');
            }
            done();
        });
    });
    //grunt.registerTask('bench', ['metrics']);

    grunt.registerTask('build', ['jshint', 'dist-dir', 'concat', 'uglify', 'test']);
    grunt.registerTask('default', 'build');
};
