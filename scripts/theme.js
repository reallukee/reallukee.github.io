document.addEventListener("DOMContentLoaded", () => {
    const switchTheme = document.querySelector("#switchTheme");

    if (switchTheme) {
        switchTheme.addEventListener("click", () => {
            const currentTheme = window.GetTheme();

            switch (currentTheme) {
                case "auto": setTheme("light"); break;
                case "light": setTheme("dark"); break;
                case "dark": setTheme("auto"); break;
                default: break;
            }

            switchTheme.textContent = window.GetTheme();
        });

        document.addEventListener("DOMContentLoaded", () => {
            switchTheme.textContent = window.GetTheme();
        });

        switchTheme.textContent = window.GetTheme();
    }

    const autoTheme = document.querySelector("#autoTheme");
    const lightTheme = document.querySelector("#lightTheme");
    const darkTheme = document.querySelector("#darkTheme");

    if (autoTheme && lightTheme && darkTheme) {
        autoTheme.addEventListener("click", () => {
            const currentTheme = window.GetTheme();

            window.SetTheme("auto");

            document.querySelector(`#${currentTheme}Theme`).classList.remove("active");

            document.querySelector(`#autoTheme`).classList.add("active");
        });

        lightTheme.addEventListener("click", () => {
            const currentTheme = window.GetTheme();

            window.SetTheme("light");

            document.querySelector(`#${currentTheme}Theme`).classList.remove("active");

            document.querySelector(`#lightTheme`).classList.add("active");
        });

        darkTheme.addEventListener("click", () => {
            const currentTheme = window.GetTheme();

            window.SetTheme("dark");

            document.querySelector(`#${currentTheme}Theme`).classList.remove("active");

            document.querySelector(`#darkTheme`).classList.add("active");
        });

        const currentTheme = window.GetTheme();

        if (currentTheme != "auto") {
            document.querySelector(`#autoTheme`).classList.remove("active");

            document.querySelector(`#${currentTheme}Theme`).classList.add("active");
        }
    }
});
