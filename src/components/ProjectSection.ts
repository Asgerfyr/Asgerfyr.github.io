import { renderSubItem, renderImageGallery } from '../utils/project';
import { iconRegistry } from '../utils/icons';
import type { ProjectImage, SubSectionItem } from '../utils/project';

interface SectionImages { image_title?: string; image_elements: ProjectImage[]; }

export const ProjectSection = {
  async render(props: Record<string, unknown>): Promise<HTMLElement> {
    const icon    = (props.icon    as string) ?? 'box';
    const color   = (props.color   as string) ?? 'blue';
    const title   = (props.title   as string) ?? 'Section';
    const content = (props.content as Record<string, SubSectionItem[]>) ?? {};
    const images  = props.images   as SectionImages | undefined;

    // Create a safe slug id for the section heading so anchors work with special characters
    const slugify = (s: string) => {
      let str = (s || '').toString().trim();
      // strip HTML tags
      str = str.replace(/<[^>]*>/g, '');
      // try to normalize diacritics to ASCII (if supported)
      try {
        str = str.normalize('NFKD').replace(/\p{M}/gu, '');
      } catch (e) {
        // ignore if normalize with unicode properties unsupported
      }
      str = str.toLowerCase();
      // remove characters that are not alphanumeric, space, dash or underscore
      str = str.replace(/[^a-z0-9\s\-_]/g, '');
      // replace spaces and dashes with underscore
      str = str.replace(/[\s\-]+/g, '_');
      // collapse multiple underscores
      str = str.replace(/_+/g, '_');
      // trim leading/trailing underscores
      str = str.replace(/^_+|_+$/g, '');
      return '_' + (str || 'section');
    };

    // ensure id is unique in the document
    let baseId = slugify(title);
    let id = baseId;
    let suffix = 1;
    while (document.getElementById(id)) {
      id = `${baseId}_${suffix++}`;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'section-anchor mb-16 container mx-auto px-6';
    wrapper.id = id;

    // Add this section to the sticky nav (ProjectHeader must precede this in the layout)
    requestAnimationFrame(() => {
      const navLinks = document.getElementById('nav-links');
      const conclusionLink = document.getElementById('conclusion-link');
      if (navLinks && conclusionLink) {
        const a = document.createElement('a');
          a.className = 'nav-link section-item';
          // compute section index among existing section-items
          const existing = navLinks.querySelectorAll('.section-item').length;
          const idx = existing + 1;
          // use full title, CSS will handle overflow
          const titleText = title;
          // build structured content: number + text
          a.innerHTML = `<span class="section-number">${idx}</span><span class="section-text">${titleText}</span>`;
          a.href = `#${id}`;
          // show full title on hover via native tooltip
          a.title = title;
          a.setAttribute('data-section-index', String(idx));
          navLinks.insertBefore(a, conclusionLink);
          
          // Add smooth scrolling listener to this link
          a.addEventListener('click', (e) => {
            e.preventDefault();
            const targetElement = document.querySelector(`#${id}`);
            if (targetElement) {
              const offset = 80;
              const distanceToTargetY = targetElement.getBoundingClientRect().top - offset;
              smoothScrollTo(distanceToTargetY, 1000);
            }
          });
      }
    });

    // Smooth scroll helper function
    const smoothScrollTo = (distance: number, duration: number = 500) => {
      const startY = window.scrollY;
      let startTime: number | null = null;

      const animation = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutQuad(progress);

        window.scrollTo(0, startY + distance * ease);

        if (progress < 1) {
          requestAnimationFrame(animation);
        }
      };

      const easeInOutQuad = (t: number) => {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      };

      requestAnimationFrame(animation);
    };

    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8';
    
    // Render icon using the icon registry
    const iconHTML = iconRegistry.renderIconHTML(icon, {
      size: '1.5rem',
      className: `text-${color}-500`,
    });
    
    card.innerHTML = `
      <div class="flex items-center mb-6">
        <div style="margin-right: 0.75rem; display: flex; align-items: center; justify-content: center;">
          ${iconHTML}
        </div>
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
