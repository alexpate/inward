![cover](/cover.jpg)

> Inward is a weekend hack project inspired by '[Trif](http://trif.it)', built in a day or so. It uses the web audio API to analyse an incoming audio stream (coming from SoundCloud), to toggle the visibility of some trippy gifs. There's also a hidden feature..somewhere..

- [What is this?](#what-is-this)
- [How does it work?](#how-does-it-work)
- [Running locally](#running-locally)
- [Credits](#credits)

## What is this?
Inward is a SoundCloud visualisation project. The app takes in a stream (from SoundCloud), analyses it in real-time, and uses frequency data to flash between different preselected gifs.

## How does it work?
The best way to see how this is running, is to start digging through the code (all of the best stuff is in `app.js`), but here's a quick rundown:

First, we create a new `Audio` object using the Web Audio API, and connect up to SoundCloud. SoundCloud is the only major streaming service that works, as we need to have access to the underlying stream in order to pull data from it. (Note that this step could also be achieved by just placing an `<audio>` tag on the DOM).

We can then wrap this `Audio` object, in an `AudioContext` object, which will allow us to create different nodes that give us data about our stream. For example, we can use `createAnalyser` which will give us back information about the frequency, or `createGain()`, to control the volume. `createAnalyser` is the main method that we will be using for both the waveform, and the main gif flashing effect.

Now that we have exposed this data, we can start to create visualisations with it. The main flashing gif effect is relatively simple. We first create a new `Uint8Array`, passing in the number of value places that we will require later. We can then fill this array, by using `getByteTimeDomainData`, which returns the current time domain information of the stream at that moment in time. This is then iterated over, and added to a running total, which we can then find an average from.

We then end up with a figure (for example `127.4`). Based on some trail and error, the time domain average of a techno mix comes out at around 128. It's then a case of flicking between different images if this value goes over a predefined max (in this case, `128.6`).

*Note: This was my first time using the Web Audio API. If any of the above is incorrect, please feel free to create an issue, or even better a PR!*

## Running locally

- `npm install`
- `npm run start`, which will kickstart webpack-dev-server
- It should now be up and running at [localhost:8080](http://localhost:8080)

## Credits
- All of the gifs in this project are sourced from Giphy.
- The mixes are linked at the bottom of each page.
- And of course, [Trif](http://trif.it) for the original idea.

> ⚠️ This project contains rapidly flickering images.
