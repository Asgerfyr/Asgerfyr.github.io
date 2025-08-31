document.addEventListener("DOMContentLoaded", () => {
    Project.getProjectData();
});


class ProjectObject {
    constructor() {

        const params = new URLSearchParams(window.location.search);
        this.project = params.get("project");
        if (!this.project) Error404();
        if (this.project == "404") Error404();

        this.icons = [];

        this.imageShowcaseContainer = document.getElementById("image_showcase_container");
        this.imageShowcase = document.getElementById("image_showcase");
    }

    async getIcons() {
        try {
            const response = await fetch("/data/utility/project_icons.json");
            const data = await response.json();
            if (!data) throw new Error(`Fetched data form icons.json is undefined`);
            return data;
        } catch (error) {
            console.error("Icon error:", error);
        }
    }


    async getProjectData() {

        try {
            const response = await fetch(`/data/projects/${this.project.replaceAll(" ", "_")}.json`);
            if (!response.ok) {Error404();}
            const data = await response.json();
            if (!data) throw new Error(`Fetched data form ${this.project} is undefined`);
            await this.getIcons().then(data => this.icons = data);
            this.insertProject(data);
        } catch (error) {
            console.error("Project error:", error);
        }

    }


    insertProject(data_) {

        try {
            if (!data_.info) throw new Error(`info in ${this.project} is undefined`);
            this.insertInfo(data_.info);
        } catch (error) {
            console.error("Insert info error:", error);
        }

        try {
            if (!data_.overview) throw new Error(`overview in ${this.project} is undefined`);
            this.insertTitleOverview(data_.overview);
        } catch (error) {
            console.error("Insert overview error:", error);
        }

        try {
            if (!data_.sections) throw new Error(`Sections in ${this.project} is undefined`);
            this.insertContent(data_.sections);
        } catch (error) {
            console.error("Insert Sections error:", error);
        }

        try {
            if (!data_.conclusion) throw new Error(`conclusion in ${this.project} is undefined`);
            this.insertConclusion(data_.conclusion);
        } catch (error) {
            console.error("Insert conclusion error:", error);
        }

        this.addImageShowcaseEventListeners();
        addSmoothScrolling();
        hljs.highlightAll();
    }

    insertTitleOverview(overview_) {

        const { description, objectives, features, images } = overview_;

        Object.entries({ description, objectives, features, images }).forEach(([key, value]) => {
            if (!value) throw new Error(`Element ${key} is undefined`);
        });

        document.getElementById("project-title").innerHTML = `${this.project}`;

        document.querySelector("title").innerHTML = `${this.project} Documentation`;

        const overview_container = document.getElementById("overview");

        overview_container.querySelector("#description").innerHTML = description;

        const objectives_container = overview_container.querySelector("#objectives-list");

        objectives_container.innerHTML = "";

        objectives.forEach((objective) => {
            const objective_element = document.createElement("li");
            objective_element.innerHTML = objective;
            objectives_container.appendChild(objective_element);
        })

        const features_container = overview_container.querySelector("#features");

        features_container.innerHTML = "";

        features.forEach((feature) => {
            const container = document.createElement("div");
            container.classList = "flex items-start";

            let icon = this.icons[feature.icon];

            if (!icon) {
                console.error(`missing icon for ${feature.icon}`);
                icon = this.icons["missingIcon"];
            }

            const icon_container = document.createElement("div");
            icon_container.classList = `bg-${icon.color}-100 p-3 rounded-full mr-3 w-7 flex justify-center items-center`;

            const icon_element = document.createElement("i");
            icon_element.classList = `fas fa-${icon.name} text-${icon.color}-500`;
            icon_container.appendChild(icon_element);

            container.appendChild(icon_container);


            const content_container = document.createElement("div");

            const title = document.createElement("h4");
            title.classList = "font-medium";
            title.innerHTML = feature.title;

            const description = document.createElement("p");
            description.classList = "text-sm text-gray-500";
            description.innerHTML = feature.description;

            content_container.appendChild(title);
            content_container.appendChild(description);

            container.appendChild(content_container);

            features_container.appendChild(container);
        })

        try {
            this.insertImages(overview_container, images);
        } catch (error) {
            throw new Error("image Insert:", error);
        }

    }


    insertContent(sections_) {
        const sections_container = document.getElementById("main-sections");

        sections_.forEach((section) => {
            try {
                const section_element = this.createSection(section);
                sections_container.appendChild(section_element);
            } catch (error) {
                console.error(`Section error on ${section.title}:`, error);
            }
        });
    }

    createSection(section_) {
        const { icon, title, content } = section_;

        Object.entries({ icon, title, content }).forEach(([key_, value_]) => {
            if (!value_) throw new Error(`Element ${key_} is undefined`);
        });

        const elementid = "_" + title.replaceAll(" ", "_");
        const section_container = document.createElement("section");
        section_container.classList = "section-anchor mb-16";
        section_container.id = elementid;

        //Insert a nav-link to the section 
        const nav_links = document.getElementById("nav-links");
        const nav_link = document.createElement("a");
        nav_link.classList = "nav-link";
        nav_link.innerHTML = title;
        nav_link.href = `#${elementid}`;

        const conclusion_nav_link = document.getElementById("conclusion-link");

        nav_links.insertBefore(nav_link, conclusion_nav_link);

        //insert bottom quick-link at end of page to the section
        const quick_links = document.getElementById("quick-links");
        const quick_link_container = document.createElement("li");
        const quick_link = document.createElement("a");
        quick_link.classList = "quick-link";
        quick_link.innerHTML = title;
        quick_link.href = `#${elementid}`;

        quick_link_container.appendChild(quick_link);

        quick_links.appendChild(quick_link_container);


        const documentation_container = document.createElement("div");
        documentation_container.classList = "bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8";

        const documentation_header = document.createElement("div");
        documentation_header.classList = "flex items-center mb-6";

        let icon_object = this.icons[icon];
        if (!icon_object) {
            console.error(`missing icon for Section ${title}`);
            icon_object = this.icons["missingIcon"];
        }

        const icon_element = document.createElement("i");
        icon_element.classList = `fas fa-${icon_object.name} text-blue-500 text-2xl mr-3`;

        const documentation_title = document.createElement("h2");
        documentation_title.classList = "text-2xl font-bold";
        documentation_title.innerHTML = `${title} Documentation`;

        documentation_header.appendChild(icon_element);
        documentation_header.appendChild(documentation_title);

        documentation_container.appendChild(documentation_header);

        const documentation_content = document.createElement("div");
        documentation_content.classList = "section-grid-container";


        // Create the content of the section  / subsections
        Object.entries(content).forEach(([key_, sub_sections_]) => {
            try {
                Object.entries({ key_, sub_sections_ }).forEach(([key__, value__]) => {
                    if (!value__) throw new Error(`Element ${key__} is undefined`);
                });

                const sub_section_element = this.createSubSection(key_, sub_sections_);
                documentation_content.appendChild(sub_section_element);

            } catch (error) {
                console.error(`Sub Section error on ${key_}:`, error);
            }
        });

        documentation_container.appendChild(documentation_content);

        section_container.appendChild(documentation_container);

        if (!section_.images) return section_container;

        let { image_title, image_elements } = section_.images;

        if (!image_elements) throw new Error(`image_elements is undefined`);

        if (!image_title) image_title = "images";

        const images_container = document.createElement("div");
        images_container.classList = "bg-white rounded-xl shadow-md overflow-hidden p-6";

        const images_header = document.createElement("h3");
        images_header.classList = "text-xl font-semibold mb-6 flex items-center";

        const header_icon = document.createElement("i");
        header_icon.classList = "fas fa-images text-blue-500 mr-3";

        images_header.appendChild(header_icon);
        images_header.innerHTML += `${title} ${image_title}`;

        images_container.appendChild(images_header);

        const image_gallery = document.createElement("div");
        image_gallery.classList = "image-gallery";

        images_container.appendChild(image_gallery);

        try {
            this.insertImages(image_gallery, image_elements);
        } catch (error) {
            console.error("Section image insert:", error);
        }

        section_container.appendChild(images_container);

        return section_container;

    }

    createSubSection(key_, sub_sections_) {

        const subSection = document.createElement("div");

        const header = document.createElement("h3");
        header.classList = "text-xl font-bold mb-4";
        header.innerHTML = (key_.toLowerCase()=="null") ? "" : key_;

        subSection.appendChild(header);

        const typeDictionary = { "text": this.createTextSubSection, "code": this.createCodeSubSection, "list": this.createListSubSection, "checklist": this.createChecklistSubSection, "table": this.createTableSubSection };

        sub_sections_.forEach((sub_section_) => {
            try {
                const { type, content } = sub_section_;

                Object.entries({ type, content }).forEach(([key_, value_]) => {
                    if (!value_) throw new Error(`Element ${key_} is undefined`);
                });

                const sub_section_create_function = typeDictionary[type];

                if (!sub_section_create_function) throw new Error(`type ${type} is not supported`);

                const sub_section_element = sub_section_create_function(sub_section_);
                subSection.appendChild(sub_section_element);


            } catch (error) {
                console.error(`Sub Section error on ${key_}:`, error);
            }

        });

        return subSection;

    }

    createTextSubSection(sub_sections_) {
        const sub_section = document.createElement("p");
        sub_section.classList = "text-gray-600 mb-4";
        sub_section.innerHTML = sub_sections_.content;
        return sub_section;
    }

    createCodeSubSection(sub_sections_) {

        const sub_section = document.createElement("div");
        sub_section.classList = "bg-gray-800 text-white rounded-lg p-2 text-sm";

        const code_container = document.createElement("pre");

        const code_element = document.createElement("code");
        code_element.innerHTML = sub_sections_.content;
        if (!!sub_sections_.language) code_element.classList = `language-${sub_sections_.language}`;

        code_container.appendChild(code_element);
        sub_section.appendChild(code_container);

        return sub_section;
    }

    createListSubSection(sub_sections_) {

        const sub_section = document.createElement("ul");
        sub_section.classList = "list-disc pl-6 space-y-2 text-gray-600 mb-4";

        sub_sections_.content.forEach((item) => {
            const item_element = document.createElement("li");
            item_element.innerHTML = item;
            sub_section.appendChild(item_element);
        })

        return sub_section;
    }

    createChecklistSubSection(sub_sections_) {

        const sub_section = document.createElement("div");
        sub_section.classList = "bg-gray-100 rounded-lg p-4";

        const list_container = document.createElement("ul");
        list_container.classList = "space-y-2";

        sub_sections_.content.forEach((item) => {

            const { checked, text } = item;

            Object.entries({ checked, text }).forEach(([key_, value_]) => {
                if (value_ === undefined) throw new Error(`Element ${key_} is undefined`);
            });

            const item_container = document.createElement("li");
            item_container.classList = "flex items-center";

            const item_check_class = checked ? "check-circle text-green" : "times-circle text-red";

            const icon_element = document.createElement("i");
            icon_element.classList = `fas fa-${item_check_class}-500 mr-2`;

            const item_element = document.createElement("span");
            item_element.innerHTML = text;

            item_container.appendChild(icon_element);
            item_container.appendChild(item_element);

            list_container.appendChild(item_container);
        })

        sub_section.appendChild(list_container);

        return sub_section;
    }

    createTableSubSection(sub_sections_) {

        const { headers, rows } = sub_sections_.content;

        Object.entries({ headers, rows }).forEach(([key_, value_]) => {
            if (!value_) throw new Error(`Element ${key_} is undefined`);
        })

        const sub_section = document.createElement("div");
        sub_section.classList = "table-overflow bg-gray-100 rounded-lg p-4";

        const table_container = document.createElement("table");
        table_container.classList = "w-full";

        const table_head_container = document.createElement("thead");
        const table_head_row = document.createElement("tr");
        table_head_row.classList = "border-b";

        headers.forEach((header) => {
            const table_head_cell = document.createElement("th");
            table_head_cell.classList = "text-left py-2 px-2";
            table_head_cell.innerHTML = header;
            table_head_row.appendChild(table_head_cell);
        })
        table_head_container.appendChild(table_head_row);
        table_container.appendChild(table_head_container);

        const table_body_container = document.createElement("tbody");

        rows.forEach((row, index) => {
            const table_body_row = document.createElement("tr");

            if (index < rows.length - 1) table_body_row.classList = "border-b";

            row.forEach((cell) => {
                const table_body_cell = document.createElement("td");
                table_body_cell.classList = "py-2";
                table_body_cell.innerHTML = cell;
                table_body_row.appendChild(table_body_cell);
            })

            table_body_container.appendChild(table_body_row);

        });

        table_container.appendChild(table_body_container);
        sub_section.appendChild(table_container);

        return sub_section;
    }



    insertImages(container_, images_) {

        const image_container = (!container_.classList.contains("image-gallery")) ? container_.querySelector(".image-gallery") : container_;

        if (!image_container) throw new Error(`Element image-gallery is undefined`);

        images_.forEach((image) => {

            const { url, alt, title, caption } = image;

            Object.entries({ url, alt, title, caption }).forEach(([key, value]) => {
                if (!value) throw new Error(`Element ${key} in image is undefined`);
            });

            const htmlString = `
                <div class="image-card bg-white rounded-lg shadow-md overflow-hidden">
                    <img src="${url}" alt="${alt}" class="w-full h-48 object-cover">
                    <div class="p-4">
                        <h4 class="font-medium">${title}</h4>
                        <p class="text-sm text-gray-500">${caption}</p>
                    </div>
                </div>
            `;

            image_container.innerHTML += htmlString;

        });

    }

    addImageShowcaseEventListeners() {
        const imageCards = document.querySelectorAll(".image-card");

        imageCards.forEach((card) => {
            card.addEventListener("mouseenter", () => {
                const img = card.querySelector("img");
                this.imageShowcase.src = img.src;
                this.imageShowcase.alt = img.alt;
                this.imageShowcaseContainer.classList.remove("invis");
            });

            card.addEventListener("mouseleave", () => {
                this.imageShowcaseContainer.classList.add("invis");
            });
        });
    }


    insertConclusion(conclusion_) {

        const { results, metrics, learned, improvements } = conclusion_;

        Object.entries({ results, metrics, learned, improvements }).forEach(([key, value]) => {
            if (!value) throw new Error(`Element ${key} is undefined`);
        });

        const conclusion_container = document.getElementById("conclusion");

        conclusion_container.querySelector("#results").innerHTML = results;


        const metrics_container = conclusion_container.querySelector("#metrics");
        metrics_container.innerHTML = "";

        metrics.forEach((metric) => {
            const container = document.createElement("div");
            container.classList = "flex items-center";

            let icon = this.icons[metric.icon];

            if (!icon) {
                console.error(`missing icon for ${metric.icon}`);
                icon = this.icons["missingIcon"];
            }

            const icon_container = document.createElement("div");
            icon_container.classList = `bg-${icon.color}-100 p-3 rounded-full mr-4`;

            const icon_element = document.createElement("i");
            icon_element.classList = `fas fa-${icon.name} text-${icon.color}-500`;
            icon_container.appendChild(icon_element);

            container.appendChild(icon_container);


            const content_container = document.createElement("div");

            const title = document.createElement("h4");
            title.classList = "font-medium";
            title.innerHTML = metric.title;

            const description = document.createElement("p");
            description.classList = "text-sm text-gray-500";
            description.innerHTML = metric.result;

            content_container.appendChild(title);
            content_container.appendChild(description);

            container.appendChild(content_container);

            metrics_container.appendChild(container);
        })

        conclusion_container.querySelector("#learned").innerHTML = learned;

        const improvements_container = conclusion_container.querySelector("#improvements-list");

        improvements_container.innerHTML = "";

        improvements.forEach((improvement) => {
            const improvement_element = document.createElement("li");
            improvement_element.innerHTML = improvement;
            improvements_container.appendChild(improvement_element);
        })

    }

    insertInfo(info) {
        const { completion_date, team_size, duration, team_members } = info;

        Object.entries({ completion_date, team_size, duration }).forEach(([key, value]) => {
            if (!value) throw new Error(`Element ${key} is undefined`);
        });

        document.getElementById("completion-date").innerHTML = completion_date;
        document.getElementById("team-size").innerHTML = team_size;
        document.getElementById("duration").innerHTML = duration;

        if(!team_members) return;

        const footer_grid = document.getElementById("footer-grid");
        footer_grid.classList.remove("md:grid-cols-3");
        footer_grid.classList.add("md:grid-cols-4");

        const team_members_container = document.createElement("div")
        team_members_container.innerHTML=
        `
        <h3 class="text-lg font-semibold mb-4">Project Team</h3>
        <ul id="team-members" class="text-gray-400 space-y-2">
        </ul>
        `;

        footer_grid.appendChild(team_members_container);

        const team_members_list = team_members_container.querySelector("#team-members");

        team_members.forEach((member)=> {

            const name_string = (!member.link)?member.name: `<a href="${member.link}" target="_blank">${member.name}</a>`;

            const member_element = document.createElement("li")
            member_element.innerHTML = 
            `
                <i class="fas fa-user mr-2"></i>
                <div> <div>${name_string}</div> <div>${member.role}</div></div>
            `;
            member_element.classList = "flex items-center";

            team_members_list.appendChild(member_element);
        });
        
    }



}


const Project = new ProjectObject();



function Error404() {
    window.location.href = "/pages/project404.html";
}
