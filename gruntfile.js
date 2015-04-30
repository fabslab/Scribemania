var fs = require('fs')
  , loadGruntTasks = require('load-grunt-tasks');

var stylesDirectory = 'public/styles';
var requirejsLibs = [];

// this code uses eval which creates a new variable called "require"
// it is wrapped in a function to avoid overwriting the original node require reference
(function() {
  var requirejsConfig = fs.readFileSync('public/scripts/requirejs-config.js');
  // creates the require variable used in requirejs config to list all client library paths
  requirejsConfig = eval(requirejsConfig + ' require');
  requirejsLibs = Object.keys(requirejsConfig.paths);
}());


module.exports = function(grunt) {

  // load npm grunt tasks listed in package.json
  loadGruntTasks(grunt, {
    scope: ['devDependencies']
  });

  grunt.initConfig({
    exec: {
      amd: {
        command: 'r.js -convert public/scripts public/scripts'
      }
    },
    jade: {
      amd: {
        files: {
          'public/scripts/templates/': ['views/*.jade']
        },
        options: {
          wrap: {
            amd: true,
            dependencies: 'jadeRuntime',
            runtime: false
          }
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
          'public/styles/main.css': [
              stylesDirectory + '/reset.styl',
              stylesDirectory + '/main.styl'
          ]
        }
      }
    },
    watch: {
      stylus: {
        files: [stylesDirectory + '/*.styl'],
        tasks: ['stylus']
      },
      jade: {
        files: ['views/*.jade'],
        tasks: ['jade']
      }
    }
  });

  grunt.registerTask('build', ['string-replace', 'stylus', 'jade', 'requirejs']);
  grunt.registerTask('default', ['build']);
};
