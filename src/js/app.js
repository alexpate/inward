import 'css/app.css';
import 'css/about.css';
import 'css/controls.css';

import {TRACK, CLIENT_ID, PAGE_DIMENSIONS, LINE_COLORS, ALL_GIFS} from 'config';

let GIFS = [];
let audio;
let ctx;
let analyser;
let source;
let audioGain;
let bufferLength;
let dataArray;
const frequencyLimit = 128.6;
const gifContainer = document.getElementsByClassName('floor')[0];
const canvas = document.getElementById('about-waveform');
const gifsLength = ALL_GIFS.length;

//
// UPDATE THE DOM GIF ID
// =====================
//
const switchGif = gif => {
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
  GIFS.push(ALL_GIFS[Math.floor(Math.random() * gifsLength)].name);
  GIFS.push(ALL_GIFS[Math.floor(Math.random() * gifsLength)].name);

  // Recycle every 10 seconds
  setTimeout(SelectRandomGifs, 10000);
};

//
// Preloads a single image
// =======================
//
const PreloadImage = gif => {
  new Promise(resolve => {
    const _img = new Image();
    _img.onload = () => resolve({gif, status: 'ok'});
    _img.onerror = () => resolve({gif, status: 'error'});
    console.log('Preloading =>', gif.path);

    _img.src = gif.path;
  });
};

//
// Generates the CSS ID's
// =======================
//
const GenerateImageCSS = gifs => {
  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  style.type = 'text/css';
  let css = '';

  const generateCss = gif => {
    return `#gif-${gif.name} {
      background-image: url('${gif.path}')}
    `;
  };

  for (let i = 0; i < gifs.length; i += 1) {
    css += generateCss(gifs[i]);
  }

  console.log(css);

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);
};

//
// REMOVES LOADING STATE FROM UI
// ==============================
//
const RemoveLoadingState = () => {
  const loadingButton = document.getElementsByClassName('control-loading')[0];
  loadingButton.innerHTML = 'Enter';
  loadingButton.classList.remove('control-loading');
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
// CHECK WHETHER DEVICE IS MOBILE
// ==============================
//
const CheckIfMobile = () => {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

//
// SETUP THE AUDIO + AUDIOCONTEXT OBJECTS
// ======================================
//
const ConfigAudio = () => {
  audio = new Audio();
  // audio.src = `https://api.soundcloud.com/tracks/${TRACK}/stream?client_id=${CLIENT_ID}`;
  audio.src = "http://play.fnoobtechno.com:2199/;";
  audio.controls = false;
  audio.autoplay = true;
  audio.crossOrigin = 'anonymous';
  document.body.appendChild(audio);

  ctx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = ctx.createAnalyser();
  source = ctx.createMediaElementSource(audio);
  analyser.smoothingTimeConstant = 0.6;
  source.connect(ctx.destination);
  source.connect(analyser);
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
  // console.log(dataArray)
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

  if (CheckIfMobile()) {
    document.getElementsByClassName('mobile-warning')[0].classList.add('is-visible');
    return false;
  } else {
    Promise.all(ALL_GIFS.map(PreloadImage)).then(() => {
      RemoveLoadingState();
      SelectRandomGifs();
      StartVisuals();
    });
    GenerateImageCSS(ALL_GIFS);
    ConfigAudio();
    DrawAudioWave();
  }
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

const controlToggleAbout = document.getElementsByClassName(
  'control-toggle-about',
);
const controlAudio = document.getElementById('control-audio');

for (let i = 0, l = controlToggleAbout.length; i < l; i++) {
  controlToggleAbout[i].addEventListener('click', () => toggleAbout(), false);
}

controlAudio.addEventListener(
  'click',
  ev => {
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
