import type { ProjectListProps } from '../types';

interface ProjectData {
  title: string;
  image: string;
  sub_description: string;
  description: string;
  topics: string[];
  topicsSummery: string[];
  category: string[];
  date: string;
  link: string;
  pageKey?: string;  // set when the project has a component-based page
}

export const ProjectList = {
  render(props: Record<string, unknown> = {}): string {
    const p = props as unknown as ProjectListProps;
    const projectData = (props.projectData as Record<string, ProjectData>) || {};
    
    const entries = Object.entries(projectData).reverse();
    
    // Generate card HTML
    const cardsHTML = entries.map(([key, project]) => {
      const categories = project.category.length ? ` ${project.category.join(' ')}` : '';
      const topicsHTML = project.topicsSummery.map(t => 
        `<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${t}</span>`
      ).join('');
      
      return `
        <div class="project-card${categories}" id="Project-${key}" data-project-key="${key}">
          <div class="h-48 overflow-hidden">
            <img src="${project.image}" alt="${project.title}" class="project-image transition duration-500 hover:scale-110">
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-1 text-black">${project.title}</h3>
            <p class="text-sm text-gray-500 mb-3">${project.date}</p>
            <p class="text-gray-600 mb-4">${project.sub_description}</p>
            <div class="flex flex-wrap gap-2">${topicsHTML}</div>
          </div>
        </div>
      `;
    }).join('');

    // Get unique categories for filter buttons
    const categoryCounts: Record<string, number> = {};
    Object.values(projectData).forEach(p => {
      p.category.forEach(c => {
        categoryCounts[c] = (categoryCounts[c] ?? 0) + 1;
      });
    });
    const categories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([c]) => c);

    const filterButtonsHTML = categories.map(cat => 
      `<button data-filter="${cat}" class="filter-btn px-4 py-2 text-sm font-medium bg-white text-gray-700">${cat}</button>`
    ).join('');

    return `
      <section id="projects" class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-center mb-4">
            My <span class="text-blue-600">Projects</span>
          </h2>
          <p class="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Here are some of my recent projects. Click on any project to view more details.
          </p>
          <div class="m-auto flex justify-center mb-12 w-2/3">
            <div class="project-filters inline-flex rounded-md shadow-sm">
              <button data-filter="all" class="filter-btn px-4 py-2 text-sm font-medium rounded-l-lg rounded-r bg-blue-600 text-white">
                All Projects
              </button>
              ${filterButtonsHTML}
            </div>
          </div>
          <div id="projects-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${cardsHTML}
          </div>
          <div class="text-center mt-12">
            <a href="/pages/template.html?page=project_viewer"
              class="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition">
              View All Projects
            </a>
          </div>
        </div>
      </section>
    `;
  },
};
