interface Project {
  id: string; title: string; link: string; image: string;
  categories: string[]; description: string; sub_description: string;
  date: string; topics: string[]; topicsSummery: string[];
  pageKey?: string;  // set when the project has a component-based page
}

export const ProjectViewer = {
  async render(_props: Record<string, unknown>): Promise<HTMLElement> {
    if (!document.querySelector('link[href="/css/project_viewer/style.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/css/project_viewer/style.css';
      document.head.appendChild(link);
    }
    document.title = 'Project Viewer';

    const container = document.createElement('div');
    container.id = 'page-container';
    container.innerHTML = `
      <div id="header">
        <a href="/" id="home"><i class="fa-solid fa-house"></i></a>
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
            <button id="sort-by-date" class="sort_button active">Sort by Date <span class="arrow">↑</span></button>
            <button id="sort-by-name" class="sort_button">Sort by Name <span class="arrow">↓</span></button>
          </div>
          <div id="project-list"></div>
        </div>
      </div>
    `;

    // State
    let projects: Project[] = [];
    const categories = new Map<string, number>();
    let selected = 'All';
    let search = '';
    let sortType: 'date' | 'name' = 'date';
    let sortOrder: 'asc' | 'desc' = 'asc';

    const listEl = container.querySelector<HTMLElement>('#project-list')!;
    const catEl  = container.querySelector<HTMLElement>('#category-selection')!;

    // Load data
    try {
      const data = await fetch('/data/frontpage_project.json').then(r => r.json()) as Record<string, Record<string, unknown>>;
      projects = Object.entries(data).map(([id, p]) => ({
        id,
        title: (p['title'] as string) || id,
        link:  (p['link']  as string) || id,
        image: (p['image'] as string) || '',
        categories: Array.isArray(p['category']) ? p['category'] as string[] : [],
        description:     (p['description']     as string) || '',
        sub_description: (p['sub_description'] as string) || '',
        date: (p['date'] as string) || '',
        topics:       (p['topics']       as string[]) || [],
        topicsSummery:(p['topicsSummery'] as string[]) || [],
        pageKey:      (p['pageKey']       as string) || undefined,
      }));

      categories.clear();
      categories.set('All', projects.length);
      projects.forEach(p => p.categories.forEach(c => categories.set(c, (categories.get(c) ?? 0) + 1)));
    } catch (e) {
      console.error('ProjectViewer load error:', e);
      listEl.innerHTML = '<p style="padding:20px;color:red">Failed to load projects</p>';
      return container;
    }

    // Helpers
    const getFiltered = (): Project[] => {
      let r = [...projects];
      if (selected !== 'All') r = r.filter(p => p.categories.includes(selected));
      if (search) {
        const q = search.toLowerCase();
        r = r.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sub_description.toLowerCase().includes(q)
        );
      }
      r.sort((a, b) => {
        const cmp = sortType === 'date'
          ? (new Date(a.date || '2000').getTime() - new Date(b.date || '2000').getTime())
          : a.title.localeCompare(b.title);
        return sortOrder === 'asc' ? cmp : -cmp;
      });
      return r;
    };

    const refresh = () => {
      listEl.innerHTML = '';
      const filtered = getFiltered();
      if (!filtered.length) {
        listEl.innerHTML = '<p class="no-results" style="padding:20px;color:gray">No projects found</p>';
        return;
      }
      filtered.forEach(p => listEl.appendChild(makeCard(p)));
    };

    const buildCategories = () => {
      catEl.innerHTML = '';
      const allBtn = container.querySelector<HTMLButtonElement>('#all-selection')!;
      allBtn.className = selected === 'All' ? 'active' : '';
      allBtn.onclick = () => { selected = 'All'; buildCategories(); refresh(); };

      [...categories.entries()].filter(([c]) => c !== 'All').forEach(([cat]) => {
        const btn = document.createElement('button');
        btn.textContent = `${cat} (${categories.get(cat)})`;
        btn.className = selected === cat ? 'active' : '';
        btn.onclick = () => { selected = cat; buildCategories(); refresh(); };
        catEl.appendChild(btn);
      });
    };

    const makeCard = (p: Project): HTMLElement => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <div class="project-image-wrap">
          <img src="${p.image}" alt="${p.title}" class="project-image" />
        </div>
        <div class="project-content">
          <h3 class="project-title">${p.title}</h3>
          <p class="project-description">${p.sub_description || p.description}</p>
          <div class="project-meta">
            <div class="categories">${p.categories.map(c => `<span class="category">${c}</span>`).join('')}</div>
            ${p.date ? `<span class="date">${p.date}</span>` : ''}
          </div>
        </div>
      `;
      card.addEventListener('click', () => showModal(p));
      return card;
    };

    const showModal = (p: Project) => {
      const wrap = document.createElement('div');
      wrap.className = 'modal-wrapper';
      wrap.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-container">
          <button class="modal-close" aria-label="Close">×</button>
          <div class="modal-content">
            <div class="modal-header"><h2 class="modal-title">${p.title}</h2></div>
            <div class="modal-body">
              <div class="modal-image"><img src="${p.image}" alt="${p.title}" /></div>
              <div class="modal-info">
                ${p.sub_description ? `<section class="modal-section"><h3>Overview</h3><p class="modal-overview">${p.sub_description}</p></section>` : ''}
                <section class="modal-section"><h3>Description</h3><p class="modal-description">${p.description}</p></section>
                ${p.topics.length ? `<section class="modal-section"><h3>Technologies</h3><div class="modal-topics">${p.topics.map(t => `<span class="topic-tag">${t}</span>`).join('')}</div></section>` : ''}
              </div>
            </div>
            <div class="modal-footer">
              <div class="modal-actions">
                <a href="${p.pageKey ? `/pages/template.html?page=${p.pageKey}` : `/pages/template.html?page=project&project=${encodeURIComponent(p.link)}`}" class="btn btn-primary">View Full Project</a>
              </div>
            </div>
          </div>
        </div>
      `;
      const close = () => {
        wrap.classList.add('modal-closing');
        setTimeout(() => { wrap.remove(); document.body.classList.remove('modal-open'); }, 300);
      };
      wrap.querySelector('.modal-close')!.addEventListener('click', close);
      wrap.querySelector('.modal-overlay')!.addEventListener('click', close);
      document.addEventListener('keydown', function esc(e) {
        if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
      });
      document.body.classList.add('modal-open');
      document.body.appendChild(wrap);
      requestAnimationFrame(() => wrap.classList.add('modal-open'));
    };

    // Sort buttons
    container.querySelector('#sort-by-date')!.addEventListener('click', function(this: HTMLElement) {
      const other = container.querySelector<HTMLElement>('#sort-by-name')!;
      if (this.classList.contains('active')) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        this.querySelector('.arrow')!.textContent = sortOrder === 'asc' ? '↑' : '↓';
      } else {
        other.classList.remove('active');
        this.classList.add('active');
        sortType = 'date'; sortOrder = 'asc';
        this.querySelector('.arrow')!.textContent = '↑';
      }
      refresh();
    });
    container.querySelector('#sort-by-name')!.addEventListener('click', function(this: HTMLElement) {
      const other = container.querySelector<HTMLElement>('#sort-by-date')!;
      if (this.classList.contains('active')) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        this.querySelector('.arrow')!.textContent = sortOrder === 'asc' ? '↑' : '↓';
      } else {
        other.classList.remove('active');
        this.classList.add('active');
        sortType = 'name'; sortOrder = 'asc';
        this.querySelector('.arrow')!.textContent = '↑';
      }
      refresh();
    });

    // Search
    container.querySelector('#pv-search')!.addEventListener('input', function(this: HTMLInputElement) {
      search = this.value;
      refresh();
    });

    buildCategories();
    refresh();
    return container;
  },
};
