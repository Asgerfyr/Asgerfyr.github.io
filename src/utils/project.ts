export interface ProjectImage { url: string; alt: string; title?: string; caption?: string; }
export interface SubSectionItem { type: string; content: unknown; language?: string; }

// Lazily creates the fullscreen image showcase overlay once per page
export function ensureShowcase(): void {
  if (document.getElementById('image_showcase_container')) return;
  const el = document.createElement('div');
  el.id = 'image_showcase_container';
  el.className = 'invis fixed inset-0 z-50 flex items-center justify-content p-4 cursor-pointer';
  el.style.cssText = 'background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center';
  el.innerHTML = `
    <img id="image_showcase" src="" alt="" style="max-width:100%;max-height:100%;object-fit:contain;border-radius:10px;border:5px solid #242323;background-color:white" />
  `;
  el.addEventListener('click', () => el.classList.toggle('invis'));
  document.body.appendChild(el);
}

export function openShowcase(url: string, alt: string): void {
  ensureShowcase();
  const img = document.getElementById('image_showcase') as HTMLImageElement;
  img.src = url;
  img.alt = alt;
  document.getElementById('image_showcase_container')!.classList.remove('invis');
}

export function renderImageGallery(heading: string, images: ProjectImage[]): HTMLElement {
  ensureShowcase();
  const card = document.createElement('div');
  card.className = 'bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8';
  const h3 = document.createElement('h3');
  h3.className = 'text-xl font-semibold mb-6 flex items-center';
  h3.innerHTML = `<i class="fas fa-images text-blue-500 mr-3"></i>${heading}`;
  card.appendChild(h3);
  const gallery = document.createElement('div');
  gallery.className = 'image-gallery';

  images.forEach((img, index) => {
    const item = document.createElement('div');
    item.className = 'image-card cursor-pointer';
    item.innerHTML = `<img src="${img.url}" alt="${img.alt}" class="w-full h-48 object-cover rounded-lg bg-white" /><p class="text-sm text-gray-500 mt-2 text-center">${img.caption ?? ''}</p>`;

    item.addEventListener('click', (e) => {
      e.stopPropagation();
      openShowcase(img.url, img.alt);
    });

    gallery.appendChild(item);
  });

  // Clicking the overlay will unpin and close
  const container = document.getElementById('image_showcase_container');
  if (container) {
    container.addEventListener('click', () => {
      container.classList.add('invis');
    });
  }

  card.appendChild(gallery);
  return card;
}

export function renderSubItem(item: SubSectionItem): HTMLElement {
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
      pre.appendChild(code); wrap.appendChild(pre);
      return wrap;
    }
    case 'list': {
      const ul = document.createElement('ul');
      ul.className = 'list-disc pl-6 space-y-2 text-gray-600 mb-4';
      (item.content as string[]).forEach(t => {
        const li = document.createElement('li'); li.innerHTML = t; ul.appendChild(li);
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
      const hrow = document.createElement('tr');
      hrow.className = 'border-b';
      headers.forEach(h => {
        const th = document.createElement('th');
        th.className = 'text-left py-2 px-2'; th.innerHTML = h; hrow.appendChild(th);
      });
      thead.appendChild(hrow); table.appendChild(thead);
      const tbody = document.createElement('tbody');
      rows.forEach((row, i) => {
        const tr = document.createElement('tr');
        if (i < rows.length - 1) tr.className = 'border-b';
        row.forEach(cell => {
          const td = document.createElement('td');
          td.className = 'py-2 px-2 text-sm'; td.innerHTML = cell; tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody); wrap.appendChild(table);
      return wrap;
    }
    default: {
      const p = document.createElement('p');
      p.className = 'text-gray-400 text-sm mb-2';
      p.textContent = `[Unknown type: ${item.type}]`;
      return p;
    }
  }
}

// Image showcase utilities (rest of the file remains unchanged)
