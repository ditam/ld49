
const WIDTH = 1366;
const HEIGHT = 768;

// dom elements
let wrapper;
let crosshairs;

// ui elements
let cockingSound;
let gunshotSound;
let bottleBreakSound;
let doorSound;
let footstepsSound;
let slideSound;
let pourSound;

// game state
let currentScene = 1;

function switchScene(newIndex) {
  console.assert([1,2,3].includes(newIndex));

  currentScene = newIndex;

  wrapper.removeClass('scene1 scene2 scene3');
  wrapper.addClass('scene' + currentScene);

  if (currentScene === 3) {
    crosshairs.show();
    setTimeout(() => {
      cockingSound.play();
    }, 500);
  } else {
    crosshairs.hide();
  }
}

function preloadImage(url) {
  const img = new Image();
  img.src = url;
  return img;
}

let mouseX = 0;
let mouseY = 0;
let diffX = 0;
let diffY = 0;
function applyDrunkEffects(time) {
  const cycleTime = 6000;
  const t = time / cycleTime;
  // TODO: this and cycleTime will increase with drunkenness
  const wobbleRadius = 30;
  diffX = Math.sin(t * Math.PI*2) * wobbleRadius;
  diffY = Math.sin(t * Math.PI*2) * Math.cos(t * Math.PI*2) * wobbleRadius;

  drawCrosshairs();

  requestAnimationFrame(applyDrunkEffects);
}

const crosshairSize = 64;
function drawCrosshairs() {
  crosshairs.css({
    left: Math.min(mouseX + diffX, WIDTH - crosshairSize/2),
    top: Math.min(mouseY + diffY, HEIGHT - crosshairSize/2)
  });
}


$(document).ready(function() {
  // image assets
  preloadImage('assets/img/scene1_bg.jpg');
  preloadImage('assets/img/scene2_bg.jpg');
  preloadImage('assets/img/scene3_bg.jpg');

  preloadImage('assets/img/crosshairs.png');

  // audio assets
  const songs = [
    new Audio('assets/sounds/Western.mp3')
  ];

  cockingSound = new Audio('assets/sounds/cocking.mp3');
  gunshotSound = new Audio('assets/sounds/gunshot.mp3');
  bottleBreakSound = new Audio('assets/sounds/bottle_break.mp3');
  doorSound = new Audio('assets/sounds/door.mp3');
  footstepsSound = new Audio('assets/sounds/footsteps.mp3');
  slideSound = new Audio('assets/sounds/slide.mp3');
  pourSound = new Audio('assets/sounds/pour.mp3');

  const sounds = [
    cockingSound,
    gunshotSound,
    bottleBreakSound,
    doorSound,
    footstepsSound,
    slideSound,
    pourSound
  ];

  let audioLoadCount = 0;
  $('.loadCountTotal').text(songs.length + sounds.length);
  function countWhenLoaded(audioElement) {
    audioElement.addEventListener('canplaythrough', function() {
      audioLoadCount++;
      $('.loadCount').text(audioLoadCount);
    }, false);
  }

  songs.forEach(countWhenLoaded);
  sounds.forEach(countWhenLoaded);

  // we add some extra songs to the list - these need not block initial loading
  songs.push(new Audio('assets/sounds/Un_desert.mp3'));

  // we set up autoplay so the songs loop
  songs.forEach(function(song, i) {
    song.addEventListener('ended', function() {
      this.currentTime = 0;
      playNextSong();
    }, false);
  });

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
      // TODO: shot calculation should use the same coords as the crosshair
      console.log('shot at:', event.clientX, event.clientY);
      gunshotSound.play();
    }

    const newScene = (currentScene === 3)? 1 : currentScene+1;
    console.log('newScene:', newScene);
    switchScene(newScene);
  });

  wrapper.on('mousemove', event => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  // start animation loop
  applyDrunkEffects();
});
