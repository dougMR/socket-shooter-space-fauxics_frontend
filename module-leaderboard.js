import { players, ships, clientPlayer } from "./main.js";
import serverURL from "./server-url.js";

const leaderboard = document.getElementById("leaderboard");
const leaderboardAllTime = document.getElementById("all-time-leaderboard");

const checkAlive = (player) => {
    return ships.some((s) => s.color === player.ship.color);
};

const sortPlayersByScore = (a, b) => {
    if (a.score > b.score) {
        return -1;
    }
    if (a.score > b.score) {
        return 1;
    }
    return 0;
};

const displayLeaders = () => {
    const inGamePlayers = players.filter((p) => !p.onDeck && p.connected).sort(sortPlayersByScore);
    if (inGamePlayers.length === 0) {
        view.hide(leaderboard);
        return;
    }
    let leadersText = "";
    for (const p of inGamePlayers) {
        leadersText += `<div class="leaderboard-entry${
            checkAlive(p) ? "" : " dead"
        }"><p class="name"><span class="ship-icon" style="color:${
            p.ship.color
        };">&#9650;</span>${
            p.name
        }</p><p class="connector" style="background-color:${
            p.ship.color
        };"></p><p class="score">${p.score}</p></div>`;
    }
    leaderboard.innerHTML = leadersText;
    leaderboard.classList.remove("hidden");
};

// const displayAllTimeLeaders = async () => {
//     console.log("Making API CALL");
//     // const response = await fetch(`${serverURL}leaderboard`);
//     // const data = await response.json();
//     // const leaders = data.leaders;

//     // Display (all-time) Leaders
//     const displayTopTen = (leaders) => {
//         let leadersText = "";
//         for (const p of leaders) {
//             leadersText += `<div class="leaderboard-entry${
//                 checkAlive(p) ? "" : " dead"
//             }"><p class="name"><span class="ship-icon" style="color:${
//                 p.ship.color
//             };">&#9650;</span>${
//                 p.name
//             }</p><p class="connector" style="background-color:${
//                 p.ship.color
//             };"></p><p class="score">${p.score}</p></div>`;
//         }
//         leaderboardAllTime.innerHTML = leadersText;
//         leaderboardAllTime.classList.remove("hidden");
//     };

//     getLeaderboard(displayTopTen);
//     // if(data.error){
//     //     setError(data.error);
//     // } else {
//     //     setError("");
//     //     // redirect to Admin, login successful
//     //     navigate("/admin");
//     // }
// };

// const hideLeaders = () => {
//     leaderboard.classList.add("hidden");
// };

// const submitScoreToLeaderboard = async (player) => {
//     console.log("submitScoreToLeaderboard()");

//     player = player ? player : clientPlayer;
//     console.log("player: ", player);
//     const response = await fetch(`${serverURL}leader`, {
//         method: "POST",
//         headers: {
//             "content-Type": "application/json",
//         },
//         body: JSON.stringify({ name: player.name, score: player.score }),
//         // credentials: "include",
//     });
// };

export {
    displayLeaders,
    // submitScoreToLeaderboard,
    // displayAllTimeLeaders,
};
