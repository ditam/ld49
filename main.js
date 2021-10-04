
const WIDTH = 1366;
const HEIGHT = 768;

let wrapper;
let crosshairs;
let currentScene = 1;

function switchScene(newIndex) {
  console.assert([1,2,3].includes(newIndex));

  currentScene = newIndex;

  wrapper.removeClass('scene1 scene2 scene3');
  wrapper.addClass('scene' + currentScene);

  if (currentScene === 3) {
    crosshairs.show();
  } else {
    crosshairs.hide();
  }
}

function preloadImage(url) {
  const img = new Image();
  img.src = url;
  return img;
}


$(document).ready(function() {
  console.log('Hello LD49!');

  // image assets
  preloadImage('assets/img/scene1_bg.jpg');
  preloadImage('assets/img/scene2_bg.jpg');
  preloadImage('assets/img/scene3_bg.jpg');

  preloadImage('assets/img/crosshairs.png');

  // audio assets
  const songs = [
    new Audio('assets/sounds/Western.mp3'),
    new Audio('assets/sounds/Un_desert.mp3')
  ];

  const sounds = [
    new Audio('assets/sounds/slide.mp3')
  ];

  let audioLoadCount = 0;
  $('.loadCountTotal').text(songs.length + sounds.length);
  function countWhenLoaded(audioElement) {
    audioElement.addEventListener('canplaythrough', function() {
      audioLoadCount++;
      $('.loadCount').text(audioLoadCount);
    }, false);
  }

  songs.forEach(function(song, i) {
    countWhenLoaded(song);
    song.addEventListener('ended', function() {
      this.currentTime = 0;
      playNextSong();
    }, false);
  });

  sounds.forEach(countWhenLoaded);

  let currentSongIndex = -1; // -1 so first call toggles to index 0
  function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % 2;
    songs[currentSongIndex].play();
  }

  // DOM elements
  wrapper = $('#main-wrapper');
  const cover = wrapper.find('.cover');

  wrapper.width(WIDTH);
  wrapper.height(HEIGHT);

  wrapper.addClass('scene1');

  crosshairs = $('#crosshairs');

  // event handlers
  cover.on('click', function(event) {
    // we need a user interaction to start audio
    console.log('removing cover');
    cover.remove();
    playNextSong();
    return false;
  });

  wrapper.on('click', event => {
    if (currentScene === 3) {
      console.log('shot at:', event.clientX, event.clientY);
    }

    const newScene = (currentScene === 3)? 1 : currentScene+1;
    console.log('newScene:', newScene);
    switchScene(newScene);
  });

  const crosshairSize = 64;
  wrapper.on('mousemove', event => {
    crosshairs.css({
      left: Math.min(event.clientX, WIDTH - crosshairSize),
      top: Math.min(event.clientY, HEIGHT - crosshairSize)
    });
  });
});
