import { iconRegistry } from '../utils/icons';

export const ProjectConclusion = {
  render(props: Record<string, unknown> = {}): string {
    const results      = (props.results      as string)   ?? '';
    const learned      = (props.learned      as string)   ?? '';
    const improvements = (props.improvements as string[]) ?? [];

    const learnedHTML = learned ? `
      <h3 class="text-xl font-semibold mb-4">Lessons Learned</h3>
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 flex gap-3">
        ${iconRegistry.renderIconHTML('lightbulb', {
          size: '1.5rem',
          className: 'text-yellow-400 flex-shrink-0',
        })}
        <p class="text-sm text-yellow-700">${learned}</p>
      </div>
    ` : '';

    const improvementsHTML = improvements.length ? `
      <h3 class="text-xl font-semibold mb-4">Future Improvements</h3>
      <ul class="list-disc pl-6 space-y-2 text-gray-600">
        ${improvements.map(i => `<li>${i}</li>`).join('')}
      </ul>
    ` : '';

    return `
      <div id="conclusion" class="section-anchor container mx-auto px-6 pb-8">
        <div class="bg-white rounded-xl shadow-md overflow-hidden p-6">
          <div class="flex items-center mb-6">
            ${iconRegistry.renderIconHTML('award', {
              size: '1.5rem',
              className: 'text-blue-500 mr-3',
            })}
            <h2 class="text-2xl font-bold">Project Conclusion</h2>
          </div>
          <div class="grid md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-xl font-semibold mb-4">Results</h3>
              <p class="text-gray-600 mb-4">${results}</p>
            </div>
            <div>
              ${learnedHTML}
              ${improvementsHTML}
            </div>
          </div>
        </div>
      </div>
    `;
  },
};
