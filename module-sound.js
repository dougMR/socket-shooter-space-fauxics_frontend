console.log("module-sound.js");
/*

    GAME SOUNDS

*/
import { setThrustVolume } from "./module-web-audio-api.js";
let gameVolume = 1;

const setGameVolume = (value) => {
    gameVolume = value;
    // value: 0 - 1
    for (const string in soundStrings) {
        soundStrings[string].volume = value;
    }
    for (const key in soundCopies) {
        for (const audioEl of soundCopies[key]) {
            audioEl.volume = value;
        }
    }
    setThrustVolume(value);
};
const playSoundLoopByNameString = (soundString) => {
    // console.log("playSoundByNameString",soundString);
    const audioEl = soundStrings[soundString];
    if (audioEl.paused) {
        audioEl.play();
        audioEl.loop = true;
    }
};

const playSoundByNameString = (soundString, loop) => {
    // handle sound normally
    playSound(soundStrings[soundString], loop);
};

const dupeSound = (audioEl) => {
    // duplicate the audio element
    const key = audioEl.src;
    const newAudio = new Audio(audioEl.src);
    newAudio.volume = gameVolume;
    if (!soundCopies[key]) {
        soundCopies[key] = [];
    }
    soundCopies[key].push(newAudio);
    return newAudio;
};

const playSound = (audioEl, loop) => {
    // console.log('playSound()',audioEl);
    // play sound, or play copy, or create and play copy
    // and return a reference to the Audio element
    // console.log("audioEl: ",audioEl);
    const key = audioEl.src;
    let triggeredSample = false;
    let soundUsed = null;
    if (soundCopies[key]) {
        // If there are already copies of the sample
        for (const audio of soundCopies[key]) {
            if (audio.currentTime === 0 || audio.ended) {
                // play it
                audio.currentTime = 0;
                audio.loop = loop === true;
                audio.play();
                soundUsed = audio;
                // flag it played
                triggeredSample = true;
                // exit loop
                break;
            }
        }
    }

    if (!triggeredSample) {
        const newSample = dupeSound(audioEl);
        const tempListener = (e) => {
            e.target.loop = loop === true;
            e.target.play();
            e.target.removeEventListener("canplaythrough", tempListener);
        };
        newSample.addEventListener("canplaythrough", tempListener);
        soundUsed = newSample;
    }
    return soundUsed;
};

const stopSound = (audioEl) => {
    audioEl.pause();
    audioEl.currentTime = 0;
};

const stopSoundByNameString = (soundString) => {
    // handle sound normally
    stopSound(soundStrings[soundString]);
};

const registerSound = (soundString, filePath) => {
    soundStrings[soundString] = new Audio(filePath);
};
// Sounds
const soundCopies = {};

// need this safety catch?
const soundStrings = {};

registerSound("laserSound", "./audio/laser.mp3");
registerSound("explodeSound", "./audio/explode.mp3");
registerSound("explodeMid", "./audio/explodeMid.mp3");
registerSound("explodeBoom", "./audio/explodeDeep.mp3");
registerSound("explode8bit", "./audio/explode8bit.mp3");
registerSound("themeMusic", "./audio/muvibeat10_130bpm-14340mono.mp3");
registerSound("chirp-select", "./audio/chirp-button.mp3");
registerSound("thrust", "./audio/thrust.ogg");
registerSound("click", "./audio/click.mp3");
soundStrings["themeMusic"].loop = true;

export {
    playSoundByNameString,
    stopSoundByNameString,
    registerSound,
    playSoundLoopByNameString,
    setGameVolume,
};
