module.exports = function(grunt) {

  var stylesDirectory = 'public/styles';

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
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-lodash');
  grunt.registerTask('build', ['stylus', 'lodash', 'exec:jade', 'exec:amd']);
};
