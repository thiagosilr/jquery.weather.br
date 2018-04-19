module.exports = function( grunt ) {

	grunt.initConfig( {

		// Import package manifest
		pkg: grunt.file.readJSON( "package.json" ),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.license %> License\n" +
				" */\n"
		},

		copy: {
			main: {
				expand: true,
				cwd: 'src',
			    src: 'font/*',
			    dest: 'dist'
			}
		},

		// Concat definitions
		concat: {
			options: {
				banner: "<%= meta.banner %>"
			},
			js: {
				src: [ "src/jquery.i18next.min.js", "src/jquery.weather.br.js" ],
				dest: "dist/jquery.weather.br.js"
			},
			css: {
				src: [ "src/jquery.weather.br.css", "src/jquery.weather.br.icons.css" ],
				dest: "dist/jquery.weather.br.css"
			},
			locales: {
				options: {
		        	banner: ''
		      	},
				files: {
		        	'dist/locales/dev.json': ['src/locales/dev.json'],
		        	'dist/locales/en.json': ['src/locales/en.json'],
		        	'dist/locales/es.json': ['src/locales/es.json'],
		        	'dist/locales/pt.json': ['src/locales/pt.json'],
		      	}
			}
		},

		// Lint definitions
		jshint: {
			files: [ "src/jquery.weather.br.js" ],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Minify JS definitions
		uglify: {
			dist: {
				src: [ "dist/jquery.weather.br.js" ],
				dest: "dist/jquery.weather.br.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// Minify CSS definitions
		cssmin: {
		  target: {
		    files: [{
		      expand: true,
		      cwd: 'dist',
		      src: ['jquery.weather.br.css'],
		      dest: 'dist',
		      ext: '.weather.br.min.css'
		    }]
		  }
		}
	} );

	grunt.loadNpmTasks( "grunt-contrib-concat" );
	grunt.loadNpmTasks( "grunt-contrib-jshint" );
	grunt.loadNpmTasks( "grunt-contrib-uglify" );
	grunt.loadNpmTasks( "grunt-contrib-cssmin" );
	grunt.loadNpmTasks( "grunt-contrib-copy" );

	grunt.registerTask( "lint", [ "jshint" ] );
	grunt.registerTask( "build", [ "concat", "uglify", "cssmin" ] );
	grunt.registerTask( "default", [ "copy", "lint", "build" ] );
};
