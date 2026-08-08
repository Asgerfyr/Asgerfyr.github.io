export const ProjectConclusion = {
  render(props: Record<string, unknown>): HTMLElement {
    const results      = (props.results      as string)   ?? '';
    const learned      = (props.learned      as string)   ?? '';
    const improvements = (props.improvements as string[]) ?? [];

    const wrapper = document.createElement('div');
    wrapper.id = 'conclusion';
    wrapper.className = 'section-anchor container mx-auto px-6 pb-8';

    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-md overflow-hidden p-6';
    card.innerHTML = `
      <div class="flex items-center mb-6">
        <i class="fas fa-flag-checkered text-blue-500 text-2xl mr-3"></i>
        <h2 class="text-2xl font-bold">Project Conclusion</h2>
      </div>
      <div class="grid md:grid-cols-2 gap-8">
        <div>
          <h3 class="text-xl font-semibold mb-4">Results</h3>
          <p class="text-gray-600 mb-4">${results}</p>
        </div>
        <div>
          ${learned ? `
            <h3 class="text-xl font-semibold mb-4">Lessons Learned</h3>
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 flex gap-3">
              <i class="fas fa-lightbulb text-yellow-400 mt-1 flex-shrink-0"></i>
              <p class="text-sm text-yellow-700">${learned}</p>
            </div>` : ''}
          ${improvements.length ? `
            <h3 class="text-xl font-semibold mb-4">Future Improvements</h3>
            <ul class="list-disc pl-6 space-y-2 text-gray-600">
              ${improvements.map(i => `<li>${i}</li>`).join('')}
            </ul>` : ''}
        </div>
      </div>
    `;
    wrapper.appendChild(card);
    return wrapper;
  },
};
