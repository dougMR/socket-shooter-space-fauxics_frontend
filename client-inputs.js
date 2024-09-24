import { imReady,  players } from "./main.js";
import { playSoundByNameString } from "./module-sound.js";
import { drawOnce, resizeCanvas } from "./module-draw.js";
import { view } from "./view.js";
import { hideLeaders } from "./module-leaderboard.js";
// import(playSoundByNameString)
// import { voteAllHere } from "./main.js";
const readyCheckBox = document.getElementById("ready");
// const allHereCheckbox = document.getElementById("all-here");

readyCheckBox.addEventListener("change", (event) => {
    playSoundByNameString("chirp-select");
    imReady(event.target.checked);
});

// allHereCheckbox.addEventListener("change", (event) => {
//     playSoundByNameString("chirp-select");
//     voteAllHere(event.target.checked);
// });

// const allHerePrompt = document.getElementById("all-here-prompt");

// const hideAllHerePrompt = () => {
//     allHerePrompt.classList.add("hidden");
// };
// const showAllHerePrompt = () => {
//     allHerePrompt.classList.remove("hidden");
// };
// allHerePrompt.addEventListener("pointerdown", (event) => {
//     console.log("all-here-prompt clicked");
//     if (event.target.innerText === "YES") {
//         console.log("yes clicked");
//         hideAllHerePrompt();
//         voteAllHere(true);
//     } else if (event.target.innerText === "NO") {
//         hideAllHerePrompt();
//         voteAllHere(false);
//     }
// });

// LISTENERS
const showPlayersListOnStartScreen = async () => {
    if (view.isHidden(document.getElementById("start-options"))) return;
    // show list of players
    let playerListText = "<span style='color: white;'>Players:</span></ br>";
    for (const p of players) {
        console.log("SHOW:", p.name);
        playerListText += `<div class="leaderboard-entry"><p class="name"><span class="ship-icon" style="color:${p.ship.color};">&#9650;</span>&nbsp;${p.name}${p.onDeck ? "(waiting)": ""}</p><p class="connector" style="background-color:${p.ship.color};"></p></div>`;
    }
    // for (const wp of waitingPlayers) {
    //     playerListText += `<div class="leaderboard-entry"><p class="name">(waiting)<span class="ship-icon" style="color:${wp.ship.color};">&#9650;</span>&nbsp;${wp.name}</p><p class="connector" style="background-color:${wp.ship.color};"></p></div>`;
    // }
    const playerList = document.getElementById("players-list");
    playerList.innerHTML = playerListText;
};

const closeBrandScreen = () => {
    playSoundByNameString("click");
    // document.getElementById("brand-screen").classList.add("hidden");
    view.hide(document.getElementById("brand-screen"));
    // document.getElementById("controls-screen").classList.remove("hidden");
    showControlsScreen();
};

const showStartScreen = () => {
    view.show(document.getElementById("start-options"));
    document.getElementById("ready").checked = false;
    // document.getElementById("all-here").checked = false;
    showPlayersListOnStartScreen();
};

const showControlsScreen = () => {
    view.show(document.getElementById("controls-screen"));
}
const closeControlsScreen = () => {
    console.log("close controls-screen.");
    playSoundByNameString("click");
    // document.getElementById("controls-screen").classList.add("hidden");
    view.hide(document.getElementById("controls-screen"));
    // document.getElementById("start-options").classList.remove("hidden");
    showStartScreen();
};

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
        hideLeaders();
        closeControlsScreen();
    });

export { showPlayersListOnStartScreen };
