(async () => {
    const params = new URLSearchParams(location.search);

    const licenseParam = params.get("license") ?? null;
    const languageParam = params.get("language") ?? null;
    const tagParam = params.get("tag") ?? null;

    async function getContent() {
        let projects = await fetch("./contents/projects.json")
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then((data) => {
                return data.content.sort((a, b) => {
                    return b.pinned - a.pinned;
                });
            })
            .catch((error) => {
                throw error;
            });

        if (licenseParam) {
            projects = projects.filter((project) => {
                return project.license === licenseParam;
            });
        }

        if (languageParam) {
            projects = projects.filter((project) => {
                return project.languages.some((language) => {
                    return language.id === languageParam;
                });
            });
        }

        if (tagParam) {
            projects = projects.filter((project) => {
                return project.tags.some((tag) => {
                    return tag.id === tagParam;
                });
            });
        }

        return projects;
    }

    async function diplayProjects(projects) {
        if (!projects) {
            return;
        }

        const projectsTemplate = document.querySelector("#projectsTemplate");
        const projectsContent = document.querySelector("#projectsContent");

        if (!projectsTemplate || !projectsContent) {
            return;
        }

        projectTemplateSource = projectsTemplate.innerHTML;

        const data = {
            projects: projects,
        };

        const projectTemplateHtml = ejs.render(projectTemplateSource, data);

        projectsContent.innerHTML = projectTemplateHtml;
    }

    const projects = await getContent();

    await diplayProjects(projects);

    window.RenderBody();
})();
