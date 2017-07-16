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
  {
    name: 'crowd',
    path: require('img/gifs/crowd.gif'),
  },
  {
    name: 'fly',
    path: require('img/gifs/fly.gif'),
  },
  {
    name: 'growth',
    path: require('img/gifs/growth.gif'),
  },
  {
    name: 'heads',
    path: require('img/gifs/heads.gif'),
  },
  {
    name: 'morph',
    path: require('img/gifs/morph.gif'),
  },
  {
    name: 'orb',
    path: require('img/gifs/orb.gif'),
  },
  {
    name: 'psycho',
    path: require('img/gifs/psycho.gif'),
  },
  {
    name: 'rainbow-drip',
    path: require('img/gifs/rainbow_drip.gif'),
  },
  {
    name: 'space',
    path: require('img/gifs/space.gif'),
  },
  {
    name: 'train',
    path: require('img/gifs/train.gif'),
  },
  {
    name: 'x_ray_2',
    path: require('img/gifs/x_ray_2.gif'),
  },
  {
    name: 'x_ray_3',
    path: require('img/gifs/x_ray_3.gif'),
  },
  {
    name: 'x_ray',
    path: require('img/gifs/x_ray.gif'),
  },
];

export const LINE_COLORS = [
  'rgba(255, 23, 204, 0.5)',
  'rgba(130, 23, 255, 0.5)',
];

// The dimensions of the current viewport
// - Used to set canvas width & height
export const PAGE_DIMENSIONS = {
  width: window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth,
  height: window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight,
};

// The global app. This used primarily as a bus to bind custom events to.
const GlobalApp = document.getElementById('app');
export default GlobalApp;
