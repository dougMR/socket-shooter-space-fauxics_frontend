const makeSound = (src) => {
    // make audio element
    const audioEls = [new Audio(src)];
    const newSound = {
        audioEls,
        src,
        _loop:false,
        play: function () {
            playSound(this);
        },
        stop: function () {
            for(const audioEl of this.audioEls){
                audioEl.pause();
                audioEl.currentTime = 0;
            }
        },
        set loop(value){
            this._loop = value;
            for(const el of this.audioEls){
                el.loop = true;
            }
        },
        get loop(){
            return this._loop;
        }
    };
    return newSound;
};

const playSound = (sound) => {
    let triggeredSound = false;
    const id = sound.id;

    for (const audio of sound.audioEls) {
        if (audio.currentTime === 0 || audio.ended) {
            // play it
            audio.currentTime = 0;
            audio.play();
            // flag it played
            triggeredSound = true;
            // exit loop
            break;
        }
    }

    if (!triggeredSound) {
        // Make a new audioEl copy
        const newAudioEl = new Audio(sound.src);
        newAudioEl.loop = sound.loop;
        sound.audioEls.push(newAudioEl);
        const tempListener = (e) => {
            e.target.play();
            e.target.removeEventListener("canplaythrough", tempListener);
        };
        newAudioEl.addEventListener("canplaythrough", tempListener);
    }
};

export { makeSound };
