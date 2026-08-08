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
          <button class="menu-button" id="nav-menu-btn">
            <i class="fas fa-bars" style="font-size: var(--big-font-size)"></i>
          </button>
          <div class="menu-content" id="nav-menu-content">
            <div class="flex-container" id="nav-menu">
              ${links.map(l => `<a href="${l.href}" class="color-menu-opstion">${l.text}</a>`).join('')}
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

    menuBtn?.addEventListener('click', () => menuContent?.classList.toggle('show'));

    window.addEventListener('click', (e) => {
      if (!(e.target as Element).closest('.menu-button')) {
        menuContent?.classList.remove('show');
      }
    });

    const themeBtn = nav.querySelector<HTMLButtonElement>('.theme-toggle');
    themeBtn?.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      themeBtn.classList.toggle('dark-theme');
    });

    return nav;
  },
};
