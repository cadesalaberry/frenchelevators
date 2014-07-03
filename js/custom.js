require.config({
    paths: {
        "BigVideo": "bower_components/BigVideo.js/lib/bigvideo",
        "jquery": "bower_components/jquery/dist/jquery.min",
        "jquery-ui": "bower_components/jquery-ui/jquery-ui.min",
        "videojs": "bower_components/video.js/dist/video-js/video",
        "imagesloaded": "bower_components/imagesloaded/imagesloaded",
        "eventEmitter/EventEmitter": "bower_components/eventEmitter/EventEmitter",
        "eventie/eventie": "bower_components/eventie/eventie",
        "modernizr": "bower_components/modernizr/modernizr",
        "state-machine": "bower_components/javascript-state-machine/state-machine",
        "fitvids": "bower_components/fitvids/jquery.fitvids"
    },
    shim: {
        "videojs": {exports: 'videojs'}
    }
});

require(['jquery', 'jquery-ui', 'fitvids'], function(FitVids) {
  $(".fluid-width-video-wrapper").fitVids();

});

require(['BigVideo', 'state-machine', 'modernizr'], function(bigvideo, StateMachine, modernizr) {
  
  BV = new $.BigVideo({useFlashForFirefox:false});
  BV.init();
  // BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{ambient:true});
  // BV.getPlayer().on("ended", function () {console.log('playback: video ended')});
  BV.getPlayer().on("ready", function () {console.log('playback: video is playing !')});

  BG = function() {

    handle_hiding = function () {

      $('.hideable').each(function( i ) {
        
        // Hides the element if it does not belong to the state
        if ( !$(this).hasClass(fsm.current) ) {
          $(this).fadeOut(300).addClass('hidden').hide();
        }
      });
    }

    handle_showing = function () {

      // Shows the element if it belongs to the state
      $('.hideable').each(function( i ) {
        
        if ( $(this).hasClass(fsm.current) ) {
          $(this).hide().removeClass('hidden').fadeIn(800);
        } else {
          // console.log($(this).attr('id') + ' does not belong to ' + fsm.current);
        }
      });
    }

    toggle_navbar = function (lang) {

      // Sets the document language.
      document.documentElement.lang = lang;
      
      // Fades out the logo with the french navbar sliding from top.
      $('#splash').fadeOut(600, function () {
        $('#navbar-' + lang ).show().animate({top: 0}, 800);
      });
    }

    toggle_video = function () {
      
      // Fades in the video once it is ready. hides the flickering in the beginning.
      $('#big-video-wrap').hide().ready(function () { $('#big-video-wrap').fadeIn(1200) });
    }

    pause = function () {
      BV.getPlayer().pause();
    }

    show = function (name, callback) {

      if (Modernizr.touch) {
        // If it is a touch device, just shows a picture, does not play the video
        BV.show('./videos/' + name + '.mp4.jpg');
      } else {
      // BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{altSource:'./videos/fecine-elevator-nothingloop.mp4',ambient:true});
        BV.show('./videos/' + name + '.webmhd.webm', {altSource:'./videos/' + name + '.mp4', ambient:true});
      }

      if (callback instanceof Function) {
        BV.getPlayer().one("play", callback);
      }
    }

    play = function (name, callback) {

      if (!name) {
        BV.getPlayer().play();
        return;
      }

      show(name, callback);
    }

    queue = function (name, callback) {

      BV.getPlayer().one("ended", function () {show(name, callback);});
    }


    var fsm = StateMachine.create({

      events: [

        { name: 'clickprod',    from: ['*'],            to: 'prod'    },
        { name: 'clickteam',    from: ['*'],            to: 'team'    },
        { name: 'clickabout',   from: ['*'],            to: 'about'   },
        { name: 'clickcontact', from: ['*'],            to: 'contact' },
        { name: 'clicklangfr',  from: ['none'],         to: 'about'   },
        { name: 'clicklangen',  from: ['none'],         to: 'about'   },
        { name: 'clickben',     from: ['team'],         to: 'ben'     },
        { name: 'clickmarco',   from: ['team'],         to: 'marco'   },
        { name: 'clickback',    from: ['marco', 'ben'], to: 'team'    },

      ],

      callbacks: {
        onclicklangfr: function (event, from, to) {
          toggle_navbar("fr");
          toggle_video();
        },
        onclicklangen: function (event, from, to) {
          toggle_navbar("en");
          toggle_video();
        },


        onenterabout: function (event, from, to) {
          play('fecine-forestloop', handle_showing);
        },
        onleaveabout:      function (event, from, to) {
        },


        onenterprod:      function (event, from, to) {
          play('fe-oldfilmblack', handle_showing);
        },
        onleaveprod:      function (event, from, to) {
        },


        onentercontact:      function (event, from, to) {
          $('#video-mask').hide().removeClass('hidden').fadeIn(600);
          pause();
          handle_showing();
        },
        onleavecontact:      function (event, from, to) {
          $('#video-mask').fadeOut(600).hide().addClass('hidden');
          play();
        },


        onenterteam: function (event, from, to) {
          if (from != 'ben' && from != 'marco' ) {
          
            play('fecine-elevator-nothingloop', handle_showing);
            
          } else {
          
            queue('fecine-elevator-nothingloop', handle_showing);
          }
        },
        onleaveteam:      function (event, from, to) {
        },


        /* Handles MARCO related events */
        onentermarco: function (event, from, to) {
          play('fecine-elevator-nothing2marco');
          queue('fecine-elevator-marcoloop', handle_showing);
        },
        onleavemarco:  function (event, from, to) {
          play('fecine-elevator-marco2nothing');
        },


        /* Handles BEN related events */
        onenterben:   function (event, from, to) {
          play('fecine-elevator-nothing2ben');
          queue('fecine-elevator-benloop', handle_showing);
        },
        onleaveben:    function (event, from, to) {
          console.log('playback: leaving ben.');
          play('fecine-elevator-ben2nothing');
        },


        onchangestate: function(event, from, to) {
          console.log("CHANGED STATE: " + from + " to " + to);
          
            handle_hiding();
        }
      }
    });

    return fsm;

  }();
});