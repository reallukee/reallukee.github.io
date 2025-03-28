export function renderBody() {
    const titles = document.querySelectorAll(".section-title .section-content");

    titles.forEach((title) => {
        if (!title.classList.contains("rendered")) {
            const textContent = title.textContent.trim();

            const line = "-".repeat(textContent.length + 4);

            title.textContent = `${line}\n+ ${textContent} +\n${line}`;

            title.classList.add("rendered");
        }
    });

    const subtitles = document.querySelectorAll(".section-subtitle .section-content");

    subtitles.forEach((subtitle) => {
        if (!subtitle.classList.contains("rendered")) {
            const textContent = subtitle.textContent.trim();

            const line = "-".repeat(textContent.length + 4);

            subtitle.textContent = `${line}\n+ ${textContent} +\n${line}`;

            subtitle.classList.add("rendered");
        }
    });

    const texts = document.querySelectorAll(".section-text .section-content");

    texts.forEach((text) => {
        if (!text.classList.contains("rendered")) {
            const textContent = text.textContent.trim();

            const line = "-".repeat(textContent.length + 4);

            text.textContent = `${line}\n+ ${textContent} +\n${line}`;

            text.classList.add("rendered");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderBody();
});

window.RenderBody = renderBody;
