class ProjectHolder {
    constructor() {
        this.projects = [];
        this.categories = new Map();
        this.categoryOrder = []; // Track order of appearance
        this.selectedCategories = ['All'];
        this.searchQuery = '';
        this.sortType = 'date';
        this.sortOrder = 'asc';
    }

    async loadProjects() {
        try {
            const response = await fetch('/data/frontpage_project.json');
            const projectData = await response.json();
            
            this.projects = Object.entries(projectData).map(([id, project]) => {
                return {
                    id,
                    title: project.title || id,
                    link: project.link,
                    image: project.image,
                    categories: Array.isArray(project.category) && project.category.length === 0 
                        ? []
                        : String(project.category || 'Uncategorized').split(',').map(cat => cat.trim()),
                    description: project.description || '',
                    sub_description: project.sub_description || '',
                    date: project.date || '2000-01-01',
                    topics: project.topics || [],
                    topicsSummery: project.topicsSummery || []
                };
            });

            // Count categories
            this.categories.clear();
            this.categories.set('All', this.projects.length);
            
            // Reset category tracking
            this.categoryOrder = ['All'];
            this.categories.clear();
            this.categories.set('All', this.projects.length);

            // Track categories in order of appearance
            this.projects.forEach(project => {
                if (project.categories.length > 0) {  // Only process if categories exist
                    project.categories.forEach(category => {
                        if (!this.categoryOrder.includes(category)) {
                            this.categoryOrder.push(category);
                        }
                        this.categories.set(category, (this.categories.get(category) || 0) + 1);
                    });
                }
            });
        } catch (error) {
            console.error('Error loading projects:', error);
            this.projects = [];
            this.categories.clear();
        }
    }

    getFilteredAndSortedProjects() {
        let filteredProjects = this.projects;

        // Apply category filter
        if (!this.selectedCategories.includes('All')) {
            filteredProjects = filteredProjects.filter(project => 
                project.categories.some(category => this.selectedCategories.includes(category))
            );
        }

        // Apply search filter if search query exists
        if (this.searchQuery) {
            const searchTerms = this.searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
            const projectScores = new Map();

            filteredProjects.forEach(project => {
                let score = 0;
                const searchableContent = {
                    title: project.title.toLowerCase(),
                    description: project.description.toLowerCase(),
                    subDescription: (project.sub_description || '').toLowerCase(),
                    topics: (project.topics || []).map(t => t.toLowerCase()).join(' '),
                    topicsSummery: (project.topicsSummery || []).map(t => t.toLowerCase()).join(' '),
                    date: (project.date || '').toLowerCase(),
                    categories: (project.categories || []).map(c => c.toLowerCase()).join(' ')
                };

                searchTerms.forEach(term => {
                    // Title matches (highest priority)
                    if (searchableContent.title.includes(term)) score += 100;
                    
                    // Sub-description matches (second priority)
                    if (searchableContent.subDescription.includes(term)) score += 50;
                    
                    // Description matches (third priority)
                    if (searchableContent.description.includes(term)) score += 30;
                    
                    // Topics and categories matches (fourth priority)
                    if (searchableContent.topics.includes(term)) score += 20;
                    if (searchableContent.categories.includes(term)) score += 20;
                    if (searchableContent.topicsSummery.includes(term)) score += 20;
                    
                    // Date matches (lowest priority)
                    if (searchableContent.date.includes(term)) score += 10;
                });

                if (score > 0) {
                    projectScores.set(project, score);
                }
            });

            // Sort projects by score and filter out non-matching projects
            filteredProjects = Array.from(projectScores.entries())
                .sort((a, b) => b[1] - a[1]) // Sort by score descending
                .map(entry => entry[0]); // Get just the projects

            return filteredProjects;
        }

        // Apply sorting
        filteredProjects.sort((a, b) => {
            let comparison = 0;
            if (this.sortType === 'date') {
                comparison = new Date(a.date) - new Date(b.date);
            } else if (this.sortType === 'name') {
                comparison = a.title.localeCompare(b.title);
            }
            return this.sortOrder === 'asc' ? comparison : -comparison;
        });

        return filteredProjects;
    }

    setCategory(category) {
        if (category === 'All') {
            // If selecting 'All', clear other selections
            this.selectedCategories = ['All'];
        } else {
            // Remove 'All' if it's selected
            if (this.selectedCategories.includes('All')) {
                this.selectedCategories = [];
            }
            
            // Toggle the category
            const index = this.selectedCategories.indexOf(category);
            if (index > -1) {
                this.selectedCategories.splice(index, 1);
                // If no categories are selected, default to 'All'
                if (this.selectedCategories.length === 0) {
                    this.selectedCategories = ['All'];
                }
            } else {
                this.selectedCategories.push(category);
            }
        }
    }

    setSearchQuery(query) {
        this.searchQuery = query;
    }

    setSortType(type) {
        this.sortType = type;
    }

    toggleSortOrder() {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    }
}
