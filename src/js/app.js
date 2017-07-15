import 'css/app.css';
import 'css/about.css';
import 'css/controls.css';
import 'css/gifs.css';

import { TRACK, CLIENT_ID, PAGE_DIMENSIONS, LINE_COLORS, ALL_GIFS } from 'config';

let GIFS = [];
let audio;
let ctx;
let analyser;
let source;
let audioGain;
let bufferLength;
let dataArray;
const frequencyLimit = 128.5;
const gifContainer = document.getElementsByClassName('floor')[0];
const canvas = document.getElementById('about-waveform');
const gifsLength = ALL_GIFS.length;

//
// UPDATE THE DOM GIF ID
// =====================
//
const switchGif = (gif) => {
  gifContainer.id = `gif-${gif}`;
};

//
// SWITCHES THE GIF SET
// ====================
//
const SelectRandomGifs = () => {
  // Always empty the array
  GIFS = [];
  // Push two random gifs to the stage
  GIFS.push(ALL_GIFS[Math.floor(Math.random() * gifsLength)]);
  GIFS.push(ALL_GIFS[Math.floor(Math.random() * gifsLength)]);

  // Recycle every 10 seconds
  setTimeout(SelectRandomGifs, 10000);
};

//
// SOME GENERIC WRAPPER FUNCTIONS
// ==============================
//
const audioPlay = () => {
  audio.play();
};

const audioPause = () => {
  audio.pause();
};

//
// SETUP THE AUDIO + AUDIOCONTEXT OBJECTS
// ======================================
//
const ConfigAudio = () => {
  audio = new Audio();
  audio.src = `http://api.soundcloud.com/tracks/${TRACK}/stream?client_id=${CLIENT_ID}`;
  audio.controls = false;
  audio.autoplay = true;
  audio.crossOrigin = 'anonymous';
  document.body.appendChild(audio);

  ctx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = ctx.createAnalyser();
  source = ctx.createMediaElementSource(audio);
  audioGain = ctx.createGain();
  analyser.smoothingTimeConstant = 0.6;
  source.connect(ctx.destination);
  source.connect(analyser);
  source.connect(audioGain);
  analyser.fftSize = 2048;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);
};

//
// THE GIF VISUALS
// ===============
//
const StartVisuals = () => {
  let totalFrequency = 0;
  analyser.getByteTimeDomainData(dataArray);
  requestAnimationFrame(StartVisuals);

  for (let i = 0; i < bufferLength; i += 1) {
    totalFrequency += dataArray[i];
  }

  const averageFrequency = totalFrequency / analyser.frequencyBinCount;

  if (averageFrequency > frequencyLimit) {
    switchGif(GIFS[1]);
  } else {
    switchGif(GIFS[0]);
  }
};

//
// DRAWS THE BACKGROUND WAVE
// =========================
//
const DrawAudioWave = () => {
  // Bind to the context
  const canvasCtx = canvas.getContext('2d');

  function drawCanvas() {
    // We always start the drawing function by clearing the canvas. Otherwise
    // we will be drawing over the previous frames, which gets messy real quick
    canvasCtx.clearRect(0, 0, PAGE_DIMENSIONS.width, PAGE_DIMENSIONS.height);
    requestAnimationFrame(drawCanvas);
    const sliceWidth = PAGE_DIMENSIONS.width * 1.0 / bufferLength;
    // Create a new bounding rectangle to act as our backdrop, and set the
    // fill color to black.
    canvasCtx.fillStyle = '#000';
    canvasCtx.fillRect(0, 0, PAGE_DIMENSIONS.width, PAGE_DIMENSIONS.height);

    // Loop over our line colors. This allows us to draw two lines with
    // different colors.
    LINE_COLORS.forEach((color, index) => {
      let x = 0;
      // Some basic line width/color config
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = color;

      // Start drawing the path
      canvasCtx.beginPath();
      for (let i = 0; i < bufferLength; i++) {
        // We offset using the loops index (stops both colored lines
        // from overlapping one another)
        const v = dataArray[i] / 120 + index / 20;
        // Set the Y point to be half of the screen size (the middle)
        const y = v * PAGE_DIMENSIONS.height / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }
      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    });
  }
  drawCanvas();
};

//
// THE MAIN STARTER FUNCTION
// =========================
//
const init = () => {
  canvas.width = PAGE_DIMENSIONS.width;
  canvas.height = PAGE_DIMENSIONS.height;

  SelectRandomGifs();
  ConfigAudio();
  StartVisuals();
  DrawAudioWave();
};

//
// SOME MISC UI FUNCTIONS
// ======================
//
const toggleAbout = () => {
  const aboutContainer = document.getElementsByClassName('about')[0];
  if (aboutContainer.classList.contains('is-visible')) {
    DrawAudioWave();
  }

  return aboutContainer.classList.toggle('is-visible');
};

const controlToggleAbout = document.getElementsByClassName('control-toggle-about');
const controlAudio = document.getElementById('control-audio');

for (let i = 0, l = controlToggleAbout.length; i < l; i++) {
  controlToggleAbout[i].addEventListener('click', () => toggleAbout(), false);
}

controlAudio.addEventListener(
  'click',
  (ev) => {
    if (ev.currentTarget.getAttribute('data-playing') === 'true') {
      ev.currentTarget.setAttribute('data-playing', 'false');
      audioPause();
    } else {
      ev.currentTarget.setAttribute('data-playing', 'true');
      audioPlay();
    }
  },
  false,
);

//
// GO GO GO
// ========
//
init();
