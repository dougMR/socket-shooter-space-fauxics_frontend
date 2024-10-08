import {
    clientPlayer,
    emit,
    gameInProgress
} from "./main.js";
import { view } from "./view.js";
import { startThrustSound, stopThrustSound } from "./module-web-audio-api.js";
import { playSoundByNameString } from "./module-sound.js";

// Fly Ship
//
//////////////////////

const accelerate = (amount) => {
    if (!clientPlayer.ship.alive) return;
    emit("accelerate_ship", amount);
    // playSoundLoopByNameString("thrust");
    startThrustSound();
};
const stopThrust = () => {
    emit("stop_ship_thrust");
    // stopSoundByNameString("thrust");
    stopThrustSound();
};

const shoot = () => {
    // console.log("shoot", clientPlayer.ship.alive);
    if (!clientPlayer.ship.alive) return;
    playSoundByNameString("laserSound");
    emit("broadcast_sound", "laserSound");
    emit("ship_shoot");
};

const shootMine = () => {
    // playSoundByNameString("popgun");
    // emit("broadcast_sound", "popgun");
    emit("ship_shoot_mine");
}

const turn = (degChange) => {
    if (!clientPlayer.ship.alive) return;
    emit("rotate_ship", degChange);
};

// KEYS
let keyCheckInterval = null;

const keys = [];

// const setKey = (keyName, myFunction, frequency) => {
//     const keyNames = [];
//     if (typeof keyName === "string" || !Array.isArray(keyName)) {
//         keyNames.push(keyName);
//     } else {
//         keyNames.push(...keyName);
//     }
//     keys.push({
//         name: keyNames,
//         myFunction,
//         upFunction,
//         frequency,
//         lastTimePressed: 0,
//         isDown: false,
//     });
// };

const addKey = (keyObj) => {
    keys.push(keyObj);
};

const handleKeyDown = (event) => {
    // console.log(`\nThe key "${event.key}" was pressed.`);

    const keyObj = keys.find((key) => {
        return key.name === event.key || key.name.includes(event.key);
    });

    if (keyObj) {
        event.preventDefault();
        keyObj.isDown = true;
    }
};

const handleKeyUp = (event) => {
    const keyObj = keys.find(
        (key) => key.name === event.key || key.name.includes(event.key)
    );
    if (keyObj) {
        event.preventDefault();
        if (keyObj.upFunction) {
            keyObj.upFunction();
        }
        keyObj.isDown = false;
    }
};

const checkKeys = () => {
    for (const keyObj of keys) {
        if (
            keyObj.isDown &&
            keyObj?.lastTimePressed < performance.now() - keyObj?.frequency
        ) {
            keyObj.lastTimePressed = performance.now();
            keyObj.myFunction();
        }
    }
};

const startKeyCheckInterval = () => {
    // already running?
    if (keyCheckInterval) return;
    keyCheckInterval = setInterval(checkKeys, 17);
};

const stopKeyCheckInterval = () => {
    if (keyCheckInterval) {
        clearInterval(keyCheckInterval);
        keyCheckInterval = undefined;
    }
};

// Set up keys for control

const keysToAdd = [
    {
        name: ["ArrowLeft", "A", "a"],
        myFunction: () => {
            if (clientPlayer.ship.alive) turn(-5);
        },
        frequency: 50,
    },
    {
        name: ["ArrowRight", "D", "d"],
        myFunction: () => {
            if (clientPlayer.ship.alive) turn(5);
        },
        frequency: 50,
    },
    {
        name: ["ArrowUp", "w", "W"],
        myFunction: () => {
            if (clientPlayer.ship.alive) accelerate(0.05);
        },
        upFunction: () => {
            if (clientPlayer.ship.alive) stopThrust();
        },
        frequency: 30,
    },
    {
        name: ["ArrowDown", "s", "S"],
        myFunction: () => {
            if (clientPlayer.ship.alive) accelerate(-0.025);
        },
        upFunction: () => {
            if (clientPlayer.ship.alive) stopThrust();
        },
        frequency: 30,
    },
    {
        name: ["  ", " ", "Space"],
        myFunction: () => {
            if (clientPlayer.ship && gameInProgress) shoot();
        },
        frequency: 500,
    },
    {
        name: ["M", "m"],
        myFunction: () => {
            if (clientPlayer.ship && gameInProgress) shootMine();
        },
        frequency: 500,
    },
];

for (const key of keysToAdd) {
    key.lastTimePressed = 0;
    addKey(key);
}

// LISTENERS

window.addEventListener("keydown", (event) => {
    if (view.isHidden(document.getElementById("name-prompt"))) {
        handleKeyDown(event);
    }
});
window.addEventListener("keyup", (event) => {
    if (view.isHidden(document.getElementById("name-prompt"))) {
        handleKeyUp(event);
    }
});

// export const Keys = {
// setKey,
// addKey,
// handleKeyDown,
// handleKeyUp,
// checkKeys,
// };
export { checkKeys };
