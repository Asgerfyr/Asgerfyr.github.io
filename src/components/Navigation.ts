import type { NavigationProps, NavLinkProps } from '../types';

export const Navigation = {
  render(props: Record<string, unknown>): HTMLElement {
    const p = props as NavigationProps;
    const nav = document.createElement('nav');

    const links = (p.links ?? []) as NavLinkProps[];

    nav.innerHTML = `
      <div class="flex-container px-20">
        <div id="nav-header">
          <a href="#header" class="text-big color-title-highlight">${p.brand ?? 'Portfolio'}</a>
        </div>
        <div class="menu-container" id="nav-menu">
          <button class="menu-button" id="nav-menu-btn" aria-label="Toggle menu">
            <i class="fas fa-bars" style="font-size: var(--big-font-size)"></i>
          </button>
          <div class="menu-content" id="nav-menu-content">
            <div class="flex-container" id="nav-menu-items">
              ${links.map(l => `<a href="${l.href}" class="nav-menu-link">${l.text}</a>`).join('')}
              <button class="theme-toggle dark-theme menu-button">
                <i class="fa-solid fa-moon dark icon"></i>
                <i class="fa-solid fa-sun light icon"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const menuBtn = nav.querySelector<HTMLButtonElement>('#nav-menu-btn');
    const menuContent = nav.querySelector<HTMLElement>('#nav-menu-content');
    const menuLinks = nav.querySelectorAll<HTMLAnchorElement>('.nav-menu-link');

    menuBtn?.addEventListener('click', () => menuContent?.classList.toggle('show'));

    // Close menu when clicking outside
    window.addEventListener('click', (e) => {
      if (!(e.target as Element).closest('.menu-button') && !(e.target as Element).closest('.nav-menu-link')) {
        menuContent?.classList.remove('show');
      }
    });

    // Add smooth scrolling to menu links
    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href?.startsWith('#')) {
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            const offset = 80;
            const distanceToTargetY = targetElement.getBoundingClientRect().top - offset;
            smoothScrollTo(distanceToTargetY, 1000);
            menuContent?.classList.remove('show');
          }
        }
      });
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

    const themeBtn = nav.querySelector<HTMLButtonElement>('.theme-toggle');
    themeBtn?.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      themeBtn.classList.toggle('dark-theme');
    });

    return nav;
  },
};
