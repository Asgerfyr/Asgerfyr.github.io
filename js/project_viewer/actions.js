// Create instance of ProjectHolder
const projectHolder = new ProjectHolder();
const projectList = document.getElementById('project-list');

// Initialize projects and categories
window.addEventListener('DOMContentLoaded', async () => {
    await projectHolder.loadProjects();
    updateCategoryButtons(projectHolder);
    updateProjectDisplay();
});

// Handle category selection
function handleCategorySelect(category) {
    // Remove active class from all category buttons
    document.querySelectorAll('#all-selection, #category-selection button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected button
    const selectedButton = category === 'All' 
        ? document.getElementById('all-selection')
        : document.getElementById(category);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }

    projectHolder.setCategory(category);
    updateProjectDisplay();
}

// Handle search input
function handleSearch(searchQuery) {
    projectHolder.setSearchQuery(searchQuery);
    updateProjectDisplay();
}

// Handle sort button clicks
function sortButtonClick(button) {
    const sortType = button.id === 'sort-by-date' ? 'date' : 'name';
    
    if (button.classList.contains('active')) {
        projectHolder.toggleSortOrder();
        const arrow = button.querySelector('.arrow');
        arrow.textContent = arrow.textContent === '↑' ? '↓' : '↑';
    } else {
        const sort_buttons = document.getElementsByClassName('sort_button');
        Array.from(sort_buttons).forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        projectHolder.setSortType(sortType);
    }
    
    updateProjectDisplay();
}

// Update project display
function updateProjectDisplay() {
    const filteredProjects = projectHolder.getFilteredAndSortedProjects();
    // Clear current projects
    projectList.innerHTML = '';
    // Insert new projects
    insertProjects(filteredProjects);
}
