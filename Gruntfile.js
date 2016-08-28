module.exports = function(grunt) {
  grunt.initConfig(
  { pkg: grunt.file.readJSON('package.json')
  , sass: 
    { dist: 
      { files: 
        { 'dist/css/<%= pkg.name %>.css': '.grunt/sass/<%= pkg.name %>.scss'      
        }
      }
    }
  , copy: 
    { materializeFont : 
      { files: [ { expand: true
                 , cwd: 'bower_components/materialize/fonts/'
                 , src: ['**']
                 , dest: 'dist/fonts/'} ]
      }
    , materializeSassFiles: 
      { files: [ { expand: true
                 , cwd: 'bower_components/materialize/sass/'
                 , src: ['**']
                 , dest: '.grunt/sass/'} ]            
      }         
    , requirejs : 
      { files : [ { expand: true 
                  , cwd : "bower_components/requirejs" 
                  , src : ["require.js"]
                  , dest: "dist/scripts"
                  } ]
      }   
    , sass : 
      { files : [ { expand: true 
                  , cwd : "dev/sass" 
                  , src : ["**"]
                  , dest: ".grunt/sass"
                  } ]
      }
    , img : 
      { files : [ { expand: true 
                  , cwd : "res/final" 
                  , src : ["**"]
                  , dest: "dist/img"
                  } ]
      }
    , audio : 
      { files : [ { expand: true 
                  , cwd : "res/sounds" 
                  , src : ["**"]
                  , dest: "dist/sounds"
                  } ]
      }
    
    , scripts : 
      { files : [ { expand: true 
                  , cwd : "dev/clientScripts" 
                  , src : ["**"]
                  , dest: "dist/scripts"
                  } ]
      }
    }  
    , watch: {
      css : {
        files: ['dev/sass/**']
      , tasks: ['copy:sass', 'sass']
      }
    , js : {
      files:  ['dev/clientScripts/**']
      , tasks: ['copy:scripts']
      }
    , img : {
      files:  ['res/final/**']
      , tasks: ['copy:img']
      } 
    }  
  });
  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln( target + ': ' + filepath + ' has ' + action);
  });
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');  
  grunt.registerTask('default', ['copy', 'sass']);

};