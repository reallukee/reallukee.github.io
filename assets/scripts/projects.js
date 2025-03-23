(async () => {
    async function diplayProjects() {
        const projectTemplate = document.querySelector("#projectTemplate");
        const projectsContent = document.querySelector("#projectContent");

        if (!projectTemplate || !projectsContent) {
            return;
        }

        projectTemplateSource = projectTemplate.innerHTML;

        const projects = await fetch("./assets/contents/projects.json")
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .catch((error) => {
                throw error;
            });

        const data = {
            projects,
        };

        const projectTemplateHtml = ejs.render(projectTemplateSource, data);

        projectsContent.innerHTML = projectTemplateHtml;
    }

    await diplayProjects();
})();
