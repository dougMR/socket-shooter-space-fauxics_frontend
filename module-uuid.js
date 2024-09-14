// UUID Stuff
const setUUID = () => {
    const UUID = crypto.randomUUID();
    localStorage.setItem("UUID", UUID);
    return UUID;
};

const clearUUID = () => {
    // console.log("clearUUID()");
    localStorage.removeItem("UUID");
};

const getUUID = () => {
    // Do we have a recent session?
    let uuid = localStorage.getItem("UUID");
    console.log("getUUID() found:",uuid)
    if (uuid) {
        return uuid;
    }
    // it's been too long, or we have no uuid
    return false;
};

export { setUUID, getUUID, clearUUID };
