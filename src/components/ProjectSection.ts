import { renderSubItem, renderImageGallery } from '../utils/project';
import { iconRegistry } from '../utils/icons';
import type { ProjectImage, SubSectionItem } from '../utils/project';

interface SectionImages { image_title?: string; image_elements: ProjectImage[]; }

export const ProjectSection = {
  render(props: Record<string, unknown> = {}): string {
    const icon    = (props.icon    as string) ?? 'box';
    const color   = (props.color   as string) ?? 'blue';
    const title   = (props.title   as string) ?? 'Section';
    const content = (props.content as Record<string, any[]>) ?? {};

    const colorMap: Record<string, { text: string }> = {
      blue: { text: '#3b82f6' },
      red: { text: '#ef4444' },
      green: { text: '#22c55e' },
      yellow: { text: '#eab308' },
      purple: { text: '#a855f7' },
      cyan: { text: '#06b6d4' },
      pink: { text: '#ec4899' },
      orange: { text: '#f97316' },
      indigo: { text: '#6366f1' },
    };
    const colors = colorMap[color] || colorMap.blue;

    // Render content subsections
    const contentHTML = Object.entries(content).map(([key, items]) => {
      const itemsHTML = (items || []).map((item: any) => {
        if (!item) return '';
        if (item.type === 'text') {
          return `<p class="text-gray-600 mb-4">${item.content || ''}</p>`;
        }
        if (item.type === 'list' && Array.isArray(item.content)) {
          const listItems = item.content.map((i: any) => 
            `<li>${typeof i === 'string' ? i : i?.text || ''}</li>`
          ).join('');
          return `<ul class="list-disc pl-6 space-y-2 text-gray-600 mb-4">${listItems}</ul>`;
        }
        if (item.type === 'checklist' && Array.isArray(item.content)) {
          const checklistItems = item.content.map((i: any) =>
            `<li class="flex items-center"><i class="fas fa-${i.checked ? 'check-circle text-green-500' : 'times-circle text-red-500'} mr-2"></i><span>${i.text || ''}</span></li>`
          ).join('');
          return `<div class="bg-gray-100 rounded-lg p-4 mb-4"><ul class="space-y-2">${checklistItems}</ul></div>`;
        }
        if (item.type === 'code') {
          const language = item.language || 'plaintext';
          return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code class="language-${language}">${item.content || ''}</code></pre>`;
        }
        if (item.type === 'table' && item.content?.headers && item.content?.rows) {
          const headerHTML = item.content.headers.map((h: any) => 
            `<th class="border border-gray-300 px-4 py-2 text-left font-semibold">${h}</th>`
          ).join('');
          const rowsHTML = item.content.rows.map((row: any[]) =>
            `<tr>${row.map(cell => `<td class="border border-gray-300 px-4 py-2">${Array.isArray(cell) ? cell.join(', ') : String(cell)}</td>`).join('')}</tr>`
          ).join('');
          return `<div class="overflow-x-auto mb-4"><table class="w-full border-collapse border border-gray-300"><thead><tr class="bg-gray-100">${headerHTML}</tr></thead><tbody>${rowsHTML}</tbody></table></div>`;
        }
        return '';
      }).join('');

      const keyHTML = key.toLowerCase() === 'null' ? '' : `<h3 class="text-xl font-semibold mb-4">${key}</h3>`;
      return `<div>${keyHTML}${itemsHTML}</div>`;
    }).join('');

    // Use iconRegistry to render icon with same styling as render()
    const iconHTML = iconRegistry.renderIconHTML(icon, {
      size: '1.5rem',
      className: `text-${color}-500`,
    });

    return `
      <div class="section-anchor mb-16 container mx-auto px-6">
        <div class="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
          <div class="flex items-center mb-6">
            ${iconHTML}
            <h2 class="text-2xl font-bold" style="margin-left: 0.75rem;">${title} Documentation</h2>
          </div>
          <div class="section-grid-container">
            ${contentHTML}
          </div>
        </div>
      </div>
    `;
  },
};
