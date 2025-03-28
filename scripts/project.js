(async () => {
    const params = new URLSearchParams(location.search);

    const projectParam = params.get("project") ?? null;

    async function getContent() {
        let project = await fetch("./contents/projects.json")
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .catch((error) => {
                throw error;
            });

        if (projectParam) {
            project.content = project.content.filter((project) => {
                return project.id === projectParam;
            });
        }

        return project;
    }

    async function diplayProject(project) {
        if (!project) {
            return;
        }

        const projectTemplate = document.querySelector("#projectTemplate");
        const projectContent = document.querySelector("#projectContent");

        if (!projectTemplate || !projectContent) {
            return;
        }

        projectTemplateSource = projectTemplate.innerHTML;

        const data = {
            project: project.content[0],
        };

        const projectTemplateHtml = ejs.render(projectTemplateSource, data);

        projectContent.innerHTML = projectTemplateHtml;
    }

    const project = await getContent();

    await diplayProject(project);

    window.RenderBody();
})();
