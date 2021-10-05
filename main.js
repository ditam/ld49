
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
let shapeFront;
let shapeSide;
let crosshairs;
let glass;
let liquid;
let bottles;

// ui elements
let songs;
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
let daysSpent = 0;
let didShoot = false;
let drinkCounter = 0;
let attemptsCount = 0;

function playIntro() {
  // Intro starts when cover is removed and music is started
  let scr1, scr2, scr3, scr4;
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
    scr3.empty();
    songs[0].volume = 0.85;
  }, 25000);
  setTimeout(() => {
    songs[0].volume = 0.7;
    scr4 = $('<div></div>').addClass('quote-screen');
    const quote = `
      <div>From a pot of wine</div>
      <div>among the flowers</div>
      <div>I drank alone.</div>
      <div class="author">/ Li Bai /</div>
    `;
    $('<div></div>').addClass('quote').html(quote).appendTo(scr4);
    scr4.appendTo(wrapper);
    scr3.remove();
  }, 28000);
  setTimeout(() => {
    footstepsSound.play();
  }, 29000);
  setTimeout(() => {
    scr4.remove();
  }, 33000);

  // TODO: use startNewScene?
  setTimeout(startConversation, 35000);
}

function startConversation() {
  let msg, options;
  if (daysSpent === 0) {
    msg = 'Hello, Colton. How was your day?';
    options = [
      { text: 'Hey!', response: 'Let me guess, a drink?', isTerminal: true },
      { text: 'Can\'t complain.', response: 'How about a drink?', isTerminal: true },
      { text: 'My day starts when I see you, Luna.', response: 'Oh, you charmer. A drink\'s 5 cents for everyone.', isTerminal: true }
    ];
  } else {
    msg = getRandomItem(['Howdy, cowboy.', 'Colton.', 'Good day.']);
    options = [
      { text: 'How you doin?', response: (drinkCounter < 5? 'Good, how are you?' : 'How are you, Colton? Looking rough.'), isTerminal: true },
      { text: 'Always a pleasure.', response: 'I don\'t doubt that.', isTerminal: true }
    ];
  }

  showBarmanMessage(msg);
  setTimeout(() => {
    showOptions(options);
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
        'It\'ll make the dumb talk.'
      ]);
      showBarmanMessage(description);
    }, 2000);
    setTimeout(()=> {
      showOptions([{ text: 'Hit me.', effect: getDrink }]);
    }, 2500);
  }

  const drinkName = getRandomItem(['Mule Skinner', 'Whiskey', 'Rotgut', 'Moonshine', 'Sheepdip']);
  showBarmanMessage(drinkName);
  const options = [
    { text: 'What\'s it like?', effect: randomDesc },
    { text: 'I\'ll take it.', effect: getDrink }
  ];
  if (drinkCounter > 3) {
    if (attemptsCount === 0) {
      options.push(
        { text: 'Can I get... something weaker?', effect: attempt1 }
      );
    } else if (attemptsCount === 1) {
      options.push(
        { text: 'I want to stop, but this guy keeps pushing me.', effect: attempt2 }
      );
    } else {
      options.push(
        { text: 'Please help me. I shouldn\'t drink more.', effect: attempt3 }
      );
    }
  }
  setTimeout(() => {
    showOptions(options);
  }, 2000);
}

function attempt1() {
  doorSound.play();
  attemptsCount++;
  showVillainMessage('Weaker!? Boone, don\'t embarass me!');
  setTimeout(() => {
    showOptions([
      { text: 'Right... I\'ll just take a whiskey.', effect: getDrink }
    ]);
  }, 3000);
}

function attempt2() {
  attemptsCount++;
  showBarmanMessage('What guy?');
  setTimeout(getDrink, 3000);
}

function attempt3() {
  attemptsCount++;
  showBarmanMessage('I\'m glad you agree, Colton. Have some water.');
  liquid.css({
    'background-color': 'rgba(200, 200, 200, 0.1)',
    'border': 'none'
  });
  setTimeout(getDrink, 3000);
}

function getDrink() {
  setTimeout(passDrink, 1500);
  setTimeout(() => {
    showOptions([
      { text: '[Take drink]', effect: scene2Ending }
    ]);
  }, 6000);
}

function scene2Ending() {
  if (attemptsCount === 3) {
    // victory, show game ending instead of scene 3
    glass.remove();
    $('.msg').remove();
    const scr = $('<div></div>').addClass('quote-screen');
    quote = `
      <div>Till Seraphs swing their snowy Hats – </div>
      <div>And Saints – to windows run – </div>
      <div>To see the little Tippler</div>
      <div>Leaning against the – Sun!</div>
      <div class="author">/ Emily Dickinson /</div>
    `;
    $('<div></div>').addClass('quote').html(quote).appendTo(scr);
    scr.appendTo(wrapper);

    setTimeout(() => {
      const newCover = $('<div></div>').addClass('cover');
      const victoryMsg = $('<div></div>').text('Congratulations! Thank you for playing.');
      scr.remove();
      victoryMsg.appendTo(newCover);
      newCover.appendTo(wrapper);
    }, 15000);
    return;
  }
  drinkCounter++;
  // TODO: it would be nice to have an animation here too
  glass.hide();
  liquid.css({
    opacity: 0
  });
  setTimeout(() => {
    $('.msg.player').remove();
    doorSound.play();
    if (drinkCounter < 2) {
      showVillainMessage('Boone!');
    } else if (drinkCounter < 4) {
      showVillainMessage('Boone you rascal!');
    } else if (drinkCounter < 6) {
      showVillainMessage('Booooooooooney boy!');
    } else {
      showVillainMessage('BOONE! My man. I hate you.');
    }
  }, 2000);
  setTimeout(() => {
    switchScene(1);
    shapeFront.fadeTo(3000, 0.8);
  }, 4000);
  setTimeout(() => {
    let msg, options;
    if (daysSpent === 0) {
      msg = 'Hiding from me? We have unfinished business.';
      options = [
        { text: 'I\'m waiting for you.', villainResponse: 'Out back, then.', isTerminal: true, targetScene: 3 },
        { text: 'I just wanted to have a drink first.', villainResponse: 'Helps with your aim?', isTerminal: true, targetScene: 3 },
        { text: 'What do you mean?', villainResponse: 'Show me if you can shoot yet.', isTerminal: true, targetScene: 3 }
      ];
    } else if (drinkCounter < 5) {
      msg = 'I knew I\'d find you here.';
      options = [
        { text: 'Have you been practicing?', villainResponse: 'I\'ll show you.', isTerminal: true, targetScene: 3 },
        { text: 'You\'re a true detective.', villainResponse: 'And a sharpshooter.', isTerminal: true, targetScene: 3 },
        { text: 'Let\'s get it over with.', villainResponse: 'After you.', isTerminal: true, targetScene: 3 }
      ];
    } else {
      msg = 'Let\'s do it again.';
      options = [
        { text: 'Do what?', villainResponse: 'Ha ha.', isTerminal: true, targetScene: 3 },
        { text: 'Leave me alone.', villainResponse: 'You wish.', isTerminal: true, targetScene: 3 },
        { text: 'I\'ve had enough.', villainResponse: 'Shouldn\'t have called me, then.', isTerminal: true, targetScene: 3 }
      ];
    }
    showVillainMessage(msg);
    setTimeout(() => {
      showOptions(options);
    }, 2000);
  }, 7000);
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
  $('.msg.villain').css({right: -WIDTH});
  if (msg.response) {
    setTimeout(() => {
      $('.msg.barman').remove();
      showBarmanMessage(msg.response);
    }, 500);
  }
  if (msg.villainResponse) {
    setTimeout(() => {
      $('.msg.villain').remove();
      showVillainMessage(msg.villainResponse);
    }, 500);
  }
  if (msg.effect) {
    console.assert(typeof msg.effect === 'function');
    setTimeout(msg.effect, 2000);
  }
  if (msg.isTerminal) {
    footstepsSound.play();
    if (msg.targetScene) {
      // silently set the internal scene state to jump to any scene without showing the previous background
      currentScene = msg.targetScene - 1;
    }
    setTimeout(startNewScene, 5000); // should be always more than the effect delay, so effect can happen first
  }
}

function startNewScene() {
  $('.quote-screen').remove();
  $('.msg').remove();
  const newScene = (currentScene === 3)? 1 : currentScene+1;
  switchScene(newScene);

  if (newScene === 1) {
    startConversation();
  }

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
  console.assert(currentScene === 3);
  setTimeout(() => {
    cockingSound.play();
  }, 500);
}

function switchScene(newIndex) {
  console.assert([1,2,3].includes(newIndex));

  currentScene = newIndex;

  wrapper.removeClass('scene1 scene2 scene3');
  wrapper.addClass('scene' + currentScene);

  shapeFront.hide();
  shapeSide.hide();

  if (currentScene === 3) {
    didShoot = false;
    crosshairs.show();
    bottles.show();
    shapeSide.fadeTo(4000, 0.8);
    cockGun();
  } else {
    crosshairs.hide();
    bottles.hide();
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
  const cycleTime = Math.max(2000, 5000 - drinkCounter * 200);
  const t = time / cycleTime;
  const wobbleRadius = (drinkCounter === 1)? 10 : Math.min(drinkCounter * 80, 500);
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
function getCrosshairPosition() {
  return {
    x: Math.min(mouseX + diffX, WIDTH - crosshairSize/2),
    y: Math.min(mouseY + diffY, HEIGHT - crosshairSize/2)
  };
}

function drawCrosshairs() {
  if (currentScene === 3) {
    const pos = getCrosshairPosition();
    crosshairs.css({
      left: pos.x,
      top: pos.y
    });
  }
}


$(document).ready(function() {
  // image assets
  preloadImage('assets/img/scene1_bg.jpg');
  preloadImage('assets/img/scene2_bg.jpg');
  preloadImage('assets/img/scene3_bg.jpg');

  preloadImage('assets/img/villain_front.png');
  preloadImage('assets/img/crosshairs.png');

  // audio assets
  songs = [
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

  shapeFront = $('.shape-front');
  shapeSide = $('.shape-side');
  crosshairs = $('#crosshairs');
  glass = $('.glass');
  liquid = $('.glass .liquid');
  bottles = $('.bottle');

  // event handlers
  cover.on('click', function(event) {
    // we need a user interaction to start audio
    cover.remove();
    playNextSong();

    const DEBUG = false;
    if (!DEBUG) {
      playIntro();
    } else {
      startConversation();
    }

    return false;
  });

  function isHit(pos, hitbox) {
    return (
      pos.x > hitbox.x0 && pos.x < hitbox.x1 &&
      pos.y > hitbox.y0 && pos.y < hitbox.y1
    );
  }

  wrapper.on('click', event => {
    if (currentScene === 3) {
      if (didShoot) {
        // disallow further shooting - quote screen is already showing
        return;
      }
      didShoot = true;
      const pos = getCrosshairPosition();
      gunshotSound.play();

      shapeSide.hide();
      crosshairs.hide();
      bottles.hide();

      daysSpent++;
      setTimeout(startNewScene, 12000);

      let scr, quote;
      if (pos.x < 200) {
        scr = $('<div></div>').addClass('quote-screen');
        quote = `
          <div>I went to the worst of bars</div>
          <div>hoping to get</div>
          <div>killed.</div>
          <div>but all I could do was to</div>
          <div>get drunk</div>
          <div>again.</div>
          <div class="author">/ Charles Bukowski /</div>
        `;
        $('<div></div>').addClass('quote').html(quote).appendTo(scr);
        scr.appendTo(wrapper);
      } else if (
        isHit(pos, {x0: 500, x1: 600, y0: 202, y1: 462}) ||
        isHit(pos, {x0: 800, x1: 900, y0: 203, y1: 483}) ||
        isHit(pos, {x0: 1120, x1: 1220, y0: 204, y1: 504})
      ) {
        setTimeout(() => {
          bottleBreakSound.play();
        }, 300);

        scr = $('<div></div>').addClass('quote-screen small');
        quote = `
          <div>From a pot of wine among the flowers</div>
          <div>I drank alone. There was no one with me —</div>
          <div>Till, raising my cup, I asked the bright moon</div>
          <div>To bring me my shadow and make us three.</div>
          <div class="author">/ Li Bai /</div>
        `;
        $('<div></div>').addClass('quote').html(quote).appendTo(scr);
        scr.appendTo(wrapper);
      } else {
        scr = $('<div></div>').addClass('quote-screen small');
        quote = `
          <div>O for a beaker full of the warm South,</div>
          <div>Full of the true, the blushful Hippocrene,</div>
          <div>With beaded bubbles winking at the brim,</div>
          <div>And purple-stained mouth;</div>
          <div>That I might drink, and leave the world unseen,</div>
          <div>And with thee fade away into the forest dim</div>
          <div class="author">/ John Keats /</div>
        `;
        $('<div></div>').addClass('quote').html(quote).appendTo(scr);
        scr.appendTo(wrapper);
      }
    }

    return;
    // DEBUG
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
