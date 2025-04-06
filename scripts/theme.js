document.addEventListener("DOMContentLoaded", () => {
    function setTheme(theme) {
        const currentTheme = window.GetTheme();

        window.SetTheme(theme);

        document.querySelector(`#${currentTheme}Theme`).classList.remove("active");
        document.querySelector(`#${theme}Theme`).classList.add("active");
    }

    const autoTheme = document.querySelector("#autoTheme");
    const lightTheme = document.querySelector("#lightTheme");
    const darkTheme = document.querySelector("#darkTheme");

    if (autoTheme && lightTheme && darkTheme) {
        autoTheme.addEventListener("click", () => {
            setTheme("auto");
        });

        lightTheme.addEventListener("click", () => {
            setTheme("light");
        });

        darkTheme.addEventListener("click", () => {
            setTheme("dark");
        });

        const currentTheme = window.GetTheme();

        if (currentTheme !== "auto") {
            const currentTheme = window.GetTheme();

            document.querySelector(`#autoTheme`).classList.remove("active");
            document.querySelector(`#${currentTheme}Theme`).classList.add("active");
        }
    }
});
