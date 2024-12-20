/* thanks to
https://jackyef.com/posts/building-an-audio-loop-player-on-the-web */

/*
    Using Web Audio API so that the thrust sound will loop cleanly (without gap)
    hacky implementation.  Learned just enough Web Audio API to get the sound to start & stop 
*/
let isPlaying = false;

const audioCtx = new window.AudioContext();
const gainNode = audioCtx.createGain();
const source = audioCtx.createBufferSource();
const arrayBuffer = await fetch("./audio/thrust.mp3").then((res) =>
    res.arrayBuffer()
);
// Convert ArrayBuffer to an AudioBuffer
const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
source.buffer = audioBuffer;
source.loop = true;
source.connect(gainNode).connect(audioCtx.destination);

audioCtx.suspend();
source.start();

const startThrustSound = () => {
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    } 
};
const stopThrustSound = () => {
    if (audioCtx.state !== "suspended") {
        audioCtx.suspend();
        // source.stop();
    }
};

const setThrustVolume = (value) => {
    gainNode.gain.value = value;
}

export { startThrustSound, stopThrustSound,setThrustVolume };
