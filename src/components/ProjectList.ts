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
  async render(props: Record<string, unknown>): Promise<HTMLElement> {
    const p = props as unknown as ProjectListProps;
    const section = document.createElement('div');  // avoid standerd.css section rules
    section.id = 'projects';
    section.className = 'py-20';

    const inner = document.createElement('div');
    inner.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
    section.appendChild(inner);

    inner.innerHTML = `
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
        </div>
      </div>
      <div id="projects-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"></div>
      <div class="text-center mt-12">
        <a href="/pages/template.html?page=project_viewer"
          class="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition">
          View All Projects
        </a>
      </div>
    `;

    try {
      const res = await fetch(p.dataSource);
      const data = (await res.json()) as Record<string, ProjectData>;
      const grid = inner.querySelector<HTMLElement>('#projects-grid')!;
      const filterBar = inner.querySelector<HTMLElement>('.project-filters')!;

      const entries = Object.entries(data).reverse();
      const categories = this.getTopCategories(data);
      this.addFilterButtons(filterBar, categories);
      entries.forEach(([key, project]) => grid.appendChild(this.renderCard(key, project)));
      this.setupFilters(inner);
    } catch (e) {
      console.error('ProjectList error:', e);
    }

    return section;
  },

  getTopCategories(data: Record<string, ProjectData>): string[] {
    const counts: Record<string, number> = {};
    Object.values(data).forEach(p => p.category.forEach(c => { counts[c] = (counts[c] ?? 0) + 1; }));
    return Object.entries(counts).sort(([, a], [, b]) => b - a).map(([c]) => c);
  },

  addFilterButtons(bar: HTMLElement, categories: string[]): void {
    const allBtn = bar.querySelector<HTMLElement>('[data-filter="all"]')!;
    allBtn.classList.remove('rounded-r');
    categories.forEach((cat, i) => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn px-4 py-2 text-sm font-medium bg-white text-gray-700';
      if (i === categories.length - 1) btn.classList.add('rounded-r');
      btn.dataset.filter = cat;
      btn.textContent = cat;
      bar.appendChild(btn);
    });
  },

  setupFilters(container: HTMLElement): void {
    const filterBtns = container.querySelectorAll<HTMLElement>('.filter-btn');
    const cards = container.querySelectorAll<HTMLElement>('.project-card');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('bg-blue-600', 'text-white'));
        filterBtns.forEach(b => b.classList.add('bg-white', 'text-gray-700'));
        btn.classList.add('bg-blue-600', 'text-white');
        btn.classList.remove('bg-white', 'text-gray-700');
        const filter = btn.dataset.filter ?? 'all';
        cards.forEach(card => {
          card.style.display = filter === 'all' || card.classList.contains(filter) ? '' : 'none';
        });
      });
    });
  },

  renderCard(key: string, project: ProjectData): HTMLElement {
    const card = document.createElement('div');
    card.className = 'project-card';
    if (project.category.length) card.classList.add(...project.category);
    card.id = `Project-${key}`;

    const imageWrap = document.createElement('div');
    imageWrap.className = 'h-48 overflow-hidden';
    const img = document.createElement('img');
    img.src = project.image;
    img.alt = project.title;
    img.className = 'project-image transition duration-500 hover:scale-110';
    imageWrap.appendChild(img);

    const content = document.createElement('div');
    content.className = 'p-6';

    const title = document.createElement('h3');
    title.className = 'text-xl font-semibold mb-2 text-black';
    title.textContent = project.title;

    const desc = document.createElement('p');
    desc.className = 'text-gray-600 mb-4';
    desc.textContent = project.sub_description;

    const topics = document.createElement('div');
    topics.className = 'flex flex-wrap gap-2';
    project.topicsSummery.forEach(t => {
      const span = document.createElement('span');
      span.className = 'bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded';
      span.textContent = t;
      topics.appendChild(span);
    });

    content.appendChild(title);
    content.appendChild(desc);
    content.appendChild(topics);
    card.appendChild(imageWrap);
    card.appendChild(content);

    card.addEventListener('click', () => this.showModal(project));

    return card;
  },

  showModal(project: ProjectData): void {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(0,0,0,0.6)';

    const modal = document.createElement('div');
    modal.style.cssText = 'background:white;border-radius:0.75rem;max-width:640px;width:100%;overflow:hidden;position:relative;box-shadow:0 25px 50px rgba(0,0,0,0.3);max-height:90vh;display:flex;flex-direction:column';

    const img = document.createElement('img');
    img.src = project.image;
    img.alt = project.title;
    img.style.cssText = 'width:100%;height:220px;object-fit:cover;flex-shrink:0';

    const body = document.createElement('div');
    body.style.cssText = 'padding:1.5rem;overflow-y:auto';

    const titleEl = document.createElement('h2');
    titleEl.style.cssText = 'font-size:1.5rem;font-weight:700;margin-bottom:0.5rem;color:#111827';
    titleEl.textContent = project.title;

    const descEl = document.createElement('p');
    descEl.style.cssText = 'color:#6b7280;margin-bottom:1rem;line-height:1.6';
    descEl.textContent = project.sub_description;

    const tags = document.createElement('div');
    tags.style.cssText = 'display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.5rem';
    project.topicsSummery.forEach(t => {
      const span = document.createElement('span');
      span.style.cssText = 'background:#dbeafe;color:#1e40af;font-size:0.75rem;padding:0.25rem 0.625rem;border-radius:9999px';
      span.textContent = t;
      tags.appendChild(span);
    });
    project.category.forEach(c => {
      const span = document.createElement('span');
      span.style.cssText = 'background:#f0fdf4;color:#166534;font-size:0.75rem;padding:0.25rem 0.625rem;border-radius:9999px';
      span.textContent = c;
      tags.appendChild(span);
    });

    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:0.75rem;flex-wrap:wrap';

    const viewBtn = document.createElement('a');
    viewBtn.href = project.pageKey
      ? `/pages/template.html?page=${project.pageKey}`
      : `/pages/template.html?page=project&project=${encodeURIComponent(project.link)}`;
    viewBtn.style.cssText = 'background:#3b82f6;color:white;padding:0.625rem 1.25rem;border-radius:0.5rem;text-decoration:none;font-weight:500;font-size:0.875rem';
    viewBtn.textContent = 'View Full Project →';

    actions.appendChild(viewBtn);
    body.appendChild(titleEl);
    body.appendChild(descEl);
    body.appendChild(tags);
    body.appendChild(actions);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = 'position:absolute;top:0.75rem;right:0.75rem;background:white;border:none;width:2rem;height:2rem;border-radius:50%;font-size:1.25rem;line-height:1;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center';

    const close = (): void => overlay.remove();
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });

    modal.appendChild(img);
    modal.appendChild(body);
    modal.appendChild(closeBtn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  },
};
