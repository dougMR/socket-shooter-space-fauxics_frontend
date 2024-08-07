console.log('module-sound.js');
/*

    GAME SOUNDS

*/

const playSoundByNameString = (soundString) => {
    // handle sound normally
    playSound(soundStrings[soundString]);
};


const dupeSound = (audioEl) => {
    // duplicate the audio element
    const key = audioEl.src;
    const newAudio = new Audio(audioEl.src);
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
registerSound("themeMusic", "./audio/muvibeat10_130bpm-14340mono.mp3");
registerSound("chirp-select","./audio/chirp-button.mp3")
soundStrings["themeMusic"].loop = true;

export { playSoundByNameString, stopSoundByNameString, registerSound };
