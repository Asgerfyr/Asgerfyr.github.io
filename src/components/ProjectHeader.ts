export const ProjectHeader = {
  render(props: Record<string, unknown>): HTMLElement {
    const title = (props.title as string) ?? 'Project';
    document.title = `${title} Documentation`;

    const div = document.createElement('div');
    div.className = 'bg-white shadow-md sticky top-0 z-40';
    div.innerHTML = `
      <a href="/" class="absolute top-3 left-3 text-blue-500"><i class="fa-solid fa-house"></i></a>
      <div class="container mx-auto px-6 pl-9 py-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center title-wrap">
            <i class="fas fa-project-diagram text-blue-500 text-2xl mr-3"></i>
            <div class="title">
              <h1 class="project-title">${title}</h1>
              <span class="project-subtitle">Documentation</span>
            </div>
          </div>

          <div class="actions" style="display:flex;align-items:center;gap:0.5rem">
            <button id="sections-toggle" class="menu-button" aria-expanded="false" aria-controls="nav-links">Sections ▼</button>
            <div id="nav-links" class="sections-panel" aria-hidden="true">
              <a href="#overview" class="nav-link">Overview</a>
              <a id="conclusion-link" href="#conclusion" class="nav-link">Conclusion</a>
            </div>
          </div>
        </div>
      </div>
    `;

    // add toggle behavior for sections dropdown
    setTimeout(() => {
      const toggle = div.querySelector('#sections-toggle') as HTMLButtonElement | null;
      const panel = div.querySelector('#nav-links') as HTMLElement | null;
      if (!toggle || !panel) return;
      function closePanel() {
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Sections ▼';
      }
      function openPanel() {
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.textContent = 'Sections ▲';
      }
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (panel.classList.contains('open')) closePanel(); else openPanel();
      });
      // close when clicking a link
      panel.addEventListener('click', (e) => { const t = e.target as HTMLElement; if (t && t.tagName === 'A') closePanel(); });
      // close on outside click
      document.addEventListener('click', (e) => {
        if (!div.contains(e.target as Node)) closePanel();
      });
    }, 50);

    return div;
  },
};
