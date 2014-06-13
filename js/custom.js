require.config({
    paths: {
        "BigVideo": "bower_components/BigVideo.js/lib/bigvideo",
        "jquery": "bower_components/jquery/dist/jquery.min",
        "jquery-ui": "bower_components/jquery-ui/ui/jquery-ui",
        "videojs": "bower_components/video.js/dist/video-js/video",
        "imagesloaded": "bower_components/imagesloaded/imagesloaded",
        "eventEmitter/EventEmitter": "bower_components/eventEmitter/EventEmitter",
        "eventie/eventie": "bower_components/eventie/eventie",
        "modernizr": "bower_components/modernizr/modernizr",
        "state-machine": "bower_components/javascript-state-machine/state-machine"
    },
    shim: {
        "videojs": {exports: 'videojs'}
    }
});

require(['state-machine'], function(StateMachine) {
  
});

require(['BigVideo', 'state-machine'], function(bigvideo, StateMachine) {
  
  var BV = new $.BigVideo({useFlashForFirefox:false});
  BV.init();

  BG = function() {

    var fsm = StateMachine.create({
      initial: 'nothing',

      events: [
        { name: 'clickben',   from: 'nothing',        to: 'ben'     },
        { name: 'clickmarco', from: 'nothing',        to: 'marco'   },
        { name: 'clickback',  from: ['marco', 'ben'], to: 'nothing' },
      ],

      callbacks: {
        onnothing:     function (event, from, to) {
          console.log('playback: starting the nothing loop.');
          BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{ambient:true});
        },
        onmarco:       function (event, from, to) {
          console.log('marco'); // For some reasons, it never gets printed to the console.
        },
        onben:         function (event, from, to) {
          console.log('ben'); // For some reasons, it never gets printed to the console.
        },

        onentermarco: function (event, from, to) {
          BV.show('./videos/fecine-elevator-nothing2marco.webmhd.webm',{ambient:false});

          console.log('playback: Waiting for video to end before playing marcoloop.');
          BV.getPlayer().one("ended", function(){
            console.log('playback: Playing marcoloop.');
            BV.show('./videos/fecine-elevator-marcoloop.webmhd.webm',{ambient:true});
          }); 
        },
        onenterben:   function (event, from, to) {
          BV.show('./videos/fecine-elevator-nothing2ben.webmhd.webm',{ambient:false});

          console.log('playback: Waiting for video to end before playing benloop.');
          BV.getPlayer().one("ended", function(){
            console.log('playback: Playing benloop.');
            BV.show('./videos/fecine-elevator-benloop.webmhd.webm',{ambient:true});
          });
        },
       
        onleavemarco:  function (event, from, to) {console.log('marco2nothing');
          BV.show('./videos/fecine-elevator-marco2nothing.webmhd.webm',{ambient:false});

          console.log('playback: Waiting for video to end before playing nothingloop.');
          BV.getPlayer().one("ended", function(){
            console.log('playback: Playing nothingloop.');
            BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{ambient:true});
          });
        },
        onleaveben:    function (event, from, to) {console.log('ben2nothing');
          BV.show('./videos/fecine-elevator-ben2nothing.webmhd.webm',{ambient:false});

          console.log('playback: Waiting for video to end before playing nothingloop.');
          BV.getPlayer().one("ended", function(){
            console.log('playback: Playing nothingloop.');
            BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{ambient:true});
          });
        },

        onchangestate: function(event, from, to) { console.log("CHANGED STATE: " + from + " to " + to);}
      }
    });

    return fsm;

  }();

  $(function() {

      // BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{altSource:'./videos/fecine-elevator-nothingloop.mp4',ambient:true});

      // Fades in the video once it is ready. hides the flickering in the beginning.
      $('#big-video-wrap').hide().ready(function () { $('#big-video-wrap').fadeIn(1200) });

      $( document ).ready(function() {

        $('.bv-ctrl').on('click', function(e) {

          e.preventDefault();

          switch (this.id) {

            case 'btn-fr':

              // Fades out the logo with the french navbar sliding from top.
              $('#splash').fadeOut(1000, function () {
                $('#navbar-fr').show().animate({top: 0}, 800);
              });
              break;

            case 'btn-en':

              // Fades out the logo with the english navbar sliding from top.
              $('#splash').fadeOut(1000, function () {
                $('#navbar-en').show().animate({top: 0}, 800);
              });
              break;

            case 'nav-team':

              // Goes back to the initial loop, and display the team page.
              if (!$('#team-page').is(":visible")) {
                $('.page').fadeOut(600);
                $('#team-page').hide().fadeIn(600);
              };
              break;

            case 'nav-about':

              // Goes back to the initial loop, and display the contact form.
              $('.page').fadeOut(600, function () {
                BV.getPlayer().one("ended", function(){
                  console.log('waiting for video to end before playing fecine-forestloop.');
                  BV.show('./videos/fecine-forestloop.webmhd.webm',{ambient:true});
                });
              });
              break;

            case 'btn-benjamin':
              BG.clickben();
              break;

            case 'btn-marc-antoine':
              BG.clickmarco();
              break;

            case 'btn-team-back':
              BG.clickback();
              break;

            default:
              console.log('no action set for ' + this.id);
              $('.page').fadeOut(600);
          };
        });

      });
  });
});

function do_nothing(){

}