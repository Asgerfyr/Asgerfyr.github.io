export const Skills = {
  render(_props: Record<string, unknown> = {}): string {
    return `
      <section id="skills" class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-center mb-4">
            My <span class="text-blue-600">Skills</span>
        </h2>
        <p class="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Here's an overview of my technical skills and expertise across different areas.
        </p>
        <div class="flex flex-col lg:flex-row gap-12">
          <div class="lg:w-1/3">
            <h3 class="text-xl font-semibold mb-6">Technical Skills</h3>
            <div class="space-y-6">
              <div class="flex justify-between mb-1 border-b"><span class="font-medium">JavaScript:</span><span class="font-medium">Erfaren+</span></div>
              <div class="flex justify-between mb-1 border-b"><span class="font-medium">Frontend:</span><span class="font-medium">Erfaren</span></div>
              <div class="flex justify-between mb-1 border-b"><span class="font-medium">C#:</span><span class="font-medium">middelmådig</span></div>
              <div class="flex justify-between mb-1 border-b"><span class="font-medium">Python:</span><span class="font-medium">Erfaren</span></div>
              <div class="flex justify-between mb-1 border-b"><span class="font-medium">Node and Express:</span><span class="font-medium">middelmådig</span></div>
              <div class="flex justify-between mb-1 border-b"><span class="font-medium">Database and Mysql:</span><span class="font-medium">middelmådig</span></div>
              <div class="flex justify-between mb-1 border-b"><span class="font-medium">3D modeling/3D printing:</span><span class="font-medium">Erfaren</span></div>
              <div class="flex justify-between mb-1 border-b"><span class="font-medium">Design brugergrænseflade:</span><span class="font-medium">begynder</span></div>
            </div>
          </div>
          <div class="lg:w-2/3">
            <span class="pb-5 pt-10 block">
              Jeg har erfaring med udvikling af både frontend- og backend-løsninger, herunder design af brugervenlige og strukturerede webapplikationer med fokus på sikkerhed, datastyring og rollebaseret adgang.
            </span>
            <span class="pb-5 block">
              Inden for hardware og embedded systemer har jeg erfaring med styring, automation og integration af sensorer og aktuatorer. Jeg kan designe kredsløb, udvikle firmware og opsætte trådløse systemer med fokus på stabilitet, funktionalitet og sikkerhed.
            </span>
            <span class="pb-5 block">
              Jeg har også erfaring med 3D-modellering og print, hvor jeg kan skabe kabinetter, mekaniske dele og strukturer, som kombinerer funktionalitet, præcision og brugervenlighed.
            </span>
          </div>
        </div>
      </section>
    `;
  },
};
