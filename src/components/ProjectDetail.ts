interface ProjectIcon { name: string; color: string; }
interface ProjectFeature { icon: string; title: string; description: string; }
interface ProjectImage { url: string; alt: string; title?: string; caption?: string; }
interface ProjectOverview {
  description: string;
  objectives: string[];
  features: ProjectFeature[];
  images: ProjectImage[];
}
interface SubSectionItem { type: string; content: unknown; language?: string; }
interface ProjectSection {
  icon: string;
  title: string;
  content: Record<string, SubSectionItem[]>;
  images?: { image_title?: string; image_elements: ProjectImage[] };
}
interface ProjectInfo {
  completion_date?: string;
  team_size?: number;
  team_members?: Array<{ name: string; role: string; link?: string }>;
  duration?: string;
}
interface ProjectConclusion {
  results?: string;
  learned?: string;
  improvements?: string[];
}
interface ProjectData {
  info: ProjectInfo;
  overview: ProjectOverview;
  sections?: ProjectSection[];
  conclusion?: ProjectConclusion;
}

export const ProjectDetail = {
  async render(_props: Record<string, unknown>): Promise<HTMLElement> {
    const wrapper = document.createElement('div');
    const key = new URLSearchParams(window.location.search).get('project');

    if (!key || key === '404') {
      wrapper.innerHTML = `<div class="p-16 text-center"><p class="text-red-600 text-xl mb-4">Project not found</p><a href="/" class="text-blue-500">← Go home</a></div>`;
      return wrapper;
    }

    // Inject project-page CSS
    if (!document.querySelector('link[href="/css/project/style.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/css/project/style.css';
      document.head.appendChild(link);
    }

    try {
      const [data, icons]: [ProjectData, Record<string, ProjectIcon>] = await Promise.all([
        fetch(`/data/projects/${key.split(' ').join('_')}.json`).then(r => {
          if (!r.ok) throw new Error(`Project not found: ${key}`);
          return r.json();
        }),
        fetch('/data/utility/project_icons.json').then(r => r.json()),
      ]);

      document.title = `${key} Documentation`;

      const showcase = this.createShowcase();
      wrapper.appendChild(showcase);
      wrapper.appendChild(this.renderHeader(key));

      const main = document.createElement('main');
      main.className = 'container mx-auto px-6 py-8';
      wrapper.appendChild(main);

      // Quick links list is built during section rendering, inserted in footer
      const quickLinks = document.createElement('ul');
      quickLinks.className = 'space-y-2';
      quickLinks.innerHTML = '<li><a href="#overview" class="quick-link">Overview</a></li>';

      const navLinks = wrapper.querySelector<HTMLElement>('#nav-links')!;

      main.appendChild(this.renderOverview(data.overview, icons));
      if (data.sections?.length) {
        const sectionsEl = document.createElement('div');
        sectionsEl.id = 'main-sections';
        main.appendChild(sectionsEl);
        data.sections.forEach(s => {
          try { sectionsEl.appendChild(this.renderSection(s, icons, navLinks, quickLinks)); }
          catch (e) { console.error(`Section error: ${s.title}`, e); }
        });
      }
      if (data.conclusion) main.appendChild(this.renderConclusion(data.conclusion));

      wrapper.appendChild(this.renderFooter(data.info, quickLinks));

      // Trigger syntax highlighting after DOM is ready
      requestAnimationFrame(() => {
        const hljs = (window as unknown as Record<string, unknown>)['hljs'] as Record<string, unknown> | undefined;
        if (typeof hljs?.['highlightAll'] === 'function') (hljs['highlightAll'] as () => void)();
      });

    } catch (e) {
      console.error('ProjectDetail error:', e);
      wrapper.innerHTML = `<div class="p-16 text-center"><p class="text-red-600 text-xl mb-4">Failed to load project "${key}"</p><a href="/" class="text-blue-500">← Go home</a></div>`;
    }

    return wrapper;
  },

  createShowcase(): HTMLElement {
    const el = document.createElement('div');
    el.id = 'image_showcase_container';
    el.className = 'invis fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer';
    el.style.backgroundColor = 'rgba(0,0,0,0.8)';
    el.innerHTML = '<img id="image_showcase" src="" alt="" style="max-width:100%;max-height:100%;object-fit:contain;border-radius:10px;border:5px solid #242323" />';
    el.addEventListener('click', () => el.classList.toggle('invis'));
    return el;
  },

  renderHeader(key: string): HTMLElement {
    const header = document.createElement('div');   // <header> conflicts with standerd.css height:100vh
    header.className = 'bg-white shadow-md sticky top-0 z-40';
    header.innerHTML = `
      <a href="/" class="absolute top-3 left-3 text-blue-500"><i class="fa-solid fa-house"></i></a>
      <div class="container mx-auto px-6 pl-9 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <i class="fas fa-project-diagram text-blue-500 text-2xl mr-3"></i>
            <h1 class="text-2xl font-bold text-gray-800">${key} Documentation</h1>
          </div>
          <div id="nav-links" class="hidden md:flex">
            <a href="#overview" class="nav-link">Overview</a>
            <a id="conclusion-link" href="#conclusion" class="nav-link">Conclusion</a>
          </div>
        </div>
      </div>
    `;
    return header;
  },

  renderOverview(overview: ProjectOverview, icons: Record<string, ProjectIcon>): HTMLElement {
    const section = document.createElement('div');  // <section> conflicts with standerd.css margins/shadows
    section.id = 'overview';
    section.className = 'section-anchor mb-16';

    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8';
    card.innerHTML = `
      <div class="flex items-center mb-6">
        <i class="fas fa-info-circle text-blue-500 text-2xl mr-3"></i>
        <h2 class="text-xl font-bold">Project Overview</h2>
      </div>
      <div class="grid md:grid-cols-2 gap-8">
        <div>
          <h3 class="text-xl font-semibold mb-4">Project Description</h3>
          <p class="text-gray-600 mb-6">${overview.description ?? ''}</p>
          <h3 class="text-xl font-semibold mb-4">Objectives</h3>
          <ul class="list-disc pl-6 space-y-2 text-gray-600">
            ${(overview.objectives ?? []).map(o => `<li>${o}</li>`).join('')}
          </ul>
        </div>
        <div>
          <h3 class="text-xl font-semibold mb-4">Key Features</h3>
          <div class="space-y-4">
            ${(overview.features ?? []).map(f => {
              const ic = icons[f.icon] ?? icons['missingIcon'];
              return `
                <div class="flex items-start">
                  <div class="bg-${ic.color}-100 p-3 rounded-full mr-3 flex-shrink-0 flex justify-center items-center" style="width:2.5rem">
                    <i class="fas fa-${ic.name} text-${ic.color}-500"></i>
                  </div>
                  <div><h4 class="font-medium">${f.title}</h4><p class="text-sm text-gray-500">${f.description}</p></div>
                </div>`;
            }).join('')}
          </div>
        </div>
      </div>
    `;
    section.appendChild(card);

    if (overview.images?.length) {
      const imgCard = document.createElement('div');
      imgCard.className = 'bg-white rounded-xl shadow-md overflow-hidden p-6';
      imgCard.innerHTML = `
        <h3 class="text-xl font-semibold mb-6 flex items-center">
          <i class="fas fa-images text-blue-500 mr-3"></i>Project Images
        </h3>
        <div class="image-gallery">
          ${overview.images.map(img => `
            <div class="image-card cursor-pointer" onclick="var s=document.getElementById('image_showcase');s.src='${img.url}';s.alt='${img.alt}';document.getElementById('image_showcase_container').classList.remove('invis')">
              <img src="${img.url}" alt="${img.alt}" class="w-full h-48 object-cover rounded-lg" />
              <p class="text-sm text-gray-500 mt-2 text-center">${img.caption ?? ''}</p>
            </div>`).join('')}
        </div>
      `;
      section.appendChild(imgCard);
    }

    return section;
  },

  renderSection(s: ProjectSection, icons: Record<string, ProjectIcon>, navLinks: HTMLElement, quickLinks: HTMLElement): HTMLElement {
    const id = '_' + s.title.split(' ').join('_');
    const container = document.createElement('div');  // avoid standerd.css section rules
    container.className = 'section-anchor mb-16';
    container.id = id;

    // Add dynamic nav link before conclusion
    const navLink = document.createElement('a');
    navLink.className = 'nav-link';
    navLink.textContent = s.title;
    navLink.href = `#${id}`;
    const conclusionLink = navLinks.querySelector<HTMLElement>('#conclusion-link');
    if (conclusionLink) navLinks.insertBefore(navLink, conclusionLink);

    // Add quick link in footer
    const li = document.createElement('li');
    const ql = document.createElement('a');
    ql.className = 'quick-link';
    ql.textContent = s.title;
    ql.href = `#${id}`;
    li.appendChild(ql);
    quickLinks.appendChild(li);

    const iconObj = icons[s.icon] ?? icons['missingIcon'];
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8';
    card.innerHTML = `
      <div class="flex items-center mb-6">
        <i class="fas fa-${iconObj.name} text-blue-500 text-2xl mr-3"></i>
        <h2 class="text-2xl font-bold">${s.title} Documentation</h2>
      </div>
    `;

    const grid = document.createElement('div');
    grid.className = 'section-grid-container';
    Object.entries(s.content).forEach(([key, subs]) => {
      grid.appendChild(this.renderSubSection(key, subs));
    });
    card.appendChild(grid);
    container.appendChild(card);

    if (s.images?.image_elements?.length) {
      container.appendChild(this.renderImageGallery(`${s.title} ${s.images.image_title ?? 'Images'}`, s.images.image_elements));
    }

    return container;
  },

  renderSubSection(key: string, items: SubSectionItem[]): HTMLElement {
    const div = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.className = 'text-xl font-bold mb-4';
    h3.innerHTML = key.toLowerCase() === 'null' ? '' : key;
    div.appendChild(h3);

    items.forEach(item => {
      try { div.appendChild(this.renderSubItem(item)); }
      catch (e) { console.error(`SubItem render error (${item.type}):`, e); }
    });

    return div;
  },

  renderSubItem(item: SubSectionItem): HTMLElement {
    switch (item.type) {
      case 'text': {
        const p = document.createElement('p');
        p.className = 'text-gray-600 mb-4';
        p.innerHTML = item.content as string;
        return p;
      }
      case 'code': {
        const wrap = document.createElement('div');
        wrap.className = 'bg-gray-800 text-white rounded-lg p-2 text-sm mb-4';
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        if (item.language) code.className = `language-${item.language}`;
        code.innerHTML = item.content as string;
        pre.appendChild(code);
        wrap.appendChild(pre);
        return wrap;
      }
      case 'list': {
        const ul = document.createElement('ul');
        ul.className = 'list-disc pl-6 space-y-2 text-gray-600 mb-4';
        (item.content as string[]).forEach(t => {
          const li = document.createElement('li');
          li.innerHTML = t;
          ul.appendChild(li);
        });
        return ul;
      }
      case 'checklist': {
        const wrap = document.createElement('div');
        wrap.className = 'bg-gray-100 rounded-lg p-4 mb-4';
        const ul = document.createElement('ul');
        ul.className = 'space-y-2';
        (item.content as { checked: boolean; text: string }[]).forEach(({ checked, text }) => {
          const li = document.createElement('li');
          li.className = 'flex items-center';
          li.innerHTML = `<i class="fas fa-${checked ? 'check-circle text-green' : 'times-circle text-red'}-500 mr-2"></i><span>${text}</span>`;
          ul.appendChild(li);
        });
        wrap.appendChild(ul);
        return wrap;
      }
      case 'table': {
        const { headers, rows } = item.content as { headers: string[]; rows: string[][] };
        const wrap = document.createElement('div');
        wrap.className = 'table-overflow bg-gray-100 rounded-lg p-4 mb-4';
        const table = document.createElement('table');
        table.className = 'w-full';
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        tr.className = 'border-b';
        headers.forEach(h => {
          const th = document.createElement('th');
          th.className = 'text-left py-2 px-2';
          th.innerHTML = h;
          tr.appendChild(th);
        });
        thead.appendChild(tr);
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        rows.forEach((row, i) => {
          const tr2 = document.createElement('tr');
          if (i < rows.length - 1) tr2.className = 'border-b';
          row.forEach(cell => {
            const td = document.createElement('td');
            td.className = 'py-2 px-2 text-sm';
            td.innerHTML = cell;
            tr2.appendChild(td);
          });
          tbody.appendChild(tr2);
        });
        table.appendChild(tbody);
        wrap.appendChild(table);
        return wrap;
      }
      default: {
        const p = document.createElement('p');
        p.className = 'text-gray-400 text-sm mb-4';
        p.textContent = `[Unknown type: ${item.type}]`;
        return p;
      }
    }
  },

  renderImageGallery(heading: string, images: ProjectImage[]): HTMLElement {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8';
    card.innerHTML = `
      <h3 class="text-xl font-semibold mb-6 flex items-center">
        <i class="fas fa-images text-blue-500 mr-3"></i>${heading}
      </h3>
      <div class="image-gallery">
        ${images.map(img => `
          <div class="image-card cursor-pointer" onclick="var s=document.getElementById('image_showcase');s.src='${img.url}';s.alt='${img.alt}';document.getElementById('image_showcase_container').classList.remove('invis')">
            <img src="${img.url}" alt="${img.alt}" class="w-full h-48 object-cover rounded-lg" />
            <p class="text-sm text-gray-500 mt-2 text-center">${img.caption ?? ''}</p>
          </div>`).join('')}
      </div>
    `;
    return card;
  },

  renderConclusion(c: ProjectConclusion): HTMLElement {
    const section = document.createElement('div');  // avoid standerd.css section rules
    section.id = 'conclusion';
    section.className = 'section-anchor';
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-md overflow-hidden p-6';
    card.innerHTML = `
      <div class="flex items-center mb-6">
        <i class="fas fa-flag-checkered text-blue-500 text-2xl mr-3"></i>
        <h2 class="text-2xl font-bold">Project Conclusion</h2>
      </div>
      <div class="grid md:grid-cols-2 gap-8">
        <div>
          <h3 class="text-xl font-semibold mb-4">Results</h3>
          <p class="text-gray-600 mb-4">${c.results ?? ''}</p>
        </div>
        <div>
          ${c.learned ? `
            <h3 class="text-xl font-semibold mb-4">Lessons Learned</h3>
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 flex gap-3">
              <i class="fas fa-lightbulb text-yellow-400 mt-1 flex-shrink-0"></i>
              <p class="text-sm text-yellow-700">${c.learned}</p>
            </div>` : ''}
          ${c.improvements?.length ? `
            <h3 class="text-xl font-semibold mb-4">Future Improvements</h3>
            <ul class="list-disc pl-6 space-y-2 text-gray-600">
              ${c.improvements.map(i => `<li>${i}</li>`).join('')}
            </ul>` : ''}
        </div>
      </div>
    `;
    section.appendChild(card);
    return section;
  },

  renderFooter(info: ProjectInfo, quickLinks: HTMLElement): HTMLElement {
    const footer = document.createElement('div');  // use div to avoid any potential footer CSS conflicts
    footer.className = 'bg-gray-800 text-white py-8 mt-12';
    const inner = document.createElement('div');
    inner.className = 'container mx-auto px-6';
    const grid = document.createElement('div');
    grid.className = 'grid md:grid-cols-3 gap-8';

    const col1 = document.createElement('div');
    col1.innerHTML = `<h3 class="text-lg font-semibold mb-4">Project Documentation</h3><p class="text-gray-400">Comprehensive report covering all aspects of the project development.</p>`;

    const col2 = document.createElement('div');
    col2.innerHTML = '<h3 class="text-lg font-semibold mb-4">Quick Links</h3>';
    col2.appendChild(quickLinks);

    const col3 = document.createElement('div');
    col3.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">Project Info</h3>
      <ul class="text-gray-400 space-y-2">
        <li class="flex items-center"><i class="fas fa-calendar-alt mr-2"></i><div><span class="block text-xs">Completion Date</span>${info.completion_date ?? 'N/A'}</div></li>
        <li class="flex items-center"><i class="fas fa-user mr-2"></i>Team: ${info.team_size ?? 1} ${(info.team_size ?? 1) === 1 ? 'Member' : 'Members'}</li>
        <li class="flex items-center"><i class="fas fa-clock mr-2"></i>Duration: ${info.duration ?? 'N/A'}</li>
      </ul>
      ${info.team_members?.length ? `
        <h4 class="text-sm font-semibold mt-4 mb-2 text-gray-300">Team Members</h4>
        <ul id="team-members" class="text-gray-400 text-sm space-y-1">
          ${info.team_members.map(m => `<li>${m.link ? `<a href="${m.link}" class="text-blue-400 hover:text-blue-300">${m.name}</a>` : m.name} — ${m.role}</li>`).join('')}
        </ul>` : ''}
    `;

    grid.appendChild(col1);
    grid.appendChild(col2);
    grid.appendChild(col3);
    inner.appendChild(grid);

    const copy = document.createElement('div');
    copy.className = 'border-t border-gray-700 mt-8 pt-8 text-center text-gray-400';
    copy.innerHTML = '<p>© 2025 Asger Stidsen. Written content may not be copied or reused. Code and layout may be used with proper credit.</p>';
    inner.appendChild(copy);

    footer.appendChild(inner);
    return footer;
  },
};
