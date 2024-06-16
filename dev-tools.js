import { players } from "../server_side/module-players.js";
const showPlayersButton = document.getElementById("show-players");

console.log("showPlayersButton: ", showPlayersButton);

showPlayersButton.addEventListener("pointerdown", (event) => {
    console.log("players:", players);
});

export { showPlayersButton };
