const popupMessage = (message) => {
    const messageBox = document.createElement(`div`);
    messageBox.setAttribute(
        "style",
        "font-size: 2rem; font-family: monospace; position: fixed; top:0; left: 0; width: 100vw; height: 100vh; z-index: 10000; background-color: #00000077; display: flex; align-items: center; justify-content: center;"
    );
    messageBox.innerHTML = `<h3>${message}</h3>`;
    messageBox
        .querySelector("h3")
        .setAttribute(
            "style",
            "padding: 1em; border-radius: 1em; box-shadow: 0 1em 1em #00000077; text-align: center; background-color: #eeeeee;"
        );
    const closePopup = () => {
        if (document.body.contains(messageBox)) {
            document.body.removeChild(messageBox);
        }
    };
    messageBox.addEventListener("pointerdown", (event) => {
        closePopup();
    });

    document.body.appendChild(messageBox);
    setTimeout(() => {
        closePopup();
    }, 8000);
};
export { popupMessage };
