module.exports = function(grunt) {

  var stylesDirectory = 'public/styles';

  grunt.initConfig({
    jshint: {
      files: ['gruntfile.js', 'server.js', 'authentication/*.js', 'public/scripts/**/*.js', '!public/scripts/requirejs-config.js',
        'routes/*.js', 'sockets/*.js', 'errors/*.js', 'configuration/*.js'],
      options: {
        jshintrc: '.jshintrc'
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
      }
    },
    exec: {
      wrap: {
        command: 'r.js -convert public/scripts public/scripts'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-exec');
  grunt.registerTask('predeploy', ['stylus', 'exec:wrap']);
};