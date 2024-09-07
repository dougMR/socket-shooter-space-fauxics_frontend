console.log("main.js");

import serverURL from "./server-url.js";
import { Keys } from "./module-keys.js";
import {
    drawCircle,
    drawMissile,
    drawRectangle,
    drawShip,
    drawNames,
    drawOnce,
    resizeCanvas,
    showTime,
    startDrawLoop,
    setClientScore,
} from "./module-draw.js";
import {
    playSoundByNameString,
    stopSoundByNameString,
    playSoundLoopByNameString,
} from "./module-sound.js";
import { getUUID, setUUID, clearUUID } from "./module-uuid.js";
import "./dev-tools.js";
import { output } from "./module-output.js";
import "./client-inputs.js";
import {
    hideLeaders,
    displayLeaders,
    // displayAllTimeLeaders,
} from "./module-leaderboard.js";
import { hideNamePrompt, showNamePrompt } from "./module-name-prompt.js";
import { startThrustSound, stopThrustSound } from "./module-web-audio-api.js";

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
            if (clientPlayer.ship && !gameOver) shoot();
        },
        frequency: 500,
    },
];

for (const key of keysToAdd) {
    key.lastTimePressed = 0;
    Keys.addKey(key);
}

// Fly Ship
//
//////////////////////

const accelerate = (amount) => {
    if (!clientPlayer.ship.alive) return;
    socket.emit("accelerate_ship", clientPlayer.id, amount);
    // playSoundLoopByNameString("thrust");
    startThrustSound();
};
const stopThrust = () => {
    socket.emit("stop_ship_thrust", clientPlayer.id);
    // stopSoundByNameString("thrust");
    stopThrustSound();
};

const shoot = () => {
    // console.log("shoot. gameOver: ", gameOver);
    console.log("shoot", clientPlayer.ship.alive);
    if (!clientPlayer.ship.alive) return;
    playSoundByNameString("laserSound");
    socket.emit("broadcast_sound", "laserSound");
    socket.emit("ship_shoot", clientPlayer.id);
};

const turn = (degChange) => {
    if (!clientPlayer.ship.alive) return;
    socket.emit("rotate_ship", clientPlayer.id, degChange);
};

//
//  TALK TO SERVER
//
///////////////////////////////////////

const joinGame = (playerName) => {
    console.log("joinGame()", playerName);
    if (!playerName) {
        showNamePrompt();
        return;
    }
    socket.emit(
        "join_game",
        playerName,
        getUUID() || setUUID(),
        (serverResponse) => {
            console.log(
                "frontend received '",
                serverResponse,
                "' from backend."
            );
            if (serverResponse.error) {
                // Show Name Prompt
                alert(serverResponse.error);
                showNamePrompt();
            } else {
                hideNamePrompt();
                document
                    .getElementById("start-screen")
                    .classList.remove("hidden");
            }
        }
    );
};
const rejoinGame = () => {
    console.log("rejoinGame()");
    connectToServer();
    const uuid = getUUID() || setUUID();
    hideNamePrompt();

    socket.emit("rejoin_game", uuid, (response) => {
        console.log("rejoin_game response:", response);
        if (response.success) {
            // console.log("rejoined as ", response.name);
            // we are reconnected as previous player
            alert("you have rejoined as " + response.name);
            // output("rejoined as "+response.name);
            // justJoined();

            document.getElementById("start-screen").classList.remove("hidden");
        } else {
            clearUUID();
            showNamePrompt();
        }
    });
};

const voteAllHere = (yesOrNo) => {
    socket.emit("vote_all_here", yesOrNo);
};

// const getLeaderboard = (callback) => {
//     socket.emit("get_leaderboard", callback);
// };

// const submitScoreToLeaderboard = async (player) => {
//     //     console.log("submitScoreToLeaderboard()");
//     player = player ? player : clientPlayer;
//     socket.emit("submit_score", player);
// };
// Socket Stuff
//
////////////////////////

const connectToServer = () => {
    console.log("connectToServer()");
    socket = io(serverURL);

    socket.on("connect", () => {
        console.log("socket connected --> ID::", socket.id);

        socket.on("disconnect", (data) => {
            console.log("DISCONNECTED.");
            console.log("BECAUSE:", data);
        });
        // Players
        socket.on("updatePlayers", (playersFromServer) => {
            // !!! This is in competition with player updates from updateGameData
            console.log("updatePlayers()");
            console.log("socket.id: ", socket.id);
            console.log("numPlayers: ", playersFromServer.length);
            setFrontendPlayers(playersFromServer);
            for (const player of players) {
                drawShip(player.ship);
                if (player.id === socket.id) {
                    clientPlayer = player;
                    console.log(
                        "     ----------------------- set clientPlayer",
                        clientPlayer.name
                    );
                }
                // console.log("clientPlayer: ", clientPlayer);
            }
            drawNames();
        });

        // Sounds
        socket.on("playSound", (soundString) => {
            playSoundByNameString(soundString);
        });
        socket.on("stopSound", (soundString) => {
            stopSoundByNameString(soundString);
        });

        socket.on("showTime", (remaining) => {
            showTime(remaining);
        });
        socket.on("updateGameData", (data) => {
            // console.log('updateGameData()');
            asteroids.splice(0, Infinity, ...data.asteroids);
            missiles.splice(0, Infinity, ...data.missiles);
            debris.splice(0, Infinity, ...data.debris);
            obstacles.splice(0, Infinity, ...data.obstacles);
            ships.splice(0, Infinity, ...data.ships);
            setFrontendPlayers(data.players);
        });
        socket.on("startGame", () => {
            startGame();
        });
        socket.on("endGame", () => {
            console.log("\r\nendGame\r\n");
            gameOver = true;
            displayLeaders();
            // submitScoreToLeaderboard();
            // displayAllTimeLeaders();
            document.getElementById("again-button").classList.remove("hidden");
        });
    });
};

//

const setFrontendPlayers = (newPlayers) => {
    players.length = 0;
    players.push(...newPlayers);
    // console.log("setFrontEndPlayers():", players.map(p=>p.name));

    let playersText = "";
    for (const p of players) {
        playersText += `<br /><div style="color: ${p.ship.color};" >${p.name} ... ${p.score}</div>`;
        if (p.id === socket.id) clientPlayer = p;
    }
    setClientScore(clientPlayer.score);

    output(playersText, true);
};

const imReady = (yesOrNo) => {
    socket.emit("player_ready", yesOrNo);
};

const closeStartScreen = () => {
    console.log("close start-screen.");
    playSoundByNameString("click");
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("start-options").classList.remove("hidden");
    document.getElementById("ready").checked = false;
    document.getElementById("all-here").checked = false;
};

const startGame = (event) => {
    console.log("startGame()");
    hideLeaders();
    gameOver = false;
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("start-options").classList.add("hidden");
    startDrawLoop();
    stopSoundByNameString("themeMusic");
    playSoundLoopByNameString("themeMusic");
};

// LISTENERS

window.addEventListener("keydown", (event) => {
    if (document.getElementById("name-prompt").classList.contains("hidden")) {
        Keys.handleKeyDown(event);
    }
});
window.addEventListener("keyup", (event) => {
    if (document.getElementById("name-prompt").classList.contains("hidden")) {
        Keys.handleKeyUp(event);
    }
});
window.addEventListener("resize", function () {
    console.log("resize");
    resizeCanvas();
    drawOnce();
});
document
    .getElementById("start-screen")
    .addEventListener("pointerdown", closeStartScreen);

document
    .getElementById("again-button")
    .addEventListener("pointerdown", (event) => {
        event.target.classList.add("hidden");
        hideLeaders();
        closeStartScreen();
    });

// POINT OF ENTRY
const asteroids = [];
const missiles = [];
const debris = [];
const obstacles = [];
const ships = [];

let players = [];
let clientPlayer = null;
let gameOver = true;
let socket;

// Start client
window.dispatchEvent(new Event("resize"));

output(getUUID());
if (getUUID()) {
    // console.log("got UUID!", getUUID());
    // try to rejoin
    rejoinGame();
} else {
    showNamePrompt();
}

export {
    asteroids,
    missiles,
    debris,
    obstacles,
    ships,
    players,
    clientPlayer,
    gameOver,
    voteAllHere,
    imReady,
    connectToServer,
    joinGame,
    // getLeaderboard,
};
