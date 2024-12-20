import { players, getGameStatus, ships, gameInProgress } from "./main.js";
import { view } from "./view.js";
import { setGameVolume } from "./module-sound.js";
const showPlayersButton = document.getElementById("show-players");
// const showWaitingPlayersButton = document.getElementById("show-waiting-players");
const showShipsButton = document.getElementById("show-ships");
const showGameStatusButton = document.getElementById("show-game-status");

// console.log("showPlayersButton: ", showPlayersButton);

showPlayersButton.addEventListener("pointerdown", (event) => {
    console.log("players:", players);
});

// showWaitingPlayersButton.addEventListener("pointerdown", (event) => {
//     console.log("waitingPlayers:",waitingPlayers);
// });

showShipsButton.addEventListener("pointerdown", (event) => {
    console.log("ships: ", ships);
});

showGameStatusButton.addEventListener("pointerdown", (event) => {
    getGameStatus();
});

// VOLUME CONTROL
const volumeControl = document.querySelector("div.volume-slider-container");
const slider = volumeControl.querySelector("input[type=range]");
setGameVolume(slider.value);
// volumeControl.addEventListener("pointerover", (event) => {
//     view.show(slider);
// });
// volumeControl.addEventListener("pointerout", (event) => {
//     view.hide(slider);
// });
slider.addEventListener("input", (event) => {
    setGameVolume(event.target.value);
});
slider.addEventListener("change", (event) => {
    setGameVolume(event.target.value);
});

// dev visuals toggl4
let devToolsVisualsOn = false;
const visualizationsCheckbox = document.getElementById("visual-helpers");
visualizationsCheckbox.addEventListener("change", (event) => {
    devToolsVisualsOn = event.target.checked;
});

let playerNamesON = true;
const playerNamesCheckbox = document.getElementById("player-names-toggle");
playerNamesCheckbox.addEventListener("change", (event) => {
    playerNamesON = event.target.checked;
});

// const testCallbackBtn = document
// .querySelector("button#test-callback");

// testCallbackBtn.addEventListener("pointerdown", (event) => {
//         console.log("gameInProgress: ",gameInProgress);

//     });
export { showPlayersButton, devToolsVisualsOn, playerNamesON };
