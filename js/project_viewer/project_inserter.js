// Function to create a project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    // Create image wrapper
    const imageWrap = document.createElement('div');
    imageWrap.className = 'project-image-wrap';

    const image = document.createElement('img');
    image.src = project.image || 'https://i.pinimg.com/736x/83/04/77/8304774632a374472f5f01fc73ddeab5.jpg';
    image.alt = project.title;
    image.className = 'project-image';

    imageWrap.appendChild(image);

    // Create content container
    const content = document.createElement('div');
    content.className = 'project-content';

    const title = document.createElement('h3');
    title.className = 'project-title';
    title.textContent = project.title;

    const description = document.createElement('p');
    description.className = 'project-description';
    description.textContent = project.sub_description || project.description;

    const meta = document.createElement('div');
    meta.className = 'project-meta';
    
    if (project.categories && project.categories.length > 0) {
        const categories = document.createElement('div');
        categories.className = 'categories';
        project.categories.forEach(category => {
            const categorySpan = document.createElement('span');
            categorySpan.className = 'category';
            categorySpan.textContent = category;
            categories.appendChild(categorySpan);
        });
        meta.appendChild(categories);
    }

    if (project.date) {
        const date = document.createElement('span');
        date.className = 'date';
        date.textContent = new Date(project.date).toLocaleDateString();
        meta.appendChild(date);
    }

    // Assemble the card
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(meta);

    card.appendChild(imageWrap);
    card.appendChild(content);

    // Add click handler to show modal
    card.addEventListener('click', () => showProjectModal(project));

    return card;
}

// Function to create and show project modal
function showProjectModal(project) {
    // Create modal wrapper
    const modalWrapper = document.createElement('div');
    modalWrapper.className = 'modal-wrapper';
    modalWrapper.setAttribute('role', 'dialog');
    modalWrapper.setAttribute('aria-modal', 'true');
    
    // Create modal structure
    modalWrapper.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-container">
            <button class="modal-close" aria-label="Close modal">×</button>
            
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">${project.title}</h2>
                </div>

                <div class="modal-body">
                    <div class="modal-image">
                        <img src="${project.image || 'https://i.pinimg.com/736x/83/04/77/8304774632a374472f5f01fc73ddeab5.jpg'}" 
                             alt="${project.title}">
                    </div>

                    <div class="modal-info">
                        ${project.sub_description ? `
                            <section class="modal-section">
                                <h3>Overview</h3>
                                <p class="modal-overview">${project.sub_description}</p>
                            </section>
                        ` : ''}

                        <section class="modal-section">
                            <h3>Description</h3>
                            <p class="modal-description">${project.description}</p>
                        </section>

                        ${project.topics && project.topics.length > 0 ? `
                            <section class="modal-section">
                                <h3>Technologies</h3>
                                <div class="modal-topics">
                                    ${project.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
                                </div>
                            </section>
                        ` : ''}

                        <div class="modal-meta">
                            ${project.categories && project.categories.length > 0 ? `
                                <div class="meta-item">
                                    <h4>Categories</h4>
                                    <div class="categories-list">
                                        ${project.categories.map(cat => `<span class="category-tag">${cat}</span>`).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${project.date ? `
                                <div class="meta-item">
                                    <h4>Date</h4>
                                    <time datetime="${project.date}">${new Date(project.date).toLocaleDateString()}</time>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <div class="modal-actions">
                        <a href="/pages/project.html?project=${project.link}" class="btn btn-primary">View Full Project</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add event listeners for closing
    function closeModal() {
        modalWrapper.classList.add('modal-closing');
        setTimeout(() => {
            modalWrapper.remove();
            document.body.classList.remove('modal-open');
        }, 300); // Match this with CSS animation duration
    }

    // Close button click
    modalWrapper.querySelector('.modal-close').addEventListener('click', closeModal);
    
    // Close on overlay click
    modalWrapper.querySelector('.modal-overlay').addEventListener('click', closeModal);
    
    // Close on escape key
    document.addEventListener('keydown', function handleEscape(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    });

    // Prevent scrolling of background content
    document.body.classList.add('modal-open');
    
    // Add to DOM
    document.body.appendChild(modalWrapper);
    
    // Trigger open animation
    requestAnimationFrame(() => {
        modalWrapper.classList.add('modal-open');
    });
}

// Function to insert projects into the project list
function insertProjects(projects) {
    const projectList = document.getElementById('project-list');
    
    if (projects.length === 0) {
        projectList.innerHTML = '<p class="no-results">No projects found</p>';
        return;
    }

    projects.forEach(project => {
        projectList.appendChild(createProjectCard(project));
    });
}

// Function to update category buttons based on frequency
function updateCategoryButtons(projectHolder) {
    const categorySelection = document.getElementById('category-selection');
    categorySelection.innerHTML = ''; // Clear existing buttons

    // Sort categories by frequency (excluding 'All' which is handled separately)
    const sortedCategories = Array.from(projectHolder.categories.entries())
        .filter(([category]) => category !== 'All')
        .sort((a, b) => {
            // Sort by count (frequency) first
            const frequencyDiff = b[1] - a[1];
            if (frequencyDiff !== 0) return frequencyDiff;
            // If frequencies are equal, sort alphabetically
            return a[0].localeCompare(b[0]);
        });

    // Create buttons for each category
    sortedCategories.forEach(([category, count]) => {
        const button = document.createElement('button');
        button.id = category;
        button.textContent = `${category}`;
        button.onclick = () => handleCategorySelect(category);
        
        // Add active class if this category is selected
        if (projectHolder.selectedCategories.includes(category)) {
            button.classList.add('active');
        }
        
        categorySelection.appendChild(button);
    });

    // Update the 'All' button state
    const allButton = document.getElementById('all-selection');
    if (allButton) {
        if (projectHolder.selectedCategories.includes('All')) {
            allButton.classList.add('active');
        } else {
            allButton.classList.remove('active');
        }
    }
}
