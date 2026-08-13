export const ProjectHeader = {
  render(props: Record<string, unknown> = {}): string {
    const title = (props.title as string) ?? 'Project';
    const sections = (props.sections as string[]) ?? ['Overview', 'Conclusion'];
    
    const sectionLinks = sections
      .map(section => `<a href="#${section.toLowerCase().replace(/\s+/g, '-')}" class="nav-link">${section}</a>`)
      .join('\n                ');

    return `
      <div class="bg-white shadow-md sticky top-0 z-40">
        <a href="/" class="absolute top-3 left-3 text-blue-500">
          <svg class="lucide-icon" width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </a>
        <div class="container mx-auto px-6 pl-9 py-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center title-wrap">
              <svg class="lucide-icon mr-3" width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #3b82f6;">
                <path d="M19 3H5c-1 0-2 1-2 2v14c0 1 1 2 2 2h14c1 0 2-1 2-2V5c0-1-1-2-2-2z"></path>
                <path d="M9 7h6"></path>
                <path d="M9 11h6"></path>
                <path d="M9 15h2"></path>
              </svg>
              <div class="title">
                <h1 class="project-title">${title}</h1>
                <span class="project-subtitle">Documentation</span>
              </div>
            </div>

            <div class="actions" style="display:flex;align-items:center;gap:0.5rem">
              <button id="sections-toggle" class="menu-button" aria-expanded="false" aria-controls="nav-links">Sections ▼</button>
              <div id="nav-links" class="sections-panel" aria-hidden="true">
                ${sectionLinks}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },
};
