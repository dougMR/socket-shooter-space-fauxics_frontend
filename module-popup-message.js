const popupMessage = (message) => {
    const messageBox = document.createElement(`div`);
    messageBox.setAttribute(
        "style",
        "position: absolute; top:0; left: 0; width: 100vw; height: 100%; z-index: 10000; background-color: #00000077; display: flex; align-items: center; justify-content: center;"
    );
    messageBox.innerHTML = `<h3>${message}</h3>`;
    messageBox
        .querySelector("h3")
        .setAttribute(
            "style",
            "font-size: 4vmin; font-family: monospace; padding: 1em; border-radius: 1em; box-shadow: 0 1em 1em #00000077; text-align: center; background-color: #fefefe; color: #333;"
        );
    const closePopup = () => {
        if (document.getElementById("game-holder").contains(messageBox)) {
            document.getElementById("game-holder").removeChild(messageBox);
        }
    };
    messageBox.addEventListener("pointerdown", (event) => {
        closePopup();
    });

    document.getElementById("game-holder").appendChild(messageBox);
    setTimeout(() => {
        closePopup();
    }, 8000);
};
export { popupMessage };
