module.exports = function(grunt){
	//do grunt-related things in here

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		www: 'www',

		replace: {
  			ios: {
    			src: ['<%= www %>/index.html'],             // source files array (supports minimatch)
    			dest: 'platforms/ios/www/index.html',             // destination directory or file
    			replacements: [{ 
      				from: '../../ClearCommon/common',                   // string replacement
      				to: 'ClearCommon' 
    			}, {
    				from: '<!--CORDOVA LIB-->',
    				to: '<script src="cordova.js"></script>'
    			}, {
    				from: '<script src="http://localhost:1337/livereload.js"></script>',
    				to: ''
    			}, {
    				from: '../../ClearJazz/common',
    				to: 'ClearJazz'
    			}]
  			},
  			iosGood: {
    			src: ['<%= www %>/index.html'],             // source files array (supports minimatch)
    			dest: 'platforms/ios_good/www/index.html',             // destination directory or file
    			replacements: [{ 
      				from: '../../ClearCommon/common',                   // string replacement
      				to: 'ClearCommon' 
    			}, {
    				from: '<!--CORDOVA LIB-->',
    				to: '<script src="cordova.js"></script>'
    			}, {
    				from: '<!--GOOD-->',
    				to: '<script type="text/javascript" charset="utf-8" src="GoodDynamics.js"></script>'
    			},{
    				from: '<script src="http://localhost:1337/livereload.js"></script>',
    				to: ''
    			}, {
    				from: '../../ClearJazz/common',
    				to: 'ClearJazz'
    			}]
  			},
  			android: {
    			src: ['<%= www %>/index.html'],             // source files array (supports minimatch)
    			dest: 'platforms/android/assets/www/index.html',             // destination directory or file
    			replacements: [{ 
      				from: '../../ClearCommon/common',                   // string replacement
      				to: 'ClearCommon' 
    			}, {
    				from: '<!--CORDOVA LIB-->',
    				to: '<script src="cordova.js"></script>'
    			}, {
    				from: '<script src="http://localhost:1337/livereload.js"></script>',
    				to: ''
    			}, {
    				from: '../../ClearJazz/common',
    				to: 'ClearJazz'
    			}]
  			}
		},

		copy: {
			ios: {
				files: [{
					expand: true, 
					cwd: 'www/', 
					src: ['**/*'], 
					dest: 'platforms/ios/www'
				}]
			},
			iosGood: {
				files: [{
					expand: true, 
					cwd: 'www/', 
					src: ['**/*'], 
					dest: 'platforms/ios_good/www'
				}]
			},
			android: {
				files: [{
					expand: true, 
					cwd: 'www/', 
					src: ['**/*'], 
					dest: 'platforms/android/assets/www'
				}]
			},
			cordovaJS: {
				files: {
					'platforms/ios/www/cordova.js': '../ClearCommon/ios/www/cordova.js',
					'platforms/android/assets/www/cordova.js': '../ClearCommon/android/www/cordova.js',
					'platforms/ios_good/www/cordova.js': '../ClearCommon/ios/www/cordova.js',
				}
			},
			goodJS: {
				files: {
					'platforms/ios_good/www/GoodDynamics.js': '../ClearCommon/ios/www/GoodDynamics.js',
				}
			},
			clearCommon: {
				files: [{
					expand: true,
					cwd: '../ClearCommon/common/',
					src: ['**/*'],
					dest: 'platforms/ios/www/ClearCommon/'
				}, {
					expand: true,
					cwd: '../ClearCommon/common/',
					src: ['**/*'],
					dest: 'platforms/ios_good/www/ClearCommon/'
				}, {
					expand: true,
					cwd: '../ClearCommon/common/',
					src: ['**/*'],
					dest: 'platforms/android/assets/www/ClearCommon/'
				}, {
					expand: true, 
					cwd: '../ClearCommon/ios/www/', 
					src: ['**/*'], 
					dest: 'platforms/ios/www/ClearCommon/'
				}, {
					expand: true, 
					cwd: '../ClearCommon/ios/www/', 
					src: ['**/*'], 
					dest: 'platforms/ios_good/www/ClearCommon/'
				}, {
					expand: true, 
					cwd: '../ClearCommon/android/assets/www/',
					src: ['**/*'], 
					dest: 'platforms/android/assets/www/ClearCommon'
				}]
			},
			clearJazz: {
				files: [{
					expand: true,
					cwd: '../ClearJazz/common/',
					src: ['**/*'],
					dest: 'platforms/ios/www/ClearJazz/'
				}, {
					expand: true,
					cwd: '../ClearJazz/common/',
					src: ['**/*'],
					dest: 'platforms/ios_good/www/ClearJazz/'
				}, {
					expand: true,
					cwd: '../ClearJazz/common/',
					src: ['**/*'],
					dest: 'platforms/android/assets/www/ClearJazz/'
				}]
			}
		},

		clean: {
			android: ['platforms/android/assets/www/'],
			ios: ['platforms/ios/www/'],
			iosGood: ['platforms/ios_good/www/']
		},

		karma: {
			options: {
				configFile: './karma.conf.js'
			},
			continuous: {
				singleRun: true,
			},
			watch: {
				background: true,
			}
		},

		watch: {
			js: {
				files: ['www/**/*.html', 'www/**/*.js', '../ClearJazz/**/*.js'],
				tasks: ['karma:watch:run', 'build'],
				options: {
				    livereload: 1337,
				}
			}
		}
	}); 

	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('dev', ['karma:watch', 'watch']);
	grunt.registerTask('build', ['clean', 'copy', 'replace']);
	grunt.registerTask('default', ['karma:continuous', 'build']);

	grunt.registerTask('iosBuild', 'Build iOS project from common.', function(){
		grunt.task.run('clean:ios','copy:ios','replace:ios','copy:commonIOS','copy:cordovaIOS');
	});

	grunt.registerTask('androidBuild', 'Build Android project from common.', function(){
		grunt.task.run('clean:android','copy:android','replace:android','copy:commonAndroid', 'copy:cordovaAndroid');
	});

};