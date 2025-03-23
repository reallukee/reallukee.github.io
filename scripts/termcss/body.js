document.addEventListener("DOMContentLoaded", () => {
    const titles = document.querySelectorAll(".section-title .section-content");

    titles.forEach((title) => {
        const textContent = title.textContent.trim();
        const line = "-".repeat(textContent.length);

        title.textContent = `${line}\n${textContent}\n${line}`;
    });

    const subtitles = document.querySelectorAll(".section-subtitle .section-content");

    subtitles.forEach((subtitle) => {
        const textContent = subtitle.textContent.trim();
        const line = "-".repeat(textContent.length);

        subtitle.textContent = `${line}\n${textContent}\n${line}`;
    });

    const texts = document.querySelectorAll(".section-text .section-content");

    texts.forEach((text) => {
        const textContent = text.textContent.trim();
        const line = "-".repeat(textContent.length);

        text.textContent = `${line}\n${textContent}\n${line}`;
    });
});
