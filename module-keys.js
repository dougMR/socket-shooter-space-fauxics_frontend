import{clientPlayer} from "./main.js"

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
        // keyObj.lastTimePressed = performance.now();
        // keyObj.myFunction();
        keyObj.isDown = true;
        // startKeyCheckInterval();
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

    // const keyDown = keys.find((key) => key.isDown);
    // if (!keyDown) {
    //     // no keys down, stop key listener interval
    //     stopKeyCheckInterval();
    // }
};

const checkKeys = () => {
    for (const keyObj of keys) {
        // if ( keyObj.isDown) {
        //     console.log(
        //         "keyObj",
        //         keyObj.name,
        //         performance.now() - keyObj?.lastTimePressed
        //     );
        // }
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

// ^ Move to Keys module

export const Keys = {
    // setKey,
    addKey,
    handleKeyDown,
    handleKeyUp,
    checkKeys,
};
