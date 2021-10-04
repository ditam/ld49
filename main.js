
const WIDTH = 1366;
const HEIGHT = 768;

const SLIDE_DURATION = 1050; // length of slide audio in ms
const FILL_DURATION = 1700; // length of pour audio in ms

const GLASS_POSITION = {
  x0: 500,
  y0: -500,
  x: 700,
  y: 200
};

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// dom elements
let wrapper;
let crosshairs;
let glass;
let liquid;

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
let glassSliding = false;
let glassFilling = false;
let slideStart = 0;
let fillStart = 0;

function playIntro() {
  // Intro starts when cover is removed and music is started
  let scr1, scr2, scr3;
  setTimeout(() => {
    footstepsSound.play();
  }, 5000);
  setTimeout(() => {
    scr1 = $('<div></div>').addClass('intro-screen');
    $('<div></div>').addClass('label').text('ditam presents').appendTo(scr1);
    scr1.appendTo(wrapper);
  }, 7000);
  setTimeout(() => {
    doorSound.play();
  }, 10000);
  setTimeout(() => {
    footstepsSound.play();
    scr1.empty();
  }, 11000);
  setTimeout(() => {
    cockingSound.play();
  }, 12000);
  setTimeout(() => {
    scr2 = $('<div></div>').addClass('intro-screen');
    $('<div></div>').addClass('title').text('Pale Moon Shone').appendTo(scr2);
    scr2.appendTo(wrapper);
    scr1.remove();
    gunshotSound.play();
  }, 13000);
  setTimeout(() => {
    $('<div></div>').addClass('title-connector').text('- or -').appendTo(scr2);
  }, 16000);
  setTimeout(() => {
    $('<div></div>').addClass('title-secondary').text('The Ballad of Colton Boone').appendTo(scr2);
    slideSound.play();
  }, 17000);
  setTimeout(() => {
    scr2.empty();
  }, 21000);
  setTimeout(() => {
    scr3 = $('<div></div>').addClass('intro-screen');
    $('<div></div>').addClass('label').text('A game made for Ludum Dare 49').appendTo(scr3);
    scr3.appendTo(wrapper);
    scr2.remove();
    pourSound.play();
  }, 22000);
  setTimeout(() => {
    footstepsSound.play();
  }, 23000);
  setTimeout(() => {
    scr3.remove();
  }, 27000);
  // TODO: add Li Bai quote?
  // TODO: lower music volume?

  setTimeout(startConversation, 29000);
}

function startConversation() {
  showBarmanMessage('Hello, Colton. How was your day?');
  setTimeout(() => {
    showOptions([
      { text: 'Hey!', response: 'Let me guess, a drink?', isTerminal: true },
      { text: 'Not too bad, thanks.', response: 'How about a drink?', isTerminal: true },
      { text: 'My day starts when I see you, Luna.', response: 'Oh, you charmer. A drink\'s 5 cents for everyone.', isTerminal: true }
    ]);
  }, 2000);
}

function startScene2() {
  setTimeout(() => {
    showBarmanMessage('What will it be?');
  }, 1000);
  setTimeout(() => {
    showOptions([
      { text: 'What do you have?', effect: startWhatDrinkConvo },
      { text: 'Whiskey', effect: getDrink }
    ]);
  }, 3000);
}

function startWhatDrinkConvo() {
  function randomDesc() {
    setTimeout(() => {
      const description = getRandomItem([
        'It\'s hotter than mustard.',
        'It\'s milder than cream.',
        'It\'s clearer than crystal.',
        'It\'s sweeter than honey.',
        'It\'s stronger than steam.',
        'It\'ll make the lame walk.',
        'It\'ll make the dumb talk'
      ]);
      showBarmanMessage(description);
    }, 2000);
    showOptions([{ text: 'Hit me.', effect: getDrink }]);
  }

  const drinkName = getRandomItem(['Mule Skinner', 'Whiskey', 'Rotgut', 'Moonshine', 'Sheepdip']);
  showBarmanMessage(drinkName);
  setTimeout(() => {
    showOptions([
      { text: 'What\'s it like?', effect: randomDesc },
      { text: 'I\'ll take it.', effect: getDrink }
    ]);
  }, 2000);
}

function getDrink() {
  setTimeout(passDrink, 1500);
  setTimeout(() => {
    showOptions([
      { text: '[Take drink]', effect: scene2Ending }
    ]);
  }, 5000);
}

function scene2Ending() {
  // TODO: it would be nice to have an animation here too
  glass.hide();
  setTimeout(() => {
    doorSound.play();
    showVillainMessage('Boone!');
  }, 2000);
  // TODO: switch to scene 1, show silhouette without footsteps
}

// Messaging utils

function showOptions(options) {
  options.forEach((option, i) => {
    const positionClass = ['first', 'second', 'third'][i];
    const msg = $('<div></div>').addClass('msg option').addClass(positionClass).text(option.text).appendTo(wrapper);
    msg.data('meta', option);
    msg.on('click', function() {
      // TODO: not every option leads to a message
      const meta = $(this).data('meta');
      showPlayerMessage(meta);
      $('.msg.option').remove();
    });
  });
}

function showBarmanMessage(msgString) {
  console.assert(typeof msgString === 'string');
  $('.msg.barman').remove();
  $('<div></div>').addClass('msg barman').text(msgString).appendTo(wrapper);
}

function showVillainMessage(msgString) {
  console.assert(typeof msgString === 'string');
  $('.msg.villain').remove();
  $('<div></div>').addClass('msg villain').text(msgString).appendTo(wrapper);
}

function showPlayerMessage(msg) {
  const text = msg.text;
  console.assert(typeof text === 'string');
  $('.msg.player').remove();
  $('<div></div>').addClass('msg player').text(text).appendTo(wrapper);
  $('.msg.barman').css({left: -WIDTH});
  if (msg.response) {
    setTimeout(() => {
      $('.msg.barman').remove();
      showBarmanMessage(msg.response);
    }, 500);
  }
  if (msg.effect) {
    console.assert(typeof msg.effect === 'function');
    setTimeout(msg.effect, 2000);
  }
  if (msg.isTerminal) {
    footstepsSound.play();
    setTimeout(startNewScene, 5000);
  }
}

function startNewScene() {
  $('.msg').remove();
  const newScene = (currentScene === 3)? 1 : currentScene+1;
  switchScene(newScene);

  // TODO: move startConversation here as branch 1
  if (newScene === 2) {
    startScene2();
  } else {
    glass.hide();
    glass.css({
      left: GLASS_POSITION.x0,
      top: GLASS_POSITION.y0
    });
  }
}

function passDrink() {
  console.assert(currentScene === 2);
  glass.show();
  setTimeout(() => {
    slideSound.play();
    glassSliding = true;
    slideStart = lastDrawTime;
  }, 500);
  setTimeout(() => {
    pourSound.play();
    glassFilling = true;
    fillStart = lastDrawTime;
  }, 3000);
}

function cockGun() {
  setTimeout(() => {
    cockingSound.play();
  }, 500);
}

function switchScene(newIndex) {
  console.assert([1,2,3].includes(newIndex));

  currentScene = newIndex;

  wrapper.removeClass('scene1 scene2 scene3');
  wrapper.addClass('scene' + currentScene);

  if (currentScene === 3) {
    crosshairs.show();
    cockGun();
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
let lastDrawTime;
function animationStep(time) {
  lastDrawTime = time;
  const cycleTime = 6000;
  const t = time / cycleTime;
  // TODO: this and cycleTime will increase with drunkenness
  const wobbleRadius = 30;
  diffX = Math.sin(t * Math.PI*2) * wobbleRadius;
  diffY = Math.sin(t * Math.PI*2) * Math.cos(t * Math.PI*2) * wobbleRadius;

  drawCrosshairs();

  if (glassSliding) {
    const slideTimePassed = time - slideStart;
    const slideProgress = Math.min(1, slideTimePassed / SLIDE_DURATION);

    const x0 = GLASS_POSITION.x0;
    const y0 = GLASS_POSITION.y0;
    const xFinal = GLASS_POSITION.x;
    const yFinal = GLASS_POSITION.y;

    glass.css({
      left: x0 + (xFinal - x0) * slideProgress,
      top: y0 + (yFinal - y0) * slideProgress
    });

    if (slideProgress === 1) {
      glassSliding = false;
    }
  }

  if (glassFilling) {
    const fillTimePassed = time - fillStart;
    const fillProgress = Math.min(1, fillTimePassed / FILL_DURATION);

    liquid.css({
      opacity: fillProgress
    });

    if (fillProgress === 1) {
      glassFilling = false;
    }
  }

  requestAnimationFrame(animationStep);
}

const crosshairSize = 64;
function drawCrosshairs() {
  if (currentScene === 3) {
    crosshairs.css({
      left: Math.min(mouseX + diffX, WIDTH - crosshairSize/2),
      top: Math.min(mouseY + diffY, HEIGHT - crosshairSize/2)
    });
  }
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
  glass = $('.glass');
  liquid = $('.glass .liquid');

  // event handlers
  cover.on('click', function(event) {
    // we need a user interaction to start audio
    console.log('removing cover');
    cover.remove();
    playNextSong();

    // FIXME: re-add for final build and remove startConvo here
    //playIntro();

    startConversation();

    return false;
  });

  wrapper.on('click', event => {
    return;
    // DEBUG
    if (currentScene === 3) {
      // TODO: shot calculation should use the same coords as the crosshair
      console.log('shot at:', event.clientX, event.clientY);
      gunshotSound.play();
      // FIXME: based on shot location
      if (Math.random() < 0.5) {
        setTimeout(() => {
          bottleBreakSound.play();
        }, 300);
      }
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
  animationStep();
});
