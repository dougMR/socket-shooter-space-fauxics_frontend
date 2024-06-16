console.log("main.js");

import serverURL from "./server-url.js";
import { Keys } from "./module-keys.js";
import {
    drawCircle,
    drawMissile,
    drawRectangle,
    drawShip,
    drawOnce,
    resizeCanvas,
    showTime,
    startDrawLoop,
} from "./module-draw.js";
import {
    playSoundByNameString,
    stopSoundByNameString,
} from "./module-sound.js";
import { getUUID, setUUID, clearUUID } from "./module-uuid.js";
import "./dev-tools.js";

// Set up keys for control

const keysToAdd = [
    {
        name: ["ArrowLeft", "A", "a"],
        myFunction: () => {
            if (clientPlayer.ship) turn(-5);
        },
        frequency: 50,
    },
    {
        name: ["ArrowRight", "D", "d"],
        myFunction: () => {
            if (clientPlayer.ship) turn(5);
        },
        frequency: 50,
    },
    {
        name: ["ArrowUp", "w", "W"],
        myFunction: () => {
            if (clientPlayer.ship) accelerate(0.05);
        },
        upFunction: () => {
            if (clientPlayer.ship) stopThrust();
        },
        frequency: 30,
    },
    {
        name: ["ArrowDown", "s", "S"],
        myFunction: () => {
            if (clientPlayer.ship) accelerate(-0.025);
        },
        upFunction: () => {
            if (clientPlayer.ship) stopThrust();
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
    socket.emit("accelerate_ship", clientPlayer.id, amount);
};
const stopThrust = () => {
    socket.emit("stop_ship_thrust", clientPlayer.id);
};

const shoot = () => {
    console.log("shoot. gameOver: ", gameOver);
    // sound
    playSoundByNameString("laserSound");
    socket.emit("broadcast_sound", "laserSound");
    socket.emit("ship_shoot", clientPlayer.id);
};

// const move = (distance) => {
//     console.log("move()");
//     // const oldPos = { x: clientPlayer.ship.x, y: clientPlayer.ship.y };
//     // clientPlayer.ship.move(distance);
//     socket.emit("move_ship", clientPlayer.id, distance);
// };

const turn = (degChange) => {
    socket.emit("rotate_ship", clientPlayer.id, degChange);
};

const showNamePrompt = () => {
    console.log("showNamePrompt()");
    const playerName = prompt("Create a player name.");
    connectToServer();
    joinGame(playerName);
};
const joinGame = (playerName) => {
    console.log("joinGame()", playerName);
    if (!playerName) {
        playerName = prompt("Create a player name.");
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
                // --
                // playSound(welcomeMusic);
                // justJoined();
            }
        }
    );
};
const rejoinGame = () => {
    console.log("rejoinGame()");
    connectToServer();
    const uuid = getUUID() || setUUID();
    console.log("uuid: ", uuid);
    socket.emit("rejoin_game", uuid, (response) => {
        console.log("rejoin_game response:", response);
        if (response.success) {
            // console.log("rejoined as ", response.name);
            // we are reconnected as previous player
            alert("you have rejoined as " + response.name);
            // justJoined();
        } else {
            clearUUID();
            showNamePrompt();
        }
    });
};

// Socket Stuff
//
////////////////////////

const connectToServer = () => {
    console.log("connectToServer()");
    socket = io(serverURL);

    socket.on("connect", () => {
        console.log("socket connected --> ID::", socket.id);
        // socket.on(
        //     "connectionPingback",
        //     (reconnectDurationMS, serverCallback) => {
        //         console.log("connectionPingback");
        //         reconnectTimeLimitMS = reconnectDurationMS;
        //         serverCallback(getUUID(), (response) => {
        //             if (response.success) {
        //                 console.log("rejoined as ", response.name);
        //                 // we are reconnected as previous player
        //                 showPrompt({
        //                     message: "you have rejoined as " + response.name,
        //                 });
        //             }
        //         });
        //     }
        // );

        socket.on("disconnect", (data) => {
            console.log("DISCONNECTED.");
            console.log("BECAUSE:", data);
        });
        // Players
        socket.on("updatePlayers", (players) => {
            console.log("updatePlayers()");
            console.log("socket.id: ", socket.id);
            console.log("numPlayers: ", players.length);

            for (const player of players) {
                console.log("player:", player);
                // update scores
                // update players' ships positions
                player.ship.draw = () => {
                    drawShip(player.ship);
                };
                if (player.id === socket.id) {
                    console.log("set clientPlayer");
                    clientPlayer = player;
                }
                console.log("clientPlayer: ", clientPlayer);
            }
        });

        // Sounds
        socket.on("playSound", (soundString) => {
            // console.log('"playSound"', soundString);
            playSoundByNameString(soundString);
        });
        socket.on("stopSound", (soundString) => {
            stopSoundByNameString(soundString);
        });

        // Draw Game Objects
        // socket.on("drawCircle", (circle) => {
        //     drawCircle(circle);
        // });
        // socket.on("drawMissile", (missile) => {
        //     drawMissile(missile);
        // });
        // socket.on("drawRectangle", (rectangle) => {
        //     drawRectangle(rectangle);
        // });
        // socket.on("drawShip", (ship) => {
        //     drawShip(ship);
        // });
        socket.on("showTime", (remaining) => {
            showTime(remaining);
        });
        socket.on("updateGameData", (data) => {
            // asteroids = data.asteroids;
            asteroids.splice(0, Infinity, ...data.asteroids);
            // missiles = data.missiles;
            missiles.splice(0, Infinity, ...data.missiles);
            // if (missiles.length > 0) {
            //     console.log(
            //         "updateGameData",
            //         "missiles: ",
            //         data.missiles.length
            //     );
            // }
            // debris = data.debris;
            debris.splice(0, Infinity, ...data.debris);
            // obstacles = data.obstacles;
            obstacles.splice(0, Infinity, ...data.obstacles);
            // ships = data.ships;
            ships.splice(0, Infinity, ...data.ships);
        });
        socket.on("endGame", () => {
            console.log("\r\nendGame\r\n");
            gameOver = true;
        });
    });
};

//

// POINT OF ENTRY
const asteroids = [];
const missiles = [];
const debris = [];
const obstacles = [];
const ships = [];

let clientPlayer = null;
let gameOver = false;

window.addEventListener("keydown", Keys.handleKeyDown);
window.addEventListener("keyup", Keys.handleKeyUp);

window.addEventListener("resize", function () {
    resizeCanvas();
    drawOnce();
});
window.dispatchEvent(new Event("resize"));

const startGame = (event) => {
    gameOver = false;
    document.getElementById("start-screen").style.display = "none";
    socket.emit("start_game");
    startDrawLoop();
};
document
    .getElementById("start-screen")
    .addEventListener("pointerdown", startGame);
//
let socket;

// const getTempPlayerName = () => {
//     // temp random player name
//     let playerName = "A";
//     for (let i = 0; i < 10; i++) {
//         playerName += Math.round(Math.random() * 10);
//     }
//     return playerName;
// };

if (getUUID() !== false) {
    console.log("got UUID!");
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
    clientPlayer,
    gameOver,
};
