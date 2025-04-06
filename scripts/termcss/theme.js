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

const ThemeColors =  {
    auto: "#111111",
    light: "#EEEEEE",
    dark: "#111111",
};

export function getTheme() {
    return Theme.get();
}

export function setTheme(newTheme) {
    const currentTheme = Theme.get();

    document.documentElement.classList.remove(`theme-${currentTheme}`);
    document.documentElement.classList.add(`theme-${newTheme}`);

    const themeColor = document.querySelector('meta[name="theme-color"]');

    if (!themeColor) {
        const themeColor = document.createElement("meta");

        themeColor.name = "theme-color";

        document.head.appendChild(themeColor);
    }

    themeColor.setAttribute("content", ThemeColors[newTheme]);

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

        const themeColor = document.querySelector('meta[name="theme-color"]');

        if (!themeColor) {
            const themeColor = document.createElement("meta");

            themeColor.name = "theme-color";

            document.head.appendChild(themeColor);
        }

        themeColor.setAttribute("content", ThemeColors[currentTheme]);
    }
}

initTheme();

window.GetTheme = getTheme;
window.SetTheme = setTheme;
window.InitTheme = initTheme;
