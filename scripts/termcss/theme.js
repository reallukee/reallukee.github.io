const Theme = {
    get: () => {
        return localStorage.getItem("Theme") ?? null;
    },

    set: (value) => {
        localStorage.setItem("Theme", value);
    },

    init: () => {
        Theme.set("auto");
    },
};



export function getTheme() {
    return Theme.get();
}

export function setTheme(newTheme) {
    const currentTheme = Theme.get();

    document.documentElement.classList.remove(`theme-${currentTheme}`);

    document.documentElement.classList.add(`theme-${newTheme}`);

    Theme.set(newTheme);
}

export function initTheme() {
    if (!Theme.get()) {
        Theme.init();
    }

    const currentTheme = Theme.get();

    if (currentTheme != "auto") {
        document.documentElement.classList.remove(`theme-auto`);

        document.documentElement.classList.add(`theme-${currentTheme}`);
    }
}

initTheme();



window.GetTheme = getTheme;
window.SetTheme = setTheme;
window.InitTheme = initTheme;
