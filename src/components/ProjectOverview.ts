import { fetchIcons, renderImageGallery, ensureShowcase, openShowcase } from '../utils/project';
import type { ProjectIcon, ProjectImage } from '../utils/project';

interface Feature { icon: string; title: string; description: string; }

export const ProjectOverview = {
  async render(props: Record<string, unknown>): Promise<HTMLElement> {
    const description = (props.description as string) ?? '';
    const objectives  = (props.objectives  as string[]) ?? [];
    const features    = (props.features    as Feature[]) ?? [];
    const images      = (props.images      as ProjectImage[]) ?? [];

    const icons = features.length ? await fetchIcons() : {} as Record<string, ProjectIcon>;

    const wrapper = document.createElement('div');
    wrapper.id = 'overview';
    wrapper.className = 'section-anchor mb-16 container mx-auto px-6 pt-8';

    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8';
    card.innerHTML = `
      <div class="flex items-center mb-6">
        <i class="fas fa-info-circle text-blue-500 text-2xl mr-3"></i>
        <h2 class="text-xl font-bold">Project Overview</h2>
      </div>
      <div class="grid md:grid-cols-2 gap-8">
        <div>
          <h3 class="text-xl font-semibold mb-4">Project Description</h3>
          <p class="text-gray-600 mb-6">${description}</p>
          <h3 class="text-xl font-semibold mb-4">Objectives</h3>
          <ul class="list-disc pl-6 space-y-2 text-gray-600">
            ${objectives.map(o => `<li>${o}</li>`).join('')}
          </ul>
        </div>
        <div>
          <h3 class="text-xl font-semibold mb-4">Key Features</h3>
          <div class="space-y-4">
            ${features.map(f => {
              const ic = icons[f.icon] ?? icons['missingIcon'] ?? { name: 'question', color: 'gray' };
              return `
                <div class="flex items-start">
                  <div class="bg-${ic.color}-100 p-3 rounded-full mr-3 flex-shrink-0 flex justify-center items-center" style="width:2.5rem">
                    <i class="fas fa-${ic.name} text-${ic.color}-500"></i>
                  </div>
                  <div>
                    <h4 class="font-medium">${f.title}</h4>
                    <p class="text-sm text-gray-500">${f.description}</p>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>
      </div>
    `;
    wrapper.appendChild(card);

    if (images.length) {
      ensureShowcase();
      const imgCard = document.createElement('div');
      imgCard.className = 'bg-white rounded-xl shadow-md overflow-hidden p-6';
      imgCard.innerHTML = `
        <h3 class="text-xl font-semibold mb-6 flex items-center">
          <i class="fas fa-images text-blue-500 mr-3"></i>Project Images
        </h3>
        <div class="image-gallery"></div>
      `;
      const gallery = imgCard.querySelector('.image-gallery')!;
      images.forEach(img => {
        const item = document.createElement('div');
        item.className = 'image-card cursor-pointer';
        item.innerHTML = `<img src="${img.url}" alt="${img.alt}" class="w-full h-48 object-cover rounded-lg" /><p class="text-sm text-gray-500 mt-2 text-center">${img.caption ?? ''}</p>`;
        item.addEventListener('click', () => openShowcase(img.url, img.alt));
        gallery.appendChild(item);
      });
      wrapper.appendChild(imgCard);
    }

    return wrapper;
  },
};
