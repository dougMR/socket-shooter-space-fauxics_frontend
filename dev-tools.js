import { players, ships } from "./main.js";
const showPlayersButton = document.getElementById("show-players");
const showShipsButton = document.getElementById("show-ships");

// console.log("showPlayersButton: ", showPlayersButton);

showPlayersButton.addEventListener("pointerdown", (event) => {
    console.log("players:", players);
});

showShipsButton.addEventListener("pointerdown",event=>{
    console.log("ships: ",ships);
})

export { showPlayersButton };
