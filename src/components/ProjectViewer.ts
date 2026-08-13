interface Project {
  id: string; title: string; link: string; image: string;
  categories: string[]; description: string; sub_description: string;
  date: string; topics: string[]; topicsSummery: string[];
  pageKey?: string;  // set when the project has a component-based page
}

export const ProjectViewer = {
  render(_props: Record<string, unknown>): string {
    // Returns static HTML shell - interactivity is loaded client-side via JS
    return `
      <div id="page-container">
        <div id="header">
          <a href="/" id="home" style="display: flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; color: #3b82f6;"><i class="fas fa-home" style="font-size: 1.25rem;"></i></a>
          <h1>Project Viewer</h1>
        </div>
        <div id="content-layout-container">
          <div id="sidebar">
            <input type="text" id="pv-search" placeholder="Search…" />
            <div id="all-selection-container">
              <button id="all-selection" class="active">All</button>
            </div>
            <div id="category-selection"></div>
          </div>
          <div id="main-content">
            <div id="sorting-options">
              <button id="sort-by-date" class="sort_button active">Sort by Date <span class="arrow">↓</span></button>
              <button id="sort-by-name" class="sort_button">Sort by Name <span class="arrow">↓</span></button>
            </div>
            <div id="project-list"></div>
          </div>
        </div>
      </div>
    `;
  }
};
