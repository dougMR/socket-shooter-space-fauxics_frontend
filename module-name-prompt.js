import { joinGame, connectToServer } from "./main.js";
const namePrompt = document.getElementById("name-prompt");
const nameInput = document.getElementById("player-name");
const showNamePrompt = () => {
    console.log("showNamePrompt()");
    namePrompt.classList.remove("hidden");
};
const hideNamePrompt = () => {
    console.log("hideNamePrompt()");
    namePrompt.classList.add("hidden");
};
namePrompt.querySelector(".ok").addEventListener("pointerdown", (event) => {
    const playerName = nameInput.value;
    if (playerName) {
        connectToServer();
        joinGame(playerName);
        // hideNamePrompt();
    }
});

export { showNamePrompt, hideNamePrompt };
