import { imReady, players, gameInProgress } from "./main.js";
import { playSoundByNameString } from "./module-sound.js";
import { drawOnce, resizeCanvas } from "./module-draw.js";
import { view } from "./view.js";
// const readyCheckBox = document.getElementById("ready");
const ready = document.querySelector('label[for="ready"]');
const brandScreen = document.getElementById("brand-screen");
const controlsScreen = document.getElementById("controls-screen");
const startScreen = document.getElementById("start-options");
const leaderboard = document.getElementById("leaderboard");

const namePromptIsClosed = () => {
    return document.getElementById("name-prompt").classList.contains("hidden");
}

const showPlayersListOnStartScreen = () => {
    if (view.isHidden(startScreen)) return;
    // show list of players
    let playerListText = "<span style='color: white;'>Players:</span></ br>";
    for (const p of players) {
        console.log("SHOW:", p.name);
        playerListText += `<div class="leaderboard-entry"><p class="name"><span class="ship-icon" style="color:${
            p.ship.color
        };">&#9650;</span>&nbsp;${p.name}${
            p.onDeck ? "(waiting)" : !p.connected ? "(disconnected)" : ""
        }</p><p class="connector" style="background-color:${
            p.ship.color
        };"></p></div>`;
    }
    const playerList = document.getElementById("players-list");
    playerList.innerHTML = playerListText;
};

const closeBrandScreen = () => {
    if (!namePromptIsClosed()) return;
    playSoundByNameString("click");
    // brandScreen.classList.add("hidden");
    view.hide(brandScreen);
    // controlsScreen.classList.remove("hidden");
    showControlsScreen();
};

const showBrandScreen = () => {
    view.show(brandScreen);
    view.hide(startScreen);
    view.hide(controlsScreen);
    view.hide(leaderboard);
}

const showStartScreen = () => {
    view.show(startScreen);
    view.hide(brandScreen);
    view.hide(controlsScreen);
    view.hide(leaderboard);
    document.getElementById("ready").checked = false;
    showPlayersListOnStartScreen();
    // const checkbox = document.querySelector('label[for="ready"]');
    const msg = document.querySelector("#start-options p.msg");
    if (gameInProgress) {
        console.log("hide ready checkbox");
        // show "on deck" message
        msg.innerHTML = "game in progress.  you can join the next one.";
        // hide "ready" checkbox
        view.hide(ready);
    } else {
        // show "joining game" message
        msg.innerHTML = "the game will start when everyone’s ready";
        // show "ready" checkbox
        view.show(ready);
    }
};

const showControlsScreen = () => {
    view.show(controlsScreen);
    view.hide(startScreen);
    view.hide(brandScreen);
    view.hide(leaderboard);
};
const closeControlsScreen = () => {
    if (!namePromptIsClosed()) return;
    console.log("close controls-screen.");
    playSoundByNameString("click");
    view.hide(controlsScreen);
    showStartScreen();
};

// LISTENERS

ready.querySelector("#ready").addEventListener("change", (event) => {
    playSoundByNameString("chirp-select");
    imReady(event.target.checked);
});

window.addEventListener("resize", function () {
    console.log("resize");
    resizeCanvas();
    drawOnce();
});
document
    .getElementById("brand-screen")
    .addEventListener("pointerdown", closeBrandScreen);

document
    .getElementById("controls-screen")
    .addEventListener("pointerdown", closeControlsScreen);

document
    .getElementById("again-button")
    .addEventListener("pointerdown", (event) => {
        // event.target.classList.add("hidden");
        view.hide(event.target);
        view.hide(leaderboard)
        closeControlsScreen();
    });

export { showPlayersListOnStartScreen, showBrandScreen, showStartScreen,showControlsScreen };
