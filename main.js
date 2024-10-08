console.log("main.js");

import serverURL from "./server-url.js";
// import  "./module-keys.js";
import {
    drawShip,
    drawNames,
    showTime,
    startDrawLoop,
    setClientScore,
} from "./module-draw.js";
import {
    playSoundByNameString,
    stopSoundByNameString,
    playSoundLoopByNameString,
} from "./module-sound.js";
import { stopThrustSound } from "./module-web-audio-api.js";
import { getUUID, setUUID, clearUUID } from "./module-uuid.js";
import "./dev-tools.js";
import { output } from "./module-output.js";
import {
    showPlayersListOnStartScreen,
    showBrandScreen,
    showStartScreen,
    showControlsScreen
} from "./client-inputs.js";
import {
    displayLeaders,
    // displayAllTimeLeaders,
} from "./module-leaderboard.js";
import { hideNamePrompt, showNamePrompt } from "./module-name-prompt.js";

import { popupMessage } from "./module-popup-message.js";
import { view } from "./view.js";

const emit = (endpointName, argument, includeClientPlayerId = true) => {
    // only works with server calls with one parameter - specified, or clientPlayer.id
    if (argument) {
        if (!includeClientPlayerId) {
            socket.emit(endpointName, argument);
        } else {
            socket.emit(endpointName, clientPlayer.id, argument);
        }
    } else {
        socket.emit(endpointName, clientPlayer.id);
    }
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
                popupMessage(serverResponse.error);
                showNamePrompt();
            } else {
                getGameStatus();
                hideNamePrompt();
                // view.show(document.getElementById("controls-screen"));
                showControlsScreen()
            }
        }
    );
};
const rejoinGame = () => {
    console.log("rejoinGame()");
    connectToServer();
    const uuid = getUUID(); // || setUUID();
    hideNamePrompt();

    socket.emit("rejoin_game", uuid, (response) => {
        console.log("rejoin_game response:", response);
        if (response.success) {
            // we are reconnected as previous player
            // alert("you have rejoined as " + response.name);
            // if we call alert() in here, client re-disconnects if not click OK immediately
            getGameStatus();
            popupMessage("you have rejoined as " + response.name);
            view.show(document.getElementById("controls-screen"));
            // document.getElementById("controls-screen").classList.remove("hidden");
        } else {
            // rejoin didn't work
            clearUUID();
            setTimeout(showNamePrompt, 500);
        }
    });
};

// const voteAllHere = (yesOrNo) => {
//     socket.emit("vote_all_here", yesOrNo);
// };

// const getLeaderboard = (callback) => {
//     socket.emit("get_leaderboard", callback);
// };

// const submitScoreToLeaderboard = async (player) => {
//     //     console.log("submitScoreToLeaderboard()");
//     player = player ? player : clientPlayer;
//     socket.emit("submit_score", player);
// };

// const getWaitingPlayers = () => {
//     console.log('getWaitingPlayers()...')
//     socket.emit("get_waiting_players", (response)=>{
//         console.log('getWaitingPlayers:',response);
//         waitingPlayers = response;
//     });
// }

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
            //
            setFrontendPlayers([]);
            showBrandScreen();
        });
        // Players
        socket.on("updatePlayers", (playersFromServer) => {
            // !!! This is in competition with player updates from updateGameData
            console.log("updatePlayers()");
            // console.log("socket.id: ", socket.id);
            console.log("numPlayers: ", playersFromServer.players.length);
            setFrontendPlayers(playersFromServer.players);
            // waitingPlayers = playersFromServer.waitingPlayers;
            for (const player of players) {
                drawShip(player.ship);
                if (player.id === socket.id) {
                    clientPlayer = player;
                    console.log(
                        "     ----------------------- set clientPlayer",
                        clientPlayer.name
                    );
                }
            }
            // for (const player of waitingPlayers) {
            //     if (player.id === socket.id) {
            //         clientPlayer = player;
            //         console.log(
            //             "     ----------------------- set clientPlayer",
            //             clientPlayer.name
            //         );
            //     }
            // }
            drawNames();
            showPlayersListOnStartScreen();
            console.log("players:", players);
        });

        // Sounds
        socket.on("playSound", (soundString) => {
            // console.log("playSound", soundString);
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
            mines.splice(0, Infinity, ...data.mines);
            shockwaves.splice(0,Infinity, ...data.shockwaves);
            debris.splice(0, Infinity, ...data.debris);
            obstacles.splice(0, Infinity, ...data.obstacles);
            ships.splice(0, Infinity, ...data.ships);
            setFrontendPlayers(data.players);
            // show fps
            document.getElementById("fps").textContent = data.fps + "fps";
        });
        socket.on("startGame", () => {
            startGame();
        });
        socket.on("endGame", () => {
            console.log("\r\nendGame\r\n");
            gameInProgress = false;

            // submitScoreToLeaderboard();
            // displayAllTimeLeaders();
            if (clientPlayer.onDeck) {
                showStartScreen();
            } else {
                displayLeaders();
                stopThrustSound();
                view.show(document.getElementById("again-button"));
            }
            // document.getElementById("again-button").classList.remove("hidden");
        });
        // socket.on("updateGameStatus", (serverGameStatus) => {
        //     gameStatus = serverGameStatus;
        // })
    });
};

//

const setFrontendPlayers = (newPlayers) => {
    players.length = 0;
    players.push(...newPlayers);
    // console.log("setFrontEndPlayers():", players.map(p=>p.name));

    let playersText = "";
    for (const p of players) {
        playersText += `<br /><div style="color: ${p.ship.color};" >${p.name}${
            p.onDeck ? "(waiting)" : ""
        } ... ${p.score}</div>`;
        if (p.id === socket.id) clientPlayer = p;
    }
    setClientScore(clientPlayer?.score);

    output(playersText, true);
};

const imReady = (yesOrNo) => {
    socket.emit("player_ready", yesOrNo);
};

const startGame = (event) => {
    console.log("startGame()");
    gameInProgress = true;
    // setClientScore(0);
    view.hide(document.getElementById("leaderboard"));
    view.hide(document.getElementById("controls-screen"));
    view.hide(document.getElementById("start-options"));
    startDrawLoop();
    stopSoundByNameString("themeMusic");
    playSoundLoopByNameString("themeMusic");
};

const getGameStatus = () => {
    console.log("getGameStatus()");
    socket.emit("get_game_status", (serverResponse) => {
        console.log("serverResponse", serverResponse);
        gameInProgress = serverResponse.inProgress;
    });
};

//////////////////////////////////////
//////////////////////////////////////
////
////        POINT OF ENTRY
////
//////////////////////////////////////
//////////////////////////////////////

const asteroids = [];
const missiles = [];
const mines = [];
const shockwaves = [];
const debris = [];
const obstacles = [];
const ships = [];

let players = [];
let waitingPlayers = [];
let clientPlayer = null;
let gameInProgress = false;
let socket;

// Start client
window.dispatchEvent(new Event("resize"));

// output(getUUID());
if (getUUID()) {
    // try to rejoin
    rejoinGame();
} else {
    setTimeout(showNamePrompt, 500);
}

export {
    asteroids,
    missiles,
    mines,
    shockwaves,
    debris,
    obstacles,
    ships,
    players,
    waitingPlayers,
    clientPlayer,
    gameInProgress,
    // voteAllHere,
    imReady,
    connectToServer,
    joinGame,
    // getLeaderboard,
    emit,
    getGameStatus,
};
