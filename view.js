const view = {
    show: (element) => {
        element.classList.remove("hidden");
    },
    hide: (element) => {
        element.classList.add("hidden");
    },
    isHidden: (element) => {
        return element.classList.contains("hidden");
    }
};

export { view };
