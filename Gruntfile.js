module.exports = function (grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		clean: {
			dist: ['dist']
		},

		sprite: {
			all: {
				src: 'app/images/sprite/**/*.png',
				destImg: 'app/images/sprite.png',
				imgPath: '../images/sprite.png',
				destCSS: 'app/styles/helpers/sprite.styl',
				cssFormat: 'stylus',
				algorithm: 'binary-tree',
				padding: 8,
				imgOpts: {
					format: 'png'
				}
			},
			themes: {
				src: 'app/themes/default/images/sprite/**/*.png',
				destImg: 'app/themes/default/images/sprite.png',
				imgPath: '../themes/default/images/sprite.png',
				destCSS: 'app/styles/helpers/default-theme-sprite.styl',
				cssFormat: 'stylus',
				algorithm: 'binary-tree',
				padding: 8,
				imgOpts: {
					format: 'png'
				}
			}
		},

		imagemin: {
			images: {
				files: [{
					expand: true,
					cwd: 'app/images',
					src: ['**/*.{png,jpg,gif}', '!sprite/**/*'],
					dest: 'dist/images'
				}, {
					expand: true,
					cwd: 'app/themes/default/images',
					src: ['**/*.{png,jpg,gif}', '!sprite/**/*'],
					dest: 'dist/themes/default/images'
				}]
			}
		},

		stylus: {
			options: {
				compress: false
			},
			compile: {
				files: [{
					cwd: 'app/styles',
					src: ['*.styl'],
					dest: 'dist/styles',
					expand: true,
					ext: '.css'
				}, {
					cwd: 'app/themes',
					src: ['**/*.styl'],
					dest: 'dist/themes',
					expand: true,
					ext: '.css'
				}]
			}
		},

		autoprefixer: {
			options: {
				browsers: [
					'Android >= <%= pkg.browsers.android %>',
					'Chrome >= <%= pkg.browsers.chrome %>',
					'Firefox >= <%= pkg.browsers.firefox %>',
					'Explorer >= <%= pkg.browsers.ie %>',
					'iOS >= <%= pkg.browsers.ios %>',
					'Opera >= <%= pkg.browsers.opera %>',
					'Safari >= <%= pkg.browsers.safari %>'
				]
			},
			all: {
				src: ['dist/styles/**/*.css', 'dist/themes/**/*.css']
			}
		},

		cmq: {
			dist: {
				files: {
					'dist/styles': [
						'dist/styles/*.css'
					]
				}
			}
		},

		csscomb: {
			dist: {
				options: {
					config: '.csscomb.json'
				},
				files: [{
					expand: true,
					cwd: 'dist/styles',
					src: '**/*.css',
					dest: 'dist/styles'
				}]
			}
		},

		jade: {
			dist: {
				options: {
					pretty: true,
					data: {
						page: {
							assets: '',
							copyright: '<%= pkg.copyright %>',
							description: '<%= pkg.description %>',
							keywords: '<%= pkg.keywords.join(\', \') %>',
							replyTo: '<%= pkg.bugs.email %>',
							title: '<%= pkg.title %>'
						}
					}
				},
				files: [{
					cwd: 'app/templates',
					src: ['**/*.jade', '!{helpers,partials}/**/*'],
					dest: 'dist/',
					expand: true,
					ext: '.html'
				}, {
					cwd: 'app/themes',
					src: ['**/*.jade'],
					dest: 'dist/themes',
					expand: true,
					ext: '.html'
				}]
			}
		},

		prettify: {
			options: {
				brace_style: 'expand',
				indent: 1,
				indent_char: '	',
				condense: true,
				indent_inner_html: true
			},
			all: {
				expand: true,
				cwd: 'dist',
				ext: '.html',
				src: ['pages/*.html'],
				dest: 'dist'
			},
		},

		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				force: true,
				globals: {
					jQuery: true
				}
			},
			all: [
				'app/scripts/**/*.js',
				'!app/scripts/libs/**/*',
				'!app/scripts/browsehappy/**/*',
				'app/scripts/browsehappy/browsehappy.js'
			],
			configFiles: [
				'.csscomb.json',
				'Gruntfile.js',
				'package.json'
			]
		},

		copy: {
			fonts: {
				files: [{
					expand: true,
					cwd: 'app/fonts',
					src: '**/*',
					dest: 'dist/fonts',
					filter: 'isFile'
				}]
			},
			styles: {
				files: [{
					expand: true,
					cwd: 'app/styles/libs',
					src: '*.css',
					dest: 'dist/styles/libs',
					filter: 'isFile'
				}]
			},
			scripts: {
				files: [{
					expand: true,
					cwd: 'app/scripts',
					src: ['**/*.js', '!browsehappy'],
					dest: 'dist/scripts',
					filter: 'isFile'
				}]
			},
			svg: {
				files: [{
					expand: true,
					cwd: 'app/images/svg',
					src: '**/*.svg',
					dest: 'dist/images/svg',
					filter: 'isFile'
				}]
			},
			favicon: {
				files: [{
					expand: true,
					cwd: 'app',
					src: 'images/icons/favicon.ico',
					dest: 'dist',
					filter: 'isFile'
				}]
			}
		},

		uglify: {
			options: {
				report: 'min',
				mangle: {
					except: ['jQuery']
				}
			},
			browsehappy: {
				files: {
					'dist/scripts/libs/browsehappy.min.js': [
						'app/scripts/browsehappy/detect.min.js',
						'app/scripts/browsehappy/browsehappy.js'
					]
				}
			}
		},

		browserSync: {
			dist: {
				bsFiles: {
					src: 'dist/**/*'
				},
				options: {
					open: false,
					server: {
						baseDir: 'dist'
					},
					watchTask: true
				}
			}
		},

		replace: {
			browsehappy: {
				options: {
					patterns: [{
						json: {
							'android': '<%= pkg.browsers.android %>',
							'chrome': '<%= pkg.browsers.chrome %>',
							'firefox': '<%= pkg.browsers.firefox %>',
							'ie': '<%= pkg.browsers.ie %>',
							'ios': '<%= pkg.browsers.ios %>',
							'opera': '<%= pkg.browsers.opera %>',
							'safari': '<%= pkg.browsers.safari %>'
						}
					}]
				},
				files: [{
					src: 'dist/scripts/libs/browsehappy.min.js',
					dest: 'dist/scripts/libs/browsehappy.min.js'
				}]
			},
			dist: {
				options: {
					patterns: [{
						json: {
							'assets': ''
						}
					}]
				},
				files: [{
					expand: true,
					cwd: 'dist/scripts',
					src: ['main.js'],
					dest: 'dist/scripts',
					filter: 'isFile'
				}]
			}
		},

		connect: {
			dist: {
				options: {
					port: 9999,
					base: 'dist'
				}
			}
		},

		watch: {
			options: {
				dateFormat: function(ms) {
					var now = new Date(),
						time = now.toLocaleTimeString(),
						day = now.getDate(),
						month = (now.getMonth() + 1),
						year = now.getFullYear();

					if (day < 10) {
						day = '0' + day;
					}

					if (month < 10) {
						month = '0' + month;
					}

					grunt.log.subhead(
						'Completed in ' + Math.round(ms) + 'ms at ' + time + ' ' +
						day + '.' + month + '.' + year + '.\n' +
						'Waiting for more changes...'
					);
				},
			},
			configFiles: {
				files: [
					'.csscomb.json',
					'Gruntfile.js',
					'package.json'
				],
				options: {
					reload: true
				},
				tasks: ['newer:jshint:configFiles']
			},
			livereload: {
				options: {
					livereload: true
				},
				files: ['dist/**/*']
			},
			sprite: {
				files: [
					'app/images/sprite/**/*.png',
					'app/themes/default/images/sprite/**/*.png',
				],
				tasks: ['sprite']
			},
			imagemin: {
				files: [
					'app/images/**/*.{png,jpg,gif}',
					'!app/images/sprite/**/*',
					'app/themes/default/images/**/*.{png,jpg,gif}',
					'!app/themes/default/images/sprite/**/*',
				],
				tasks: ['newer:imagemin']
			},
			stylus: {
				files: ['app/styles/**/*.styl', 'app/themes/**/*.styl'],
				tasks: ['stylus', 'autoprefixer', 'cmq', 'csscomb']
			},
			jade: {
				files: ['app/templates/**/*.jade', '!app/templates/partials/**/*', 'app/themes/**/*.jade'],
				tasks: ['newer:jade', 'newer:prettify']
			},
			jadePartials: {
				files: 'app/templates/partials/**/*.jade',
				tasks: ['jade', 'newer:prettify']
			},
			jshint: {
				files: [
					'app/scripts/**/*.js',
					'!app/scripts/libs/**/*',
					'!app/scripts/browsehappy/**/*',
					'app/scripts/browsehappy/browsehappy.js'
				],
				tasks: ['newer:jshint:all']
			},
			scripts: {
				files: [
					'app/scripts/**/*.js',
					'!app/scripts/browsehappy/**/*',
					'!app/scripts/libs/**/*'
				],
				tasks: ['newer:copy:scripts', 'newer:replace:dist']
			},
			browsehappy: {
				files: ['app/scripts/browsehappy/**/*.js'],
				tasks: ['newer:uglify', 'newer:replace:browsehappy']
			},
			copyFonts: {
				files: ['app/fonts/**/*'],
				tasks: ['newer:copy:fonts']
			},
			copySvg: {
				files: ['app/images/svg/**/*.svg'],
				tasks: ['newer:copy:svg']
			},
			copyFavicon: {
				files: ['app/favicon.ico'],
				tasks: ['copy:favicon']
			}
		},

		bump: {
			options: {
				files: ['package.json'],
				updateConfigs: ['pkg'],
				commit: false,
				commitMessage: false,
				commitFiles: false,
				createTag: false,
				tagName: false,
				tagMessage: false,
				push: false,
				pushTo: false,
				gitDescribeOptions: false
			}
		}

	});

	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('grunt-devtools');

	grunt.registerTask('build', [
		'clean:dist',
		'sprite',
		'imagemin',
		'stylus',
		'autoprefixer',
		'cmq',
		'csscomb',
		'jade',
		'prettify',
		'jshint',
		'copy',
		'uglify:browsehappy',
		'replace'
	]);

	grunt.registerTask('serve', [
		'connect:dist:keepalive'
	]);

	grunt.registerTask('default', [
		'build',
		'connect:dist',
		'watch'
	]);

};
