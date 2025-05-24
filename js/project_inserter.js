

document.addEventListener("DOMContentLoaded", () => {
    Project.get_porject_data_frontpage("data/frontpage_project.json");
});




class ProjectObject {
    constructor() {

        this.siteFilterAmountConfig = { "minSize": { "width": 330, "filters": 2 }, "maxSize": { "width": 1000, "filters": 5 } }


        this.categorys = [];
    }


    async get_porject_data_frontpage(json_url) {
        try {
            const response = await fetch(json_url);
            const data = await response.json();
            this.insert_projects_to_section(data);
            this.filterSetup();
        } catch (error) {
        }
    }


    insert_projects_to_section(data_) {
        let project_section = document.querySelector("#projects");

        let project_grid = project_section.querySelector("#projects-grid");

        Object.entries(data_).forEach(([key, project]) => {
            try {
                this.validateProject(project);
                this.insert_project({ project_grid, key, project });
                this.insert_project_to_modal({ key, project });
                this.closeModalWhenClickOutsideSetup();
            } catch (error) {
            }
        })
        this.getCommonFilters(data_);
        this.setupFilters();

    }

    validateProject(project) {
        if (!project) throw new Error(`Project is undefined`);
        if (typeof project.title !== "string") throw new Error(`title is missing not a string`);
        if (typeof project.image !== "string") throw new Error(`image is missing not a string`);
        if (typeof project.sub_description !== "string") throw new Error(`sub_description is missing not a string`);
        if (typeof project.description !== "string") throw new Error(`description is missing not a string`);
        if (typeof project.topics !== "object") throw new Error(`topics is missing not a array`);
        if (typeof project.topicsSummery !== "object") throw new Error(`topicsSummery is missing not a array`);
        if (typeof project.category !== "object") throw new Error(`category is missing not a array`);
        if (typeof project.date !== "string") throw new Error(`date is missing not a string`);
        if (typeof project.link !== "string") throw new Error(`link is missing not a string`);
    }

    setupFilters() {
        this.changeFilters();

        window.addEventListener("resize", () => this.changeFilters());
    }

    changeFilters() {
        const filterButtonsContainer = document.querySelector(`.project-filters`);

        const filterButtons = [...filterButtonsContainer.querySelectorAll(`.filter-btn`)];

        const screenWidth = window.innerWidth;

        const {
            minSize: { width: minWidth, filters: minFilters },
            maxSize: { width: maxWidth, filters: maxFilters }
        } = this.siteFilterAmountConfig;

        let mapped = map(screenWidth, minWidth, maxWidth, minFilters, maxFilters);
        mapped = constrain(mapped, minFilters, maxFilters);
        const targetFilterAmount = Math.floor(mapped) + 1; // +1 for "all" filter button

        console.log(targetFilterAmount);

        if (targetFilterAmount == filterButtons.length) return;

        if (targetFilterAmount < filterButtons.length) {
            const filtersToRemove = filterButtons.length - targetFilterAmount - 1; //-1 da arrays er 0 indexet
            filterButtons.reverse().forEach((button, index) => {
                if (index > filtersToRemove) return
                button.remove();
            })
            filterButtons.at(filtersToRemove+1).classList.add("rounded-r");
            return;
        }

        filterButtons.at(-1).classList.remove("rounded-r");

        const currentFilterIndex = filterButtons.length-1;

        for (let i = currentFilterIndex; i < targetFilterAmount-1; i++) {
            const filterButton = document.createElement("button");
            filterButton.className = "filter-btn px-4 py-2 text-sm font-medium bg-white text-gray-700";
            if (i == targetFilterAmount - 2) filterButton.classList.add("rounded-r");
            filterButton.dataset.filter = this.categorys[i];
            filterButton.textContent = this.categorys[i];
            filterButtonsContainer.appendChild(filterButton);
        }

    }

    getCommonFilters(data_) {

        let filters = {};

        Object.values(data_).forEach(project => {
            project.category.forEach(category => {
                if (!filters[category]) filters[category] = 0;
                filters[category] += 1;
            })
        });

        const sortetFilters = Object.fromEntries(Object.entries(filters).sort(([, a], [, b]) => b - a));

        this.categorys = Object.keys(sortetFilters);

        console.log(this.categorys);

        return;
    }

    insert_project({ project_grid, key, project }) {
        const card = document.createElement("div");
        card.className = "project-card";
        card.classList.add(...project.category);
        card.id = `Project-${key}`;
        card.onclick = () => this.openModal(key);

        const imageWrap = document.createElement("div");
        imageWrap.className = "h-48 overflow-hidden";

        const image = document.createElement("img");
        image.src = project.image;
        image.alt = project.title;
        image.className = "project-image transition duration-500 hover:scale-110";

        imageWrap.appendChild(image);

        const content = document.createElement("div");
        content.className = "p-6";

        const title = document.createElement("h3");
        title.className = "text-xl font-semibold mb-2";
        title.textContent = project.title;

        const description = document.createElement("p");
        description.className = "text-gray-600 mb-4";
        description.textContent = project.sub_description;

        content.appendChild(title);
        content.appendChild(description);

        const topics = document.createElement("div");
        topics.className = "flex flex-wrap gap-2";

        project.topicsSummery.forEach(topic => {
            const topicElement = document.createElement("span");
            topicElement.className = "bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded";
            topicElement.textContent = topic;
            topics.appendChild(topicElement);
        });

        content.appendChild(topics);


        card.appendChild(imageWrap);
        card.appendChild(content);
        project_grid.appendChild(card);
    }

    insert_project_to_modal({ key, project }) {
        const modal = document.createElement("div");
        modal.id = `${key}-modal`;
        modal.className = "modal fixed inset-0 z-50 flex items-center justify-center opacity-0 pointer-events-none";

        const modalOverlay = document.createElement("div");
        modalOverlay.className = "modal-overlay absolute inset-0";
        modal.appendChild(modalOverlay);

        const modalContainer = document.createElement("div");
        modalContainer.className = "modal-container bg-white w-11/12 md:max-w-3xl mx-auto rounded shadow-lg z-50 overflow-y-auto max-h-screen";

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content py-4 text-left px-6";

        const modalHeader = document.createElement("div");
        modalHeader.className = "flex justify-between items-center pb-3";

        const modalTitle = document.createElement("h3");
        modalTitle.className = "text-2xl font-bold";
        modalTitle.textContent = project.title;
        modalHeader.appendChild(modalTitle);

        const closeButton = document.createElement("button");
        closeButton.className = "text-gray-600 hover:text-gray-800 transition";
        closeButton.innerHTML = `<i class="fas fa-times"></i>`;
        closeButton.onclick = () => this.closeModal();
        modalHeader.appendChild(closeButton);

        modalContent.appendChild(modalHeader);

        const modalImageContainer = document.createElement("div");
        modalImageContainer.className = "mb-6 h-64";

        const modalImage = document.createElement("img");
        modalImage.src = project.image;
        modalImage.alt = project.title;
        modalImage.className = "project-image rounded-lg";

        modalImageContainer.appendChild(modalImage);
        modalContent.appendChild(modalImageContainer);

        const modalSpecifications = document.createElement("div");
        modalSpecifications.className = "grid grid-cols-1 md:grid-cols-3 gap-6 mb-6";

        const modalCategoryContainer = document.createElement("div");
        modalCategoryContainer.className = "bg-gray-100 p-4 rounded-lg";

        const modalCategoryTitle = document.createElement("h4");
        modalCategoryTitle.className = "font-semibold mb-2";
        modalCategoryTitle.textContent = "Category";
        modalCategoryContainer.appendChild(modalCategoryTitle);

        const modalCategoryValue = document.createElement("p");
        modalCategoryValue.className = "text-gray-700";
        modalCategoryValue.textContent = project.category.join(" / ");
        modalCategoryContainer.appendChild(modalCategoryValue);

        const modalDateContainer = document.createElement("div");
        modalDateContainer.className = "bg-gray-100 p-4 rounded-lg";

        const modalDateTitle = document.createElement("h4");
        modalDateTitle.className = "font-semibold mb-2";
        modalDateTitle.textContent = "Date";
        modalDateContainer.appendChild(modalDateTitle);

        const modalDateValue = document.createElement("p");
        modalDateValue.className = "text-gray-700";
        modalDateValue.textContent = project.date;
        modalDateContainer.appendChild(modalDateValue);

        modalSpecifications.appendChild(modalCategoryContainer);
        modalSpecifications.appendChild(modalDateContainer);

        modalContent.appendChild(modalSpecifications);

        const modalDescriptionContainer = document.createElement("div");
        modalDescriptionContainer.className = "mb-6";

        const modalDescriptionTitle = document.createElement("h4");
        modalDescriptionTitle.className = "font-semibold mb-2";
        modalDescriptionTitle.textContent = "Description";
        modalDescriptionContainer.appendChild(modalDescriptionTitle);

        const modalDescriptionValue = document.createElement("p");
        modalDescriptionValue.className = "text-gray-700";
        modalDescriptionValue.textContent = project.description;
        modalDescriptionContainer.appendChild(modalDescriptionValue);

        modalContent.appendChild(modalDescriptionContainer);

        const modalTopicsContainer = document.createElement("div");
        modalTopicsContainer.className = "mb-6";

        const modalTopicsTitle = document.createElement("h4");
        modalTopicsTitle.className = "font-semibold mb-2";
        modalTopicsTitle.textContent = "Topics";
        modalTopicsContainer.appendChild(modalTopicsTitle);

        const modalTopicElementContainer = document.createElement("div");
        modalTopicElementContainer.className = "flex flex-wrap gap-2";

        project.topics.forEach(topic => {
            const topicElement = document.createElement("span");
            topicElement.className = "bg-blue-100 text-blue-800 px-3 py-1 rounded-full";
            topicElement.textContent = topic;
            modalTopicElementContainer.appendChild(topicElement);
        });

        modalTopicsContainer.appendChild(modalTopicElementContainer);

        modalContent.appendChild(modalTopicsContainer);

        const modalOptionsContainer = document.createElement("div");
        modalOptionsContainer.className = "flex justify-end pt-2";

        const modalCloseButton = document.createElement("button");
        modalCloseButton.className = "px-4 py-2 text-gray-700 rounded-lg mr-2 hover:bg-gray-100 transition";
        modalCloseButton.textContent = "Close";
        modalCloseButton.onclick = this.closeModal;
        modalOptionsContainer.appendChild(modalCloseButton);

        const modalLinkButton = document.createElement("a");
        modalLinkButton.href = project.link;
        modalLinkButton.className = "bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition";
        modalLinkButton.textContent = "Visit Project";
        modalOptionsContainer.appendChild(modalLinkButton);

        modalContent.appendChild(modalOptionsContainer);

        modalContainer.appendChild(modalContent);

        modal.appendChild(modalContainer);

        const body = document.body;

        body.appendChild(modal);
    }

    filterSetup() {
        // Project filter functionality
        const filterContainer = document.querySelector(".project-filters");
        const projectCards = document.querySelectorAll(".project-card");

        filterContainer.addEventListener("click", (e) => {
            const button = e.target.closest('.filter-btn');
            if( !button ) return;
            if(document.activeElement !== button) return;

            const filterButtons = document.querySelectorAll(".filter-btn");

            filterButtons.forEach((btn) => {
                    btn.classList.remove("bg-blue-600", "text-white");
                    btn.classList.add("bg-white", "text-gray-700");
            });

            button.classList.remove("bg-white", "text-gray-700");
            button.classList.add("bg-blue-600", "text-white");

            // Filter projects
            const filter = button.dataset.filter;
           
            projectCards.forEach((card) => {
                if (filter === "all" || card.classList.contains(filter)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
            
        });
    }

    // Modal functionality
    openModal(projectId) {
        const modal = document.getElementById(`${projectId}-modal`);
        if (!modal) throw new Error(`Modal not found with the id: ${projectId}-modal`);
        modal.classList.remove("opacity-0", "pointer-events-none");
        modal.classList.add("opacity-100", "pointer-events-auto");
        document.body.classList.add("overflow-hidden");
    }

    closeModal() {
        const modals = document.querySelectorAll(".modal");
        modals.forEach((modal) => {
            modal.classList.remove("opacity-100", "pointer-events-auto");
            modal.classList.add("opacity-0", "pointer-events-none");
        });
        document.body.classList.remove("overflow-hidden");
    }

    // Close modal when clicking outside
    closeModalWhenClickOutsideSetup() {
        const modals = document.querySelectorAll(".modal");
        modals.forEach((modal) => {
            modal.addEventListener("click", (e) => {
                if (e.target.classList.contains("modal-overlay")) {
                    this.closeModal();
                }
            });
        });
    }

}


const Project = new ProjectObject();
