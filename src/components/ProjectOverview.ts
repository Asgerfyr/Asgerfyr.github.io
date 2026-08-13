import { iconRegistry } from '../utils/icons';
import type { ProjectImage } from '../utils/project';

interface Feature { icon: string; title: string; description: string; color?: string; }

export const ProjectOverview = {
  render(props: Record<string, unknown> = {}): string {
    const description = (props.description as string) ?? '';
    const objectives  = (props.objectives  as string[]) ?? [];
    const features    = (props.features    as Feature[]) ?? [];
    const images      = (props.images      as ProjectImage[]) ?? [];

    const featureHTML = features.map(f => {
      const color = f.color || 'blue';
      const colorMap: Record<string, { bg: string; text: string }> = {
        blue: { bg: '#eff6ff', text: '#3b82f6' },
        red: { bg: '#fef2f2', text: '#ef4444' },
        green: { bg: '#f0fdf4', text: '#22c55e' },
        yellow: { bg: '#fefce8', text: '#eab308' },
        purple: { bg: '#faf5ff', text: '#a855f7' },
        cyan: { bg: '#ecf0ff', text: '#06b6d4' },
        pink: { bg: '#fdf2f8', text: '#ec4899' },
        orange: { bg: '#fff7ed', text: '#f97316' },
        indigo: { bg: '#eef2ff', text: '#6366f1' },
      };
      const colors = colorMap[color] || colorMap.blue;
      const iconHTML = iconRegistry.renderIconHTML(f.icon, {
        size: '1.25rem',
      });
      return `
        <div class="flex items-start">
          <div class="p-3 rounded-full mr-3 flex-shrink-0 flex justify-center items-center" style="width:2.5rem; background-color: ${colors.bg}; color: ${colors.text}">
            ${iconHTML}
          </div>
          <div>
            <h4 class="font-medium">${f.title}</h4>
            <p class="text-sm text-gray-500">${f.description}</p>
          </div>
        </div>`;
    }).join('');

    const objectivesHTML = objectives.map(o => `<li>${o}</li>`).join('');

    const imagesHTML = images.map(img => `
      <div class="image-card cursor-pointer">
        <img src="${img.url}" alt="${img.alt}" class="w-full h-48 object-cover rounded-lg">
        ${img.caption ? `<p class="text-sm text-gray-500 mt-2 text-center">${img.caption}</p>` : ''}
      </div>
    `).join('');

    const imagesSection = images.length > 0 ? `
      <div class="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8 mt-8">
        <h3 class="text-2xl font-bold mb-6 flex items-center">
          ${iconRegistry.renderIconHTML('images', {
            size: '1.5rem',
            className: 'text-blue-500 mr-3',
          })}Project Images
        </h3>
        <div class="image-gallery">
          ${imagesHTML}
        </div>
      </div>
    ` : '';

    return `
      <div id="overview" class="section-anchor mb-16 container mx-auto px-6 pt-8">
        <div class="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
          <div class="flex items-center mb-6">
            ${iconRegistry.renderIconHTML('info', {
              size: '1.5rem',
              className: 'text-blue-500 mr-3',
            })}
            <h2 class="text-2xl font-bold">Project Overview</h2>
          </div>
          <div class="grid md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-xl font-semibold mb-4">Project Description</h3>
              <p class="text-gray-600 mb-6">${description}</p>
              <h3 class="text-xl font-semibold mb-4">Objectives</h3>
              <ul class="list-disc pl-6 space-y-2 text-gray-600">
                ${objectivesHTML}
              </ul>
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-4">Key Features</h3>
              <div class="space-y-4">
                ${featureHTML}
              </div>
            </div>
          </div>
        </div>
        ${imagesSection}
      </div>
    `;
  },
};
