import { players, waitingPlayers, ships } from "./main.js";
const showPlayersButton = document.getElementById("show-players");
// const showWaitingPlayersButton = document.getElementById("show-waiting-players");
const showShipsButton = document.getElementById("show-ships");

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

export { showPlayersButton };
