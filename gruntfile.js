module.exports = function(grunt) {

  var stylesDirectory = 'public/styles';

  grunt.initConfig({
    jshint: {
      files: ['gruntfile.js', 'server.js', 'public/scripts/*.js', 'routes/*.js', 'sockets/*.js, schemas/*.js'],
      options: {
        // options here to override JSHint defaults
        eqnull: true,
        laxcomma: true
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
    },
    exec: {
      "wrap-commonjs": {
        command: 'r.js -convert public/scripts public/scripts'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-exec');
  grunt.registerTask('predeploy', ['stylus', 'exec:wrap-commonjs']);
};