var fs = require('fs');

var stylesDirectory = 'public/styles';
var requirejsLibs = [];

// this code uses eval which creates a new variable called "require"
// it is wrapped in a function to avoid overwriting the original node require reference
(function() {
  var requirejsConfig = fs.readFileSync('public/scripts/requirejs-config.js');
  // creates the require variable used in requirejs config to list all library paths
  requirejsConfig = eval(requirejsConfig + " require");
  requirejsLibs = Object.keys(requirejsConfig.paths);
}());


module.exports = function(grunt) {

  grunt.initConfig({
    exec: {
      jade: {
        command: 'jade-amd --from views/ --to public/scripts/templates'
      },
      amd: {
        command: 'r.js -convert public/scripts public/scripts'
      }
    },
    jshint: {
      files: ['gruntfile.js', 'server.js', 'authentication/*.js', 'public/scripts/**/*.js', '!public/scripts/templates/*.js',
        '!public/scripts/requirejs-config.js', 'routes/*.js', 'sockets/*.js', 'errors/*.js', 'configuration/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    lodash: {
      build: {
        dest: 'public/vendor/lodash.js',
        options: {
          minus: ['template'],
          modifier: 'modern',
          exports: ['amd']
        },
        flags: [
          '--minify'
        ]
      }
    },
    'string-replace': {
      dist: {
        files: {
          'views/layout.jade': 'views/layout.jade'
        },
        options: {
          replacements: [
            {
              pattern: /scripts\//gi,
              replacement: 'scripts-build/'
            }
          ]
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          appDir: 'public/scripts',
          baseUrl: './',
          dir: 'public/scripts-build',
          mainConfigFile: 'public/scripts/requirejs-config.js',
          optimize: 'uglify2',
          modules: [
            {
              name: 'init/main',
              exclude: requirejsLibs
            },
            {
              name: 'genres/main',
              exclude: requirejsLibs
            },
            {
              name: 'groups/main',
              exclude: requirejsLibs
            },
            {
              name: 'new/main',
              exclude: requirejsLibs
            },
            {
              name: 'story/main',
              exclude: requirejsLibs
            },
            {
              name: 'summaries/main',
              exclude: requirejsLibs
            }
          ]
        }
      }
    },
    stylus: {
      compile: {
        options: {
          use: [
            require('nib') // use stylus plugin at compile time
          ],
          paths: [stylesDirectory],
          'include css': true
        },
        files: {
          'public/styles/reset.css': stylesDirectory + '/reset.styl',
          'public/styles/main.css': [stylesDirectory + '/main.styl']
        }
      }
    },
    watch: {
      jshint: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint']
      },
      stylus: {
        files: [stylesDirectory + '/*.styl'],
        tasks: ['stylus']
      },
      jade: {
        files: ['views/*.jade'],
        tasks: ['exec:jade']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-lodash');
  grunt.loadNpmTasks('grunt-string-replace');

  grunt.registerTask('build', ['exec:jade', 'requirejs', 'string-replace', 'stylus']);
};
