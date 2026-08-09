interface TeamMember { name: string; role: string; link?: string; }

export const ProjectInfo = {
  render(props: Record<string, unknown>): HTMLElement {
    const date    = (props.completion_date as string)       ?? '';
    const size    = (props.team_size       as number)       ?? 1;
    const members = (props.team_members    as TeamMember[]) ?? [];
    const dur     = (props.duration        as string)       ?? '';
    const links   = (props.project_links   as Array<{ label: string; icon?: string; url: string }>) ?? [];

    const wrapper = document.createElement('div');
    wrapper.className = 'container mx-auto px-6 pb-8';

    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-md overflow-hidden p-6';
    
    let linksHtml = '';
    if (links.length) {
      linksHtml = `
        <div>
          <p class="text-xs text-gray-400 uppercase mb-3 font-semibold">Project Links</p>
          <div class="flex flex-wrap gap-3">
            ${links.map(l => {
              const isBrandIcon = ['github', 'gitlab', 'linkedin', 'twitter', 'facebook', 'instagram', 'youtube', 'discord'].includes(l.icon || '');
              const prefix = isBrandIcon ? 'fab' : 'fas';
              const iconHtml = l.icon ? `<i class="${prefix} fa-${l.icon}"></i>` : '';
              return `
                <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
                  ${iconHtml}
                  ${l.label}
                </a>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="flex items-center mb-6">
        <i class="fas fa-info text-blue-500 text-2xl mr-3"></i>
        <h2 class="text-2xl font-bold">Project Info</h2>
      </div>
      <div class="flex flex-wrap gap-8 text-gray-600">
        ${date  ? `<div><p class="text-xs text-gray-400 uppercase mb-1">Completion</p><p class="font-medium">${date}</p></div>` : ''}
        ${dur   ? `<div><p class="text-xs text-gray-400 uppercase mb-1">Duration</p><p class="font-medium">${dur}</p></div>` : ''}
        <div>
          <p class="text-xs text-gray-400 uppercase mb-1">Team</p>
          <p class="font-medium">${size === 1 ? 'Solo project' : `${size} members`}</p>
          ${members.length ? `<ul class="mt-2 space-y-1 text-sm">
            ${members.map(m => `<li>${m.link ? `<a href="${m.link}" class="text-blue-500 hover:underline">${m.name}</a>` : m.name} — ${m.role}</li>`).join('')}
          </ul>` : ''}
        </div>
      </div>
      ${linksHtml ? `<div class="mt-6 pt-6 border-t border-gray-200">${linksHtml}</div>` : ''}
    `;
    wrapper.appendChild(card);
    return wrapper;
  },
};
