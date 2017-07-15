// A quick switch to turn on console logging and other debugging
export const DEBUG = false;
// SoundCloud Track ID
// Only supports SoundCloud at the moment, due to streaming issues.
// We need to be able to get an audio stream that we can perform
// analysis on.
// export const TRACK = '223078149';
// export const TRACK = '121497631';
// export const TRACK = '98380289';
export const TRACK = '132296685';

// SoundCloud client id
export const CLIENT_ID = '17a992358db64d99e492326797fff3e8';

// All of the gifs (names are tied to CSS id's)
export const ALL_GIFS = [
  'x-ray',
  'growth',
  'morph',
  'rainbow-drip',
  'x-ray-2',
  'x-ray-3',
  'x-ray',
  'train',
  'orb',
  'crowd',
  'heads',
  'fly',
];

export const LINE_COLORS = ['rgba(255, 23, 204, 0.3)', 'rgba(130, 23, 255, 0.3)'];

// The dimensions of the current viewport
// - Used to set canvas width & height
export const PAGE_DIMENSIONS = {
  width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
  height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
};

// The global app. This used primarily as a bus to bind custom events to.
const GlobalApp = document.getElementById('app');
export default GlobalApp;
