export const Footer = {
  render(_props: Record<string, unknown>): HTMLElement {
    const footer = document.createElement('footer');
    footer.className = 'bg-gray-800 text-white py-8';
    footer.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 mr-20">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <span class="text-xl font-bold">MyPortfolio</span>
            <p class="text-gray-400 mt-2 max-w-[40vw]">© 2025 Asger Stidsen. Written content may not be copied or reused.
              Code and layout may be used with proper credit.</p>
          </div>
          <div class="flex space-x-6">
            <a href="#header" class="text-gray-400 hover:text-white transition">Home</a>
            <a href="#about" class="text-gray-400 hover:text-white transition">About</a>
            <a href="#projects" class="text-gray-400 hover:text-white transition">Projects</a>
            <a href="#contact" class="text-gray-400 hover:text-white transition">Contact</a>
          </div>
        </div>
      </div>
    `;
    return footer;
  },
};
