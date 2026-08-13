import { ComponentRegistry } from './componentRegistry';
import { PageBuilder } from './pageBuilder';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { About } from './components/About';
import { ProjectList } from './components/ProjectList';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Html } from './components/Html';
import { Section } from './components/Section';
import { Grid } from './components/Grid';
import { CodeBlock } from './components/CodeBlock';
import { TypewriterText } from './components/TypewriterText';
import { ProjectViewer } from './components/ProjectViewer';
import { ProjectHeader } from './components/ProjectHeader';
import { ProjectOverview } from './components/ProjectOverview';
import { ProjectSection } from './components/ProjectSection';
import { ProjectConclusion } from './components/ProjectConclusion';
import { ProjectInfo } from './components/ProjectInfo';
import { ToTopArrow } from './components/ToTopArrow';

ComponentRegistry.register('Header', Header);
ComponentRegistry.register('Navigation', Navigation);
ComponentRegistry.register('About', About);
ComponentRegistry.register('ProjectList', ProjectList);
ComponentRegistry.register('Skills', Skills);
ComponentRegistry.register('Contact', Contact);
ComponentRegistry.register('Footer', Footer);
ComponentRegistry.register('Html', Html);
ComponentRegistry.register('Section', Section);
ComponentRegistry.register('Grid', Grid);
ComponentRegistry.register('CodeBlock', CodeBlock);
ComponentRegistry.register('TypewriterText', TypewriterText);
ComponentRegistry.register('ProjectViewer', ProjectViewer);
ComponentRegistry.register('ProjectHeader', ProjectHeader);
ComponentRegistry.register('ProjectOverview', ProjectOverview);
ComponentRegistry.register('ProjectSection', ProjectSection);
ComponentRegistry.register('ProjectConclusion', ProjectConclusion);
ComponentRegistry.register('ProjectInfo', ProjectInfo);
ComponentRegistry.register('ToTopArrow', ToTopArrow);

// Project card click handler (event delegation for static HTML - HOME PAGE ONLY)
// This handler is skipped for project_viewer since it has its own handlers
let page: string;

// Determine page from URL params
const pageFromURL = new URLSearchParams(window.location.search).get('page') ?? 'home';
page = pageFromURL;

if (page !== 'project_viewer') {
  document.addEventListener('click', async (e) => {
    const card = (e.target as HTMLElement).closest('.project-card');
    if (!card) return;

    // Find project key from card data attribute or id
    const projectKey = card.getAttribute('data-project-key');
    if (!projectKey) return;

    // Load project data and show modal
    try {
      const res = await fetch('/data/frontpage_project.json');
      const data = (await res.json()) as Record<string, any>;
      const project = data[projectKey];
      if (project) showProjectModal(project);
    } catch (err) {
      console.error('Failed to load project data:', err);
    }
  });
}

// Project modal display function
function showProjectModal(project: any) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(0,0,0,0.6)';

  const modal = document.createElement('div');
  modal.style.cssText = `background:var(--theme-section-background-color);color:var(--theme-text-color);border-radius:0.75rem;max-width:640px;width:100%;overflow:hidden;position:relative;box-shadow:0 25px 50px rgba(0,0,0,0.3);max-height:90vh;display:flex;flex-direction:column`;

  const img = document.createElement('img');
  img.src = project.image;
  img.alt = project.title;
  img.style.cssText = 'width:100%;height:220px;object-fit:cover;flex-shrink:0';

  const body = document.createElement('div');
  body.style.cssText = 'padding:1.5rem;overflow-y:auto';

  const titleEl = document.createElement('h2');
  titleEl.style.cssText = `font-size:1.5rem;font-weight:700;margin-bottom:0.5rem;color:var(--theme-text-color)`;
  titleEl.textContent = project.title;

  const dateEl = document.createElement('p');
  dateEl.style.cssText = `font-size:0.875rem;color:var(--theme-text-color);opacity:0.7;margin-bottom:1rem`;
  dateEl.textContent = project.date;

  const descEl = document.createElement('p');
  descEl.style.cssText = `color:var(--theme-text-color);margin-bottom:1rem;line-height:1.6;opacity:0.9`;
  descEl.textContent = project.sub_description;

  const tags = document.createElement('div');
  tags.style.cssText = 'display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.5rem';
  project.topicsSummery?.forEach((t: string) => {
    const span = document.createElement('span');
    span.style.cssText = `background:var(--theme-highlight-color);color:white;font-size:0.75rem;padding:0.25rem 0.625rem;border-radius:9999px;opacity:0.9`;
    span.textContent = t;
    tags.appendChild(span);
  });
  project.category?.forEach((c: string) => {
    const span = document.createElement('span');
    span.style.cssText = `background:var(--theme-subtle-standout-color);color:var(--theme-text-color);font-size:0.75rem;padding:0.25rem 0.625rem;border-radius:9999px;opacity:0.8`;
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
  body.appendChild(dateEl);
  body.appendChild(descEl);
  body.appendChild(tags);
  body.appendChild(actions);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = 'position:absolute;top:0.75rem;right:0.75rem;background:white;border:none;width:2rem;height:2rem;border-radius:50%;font-size:1.25rem;line-height:1;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center';

  const close = () => {
    overlay.style.pointerEvents = 'none';
    overlay.remove();
  };
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    close();
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      e.stopPropagation();
      close();
    }
  });
  modal.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { document.removeEventListener('keydown', esc); close(); }
  });

  modal.appendChild(img);
  modal.appendChild(body);
  modal.appendChild(closeBtn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

PageBuilder.render(`/data/pages/${page}.json`);

// ============================================
// ProjectViewer Page Logic
// ============================================
if (page === 'project_viewer') {
  interface Project {
    title: string;
    image: string;
    sub_description: string;
    date: string;
    topics: string[];
    topicsSummery: string[];
    category: string[];
    link: string;
    pageKey?: string;
  }

  // Load and initialize project viewer
  async function initProjectViewer() {
    try {
      const res = await fetch('/data/frontpage_project.json');
      const projectData = (await res.json()) as Record<string, Project>;
      const projects = Object.entries(projectData).map(([key, p]) => ({ key, ...p }));

      // Store projects and current state
      let allProjects = projects;
      let filteredProjects = [...allProjects];
      let activeFilters = new Set<string>();
      let sortBy: 'date' | 'name' = 'date';

      const categorySelectionDiv = document.getElementById('category-selection');
      const projectListDiv = document.getElementById('project-list');
      const searchInput = document.getElementById('pv-search') as HTMLInputElement;
      const allSelectionBtn = document.getElementById('all-selection');
      const sortByDateBtn = document.getElementById('sort-by-date');
      const sortByNameBtn = document.getElementById('sort-by-name');

      if (!categorySelectionDiv || !projectListDiv || !searchInput) {
        console.error('ProjectViewer DOM elements not found');
        return;
      }

      // Get unique categories
      const categories = new Set<string>();
      allProjects.forEach(p => {
        p.category.forEach(c => categories.add(c));
      });

      // Helper: reset category button to inactive state
      const resetCategoryBtn = (btn: HTMLElement) => {
        btn.classList.remove('active');
        btn.style.background = 'white';
        btn.style.color = 'var(--theme-text-color, #000)';
        btn.style.borderColor = '#ccc';
      };

      // Helper: set category button to active state
      const setActiveCategoryBtn = (btn: HTMLElement) => {
        btn.classList.add('active');
        btn.style.background = '#3b82f6';
        btn.style.color = 'white';
        btn.style.borderColor = '#3b82f6';
      };

      // Render category filter buttons
      categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-filter';
        btn.textContent = cat;
        btn.dataset.category = cat;
        btn.style.cssText = 'padding: 0.5rem 1rem; border: 1px solid #ccc; background: white; border-radius: 0.375rem; cursor: pointer; transition: all 0.2s ease; font-weight: 500;';
        btn.addEventListener('click', () => {
          // Deactivate "All" button if any category is selected
          if (activeFilters.size === 0) {
            allSelectionBtn!.classList.remove('active');
            allSelectionBtn!.style.background = 'white';
            allSelectionBtn!.style.color = 'var(--theme-text-color, #000)';
            allSelectionBtn!.style.borderColor = '#ccc';
          }

          if (activeFilters.has(cat)) {
            activeFilters.delete(cat);
            resetCategoryBtn(btn);
          } else {
            activeFilters.add(cat);
            setActiveCategoryBtn(btn);
          }
          updateProjectList();
        });
        categorySelectionDiv.appendChild(btn);
      });

      // Filter and render projects
      function updateProjectList() {
        // Filter by category
        if (activeFilters.size > 0) {
          filteredProjects = allProjects.filter(p =>
            p.category.some(c => activeFilters.has(c))
          );
        } else {
          filteredProjects = [...allProjects];
        }

        // Filter by search
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
          filteredProjects = filteredProjects.filter(p =>
            p.title.toLowerCase().includes(searchTerm) ||
            p.sub_description.toLowerCase().includes(searchTerm) ||
            p.topicsSummery.some(t => t.toLowerCase().includes(searchTerm))
          );
        }

        // Sort
        if (sortBy === 'date') {
          filteredProjects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else {
          filteredProjects.sort((a, b) => a.title.localeCompare(b.title));
        }

        // Render projects
        if (projectListDiv) {
          projectListDiv.innerHTML = filteredProjects.map(p => `
          <div class="project-card ${p.category.join(' ')}" data-project-key="${p.key}">
            <div class="h-48 overflow-hidden">
              <img src="${p.image}" alt="${p.title}" class="project-image transition duration-500 hover:scale-110" />
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-1">${p.title}</h3>
              <p class="text-sm text-gray-500 mb-3">${p.date}</p>
              <p class="text-gray-600 mb-4">${p.sub_description}</p>
              <div class="flex flex-wrap gap-2">
                ${p.topicsSummery.map(t => `<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${t}</span>`).join('')}
              </div>
            </div>
          </div>
        `).join('');

          // Re-attach click handlers to new cards
          projectListDiv.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', async () => {
              const projectKey = card.getAttribute('data-project-key');
              const project = allProjects.find(p => p.key === projectKey);
              if (project) showProjectModal(project);
            });
          });
        }
      }

      // Event listeners
      if (searchInput) {
        searchInput.addEventListener('input', updateProjectList);
      }

      allSelectionBtn?.addEventListener('click', () => {
        activeFilters.clear();
        // Reset all category buttons to inactive and remove their styles
        document.querySelectorAll('.category-filter').forEach(btn => {
          resetCategoryBtn(btn as HTMLElement);
        });
        // Style "All" button as active
        allSelectionBtn.classList.add('active');
        allSelectionBtn.style.background = '#3b82f6';
        allSelectionBtn.style.color = 'white';
        allSelectionBtn.style.borderColor = '#3b82f6';
        updateProjectList();
      });

      // Style "All" button initially
      allSelectionBtn!.style.cssText = 'padding: 0.5rem 1rem; border: 1px solid #3b82f6; background: #3b82f6; color: white; border-radius: 0.375rem; cursor: pointer; transition: all 0.2s ease; font-weight: 500;';
      allSelectionBtn!.classList.add('active');

      sortByDateBtn?.addEventListener('click', () => {
        sortBy = 'date';
        sortByDateBtn.classList.add('active');
        sortByDateBtn.style.opacity = '1';
        sortByNameBtn?.classList.remove('active');
        sortByNameBtn!.style.opacity = '0.6';
        updateProjectList();
      });

      sortByNameBtn?.addEventListener('click', () => {
        sortBy = 'name';
        sortByNameBtn.classList.add('active');
        sortByNameBtn.style.opacity = '1';
        sortByDateBtn?.classList.remove('active');
        sortByDateBtn!.style.opacity = '0.6';
        updateProjectList();
      });

      // Style sort buttons initially
      if (sortByDateBtn && sortByNameBtn) {
        (sortByDateBtn as HTMLElement).style.opacity = '1';
        (sortByNameBtn as HTMLElement).style.opacity = '0.6';
      }

      // Initial render
      updateProjectList();

    } catch (err) {
      console.error('Failed to initialize ProjectViewer:', err);
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectViewer);
  } else {
    initProjectViewer();
  }
}
