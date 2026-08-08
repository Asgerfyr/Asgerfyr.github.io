export const ProjectHeader = {
  render(props: Record<string, unknown>): HTMLElement {
    const title = (props.title as string) ?? 'Project';
    document.title = `${title} Documentation`;

    const div = document.createElement('div');
    div.className = 'bg-white shadow-md sticky top-0 z-40';
    div.innerHTML = `
      <a href="/" class="absolute top-3 left-3 text-blue-500"><i class="fa-solid fa-house"></i></a>
      <div class="container mx-auto px-6 pl-9 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <i class="fas fa-project-diagram text-blue-500 text-2xl mr-3"></i>
            <h1 class="text-2xl font-bold text-gray-800">${title} Documentation</h1>
          </div>
          <div id="nav-links" class="hidden md:flex">
            <a href="#overview" class="nav-link">Overview</a>
            <a id="conclusion-link" href="#conclusion" class="nav-link">Conclusion</a>
          </div>
        </div>
      </div>
    `;
    return div;
  },
};
