export const Navigation = {
  render(props: Record<string, unknown> = {}): string {
    const p = props as NavigationProps;
    const links = (p.links ?? []) as NavLinkProps[];

    return `
      <nav>
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
      </nav>
    `;
  },
};
