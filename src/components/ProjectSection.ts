import { fetchIcons, renderSubItem, renderImageGallery } from '../utils/project';
import type { ProjectImage, SubSectionItem } from '../utils/project';

interface SectionImages { image_title?: string; image_elements: ProjectImage[]; }

export const ProjectSection = {
  async render(props: Record<string, unknown>): Promise<HTMLElement> {
    const icon    = (props.icon    as string) ?? 'cube';
    const title   = (props.title   as string) ?? 'Section';
    const content = (props.content as Record<string, SubSectionItem[]>) ?? {};
    const images  = props.images   as SectionImages | undefined;

    const icons = await fetchIcons();
    const iconObj = icons[icon] ?? icons['missingIcon'] ?? { name: 'cube', color: 'blue' };

    const id = '_' + title.split(' ').join('_');
    const wrapper = document.createElement('div');
    wrapper.className = 'section-anchor mb-16 container mx-auto px-6';
    wrapper.id = id;

    // Add this section to the sticky nav (ProjectHeader must precede this in the layout)
    requestAnimationFrame(() => {
      const navLinks = document.getElementById('nav-links');
      const conclusionLink = document.getElementById('conclusion-link');
      if (navLinks && conclusionLink) {
        const a = document.createElement('a');
        a.className = 'nav-link';
        a.textContent = title;
        a.href = `#${id}`;
        navLinks.insertBefore(a, conclusionLink);
      }
    });

    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8';
    card.innerHTML = `
      <div class="flex items-center mb-6">
        <i class="fas fa-${iconObj.name} text-blue-500 text-2xl mr-3"></i>
        <h2 class="text-2xl font-bold">${title} Documentation</h2>
      </div>
    `;

    const grid = document.createElement('div');
    grid.className = 'section-grid-container';

    Object.entries(content).forEach(([key, subs]) => {
      const subDiv = document.createElement('div');
      const h3 = document.createElement('h3');
      h3.className = 'text-xl font-bold mb-4';
      h3.innerHTML = key.toLowerCase() === 'null' ? '' : key;
      subDiv.appendChild(h3);
      subs.forEach(item => {
        try { subDiv.appendChild(renderSubItem(item)); }
        catch (e) { console.error(`ProjectSection render error (${item.type}):`, e); }
      });
      grid.appendChild(subDiv);
    });

    card.appendChild(grid);
    wrapper.appendChild(card);

    if (images?.image_elements?.length) {
      wrapper.appendChild(
        renderImageGallery(`${title} ${images.image_title ?? 'Images'}`, images.image_elements)
      );
    }

    return wrapper;
  },
};
