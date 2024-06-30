import { imReady, voteAllHere } from "./main.js";
// import { voteAllHere } from "./main.js";
const readyCheckBox = document.getElementById("ready");
const allHereCheckbox = document.getElementById("all-here");

readyCheckBox.addEventListener("change", (event) => {
    imReady(event.target.checked);
});

allHereCheckbox.addEventListener("change", (event) => {
    voteAllHere(event.target.checked);
});

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
