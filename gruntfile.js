module.exports = function(grunt) {

  var stylesDirectory = 'public/styles';

  grunt.initConfig({
    jshint: {
      files: ['gruntfile.js', 'public/scripts/*.js', '!public/scripts/lib/**'],
      options: {
        // options here to override JSHint defaults
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
          'public/styles/style.css': stylesDirectory + '/*.styl'
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-stylus');

};