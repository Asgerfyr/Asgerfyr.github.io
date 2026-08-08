const QUOTES_DATA = {
  strings: [
    { string: 'I think in patterns, not panic.', pauseFor: 5000 },
    { string: '', typeStyle: 'deleteTo', pauseFor: 300 },
    { string: 'I see every project as a chance to grow and contribute.', pauseFor: 5000 },
    { string: '', typeStyle: 'deleteTo', pauseFor: 300 },
    { string: 'Every problem is an opportunity in disguise.', pauseFor: 5000 },
    { string: '', typeStyle: 'deleteTo', pauseFor: 300 },
    { string: 'I genuinely enjoy figuring things out.', pauseFor: 5000 },
    { string: '', typeStyle: 'deleteTo', pauseFor: 300 },
    { string: 'I turn constraints into creative opportunities.', pauseFor: 5000 },
    { string: '', typeStyle: 'deleteTo', pauseFor: 300 },
    { string: 'Complexity does not scare me, it inspires me.', pauseFor: 5000 },
    { string: '', typeStyle: 'deleteTo', pauseFor: 300 },
    { string: 'I believe problem-solving should feel like play.', pauseFor: 5000 },
    { string: '', typeStyle: 'deleteTo', pauseFor: 300 },
    { string: 'I solve problems with curiosity, not just code.', pauseFor: 5000 },
    { string: '', typeStyle: 'deleteTo', pauseFor: 300 },
    { string: 'For me, coding is problem-solving with purpose.', pauseFor: 5000 },
    { string: '', typeStyle: 'deleteTo', pauseFor: 300 },
    { string: 'I do not look for quick fixes, I look for lasting solutions.', pauseFor: 5000 },
    { string: '', typeStyle: 'deleteTo', pauseFor: 300 },
    { string: 'I have fun making ideas work.', pauseFor: 5000 },
    { string: '', typeStyle: 'deleteTo', pauseFor: 300 },
  ],
  typeSpeed: 60,
  loop: true,
};

export const About = {
  render(_props: Record<string, unknown>): HTMLElement {
    const section = document.createElement('section');
    section.id = 'about';
    section.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">
          About <span class="text-blue-600">Me</span>
        </h2>
        <div class="flex flex-col gap-12 items-center">
          <div class="js-tryper-container">
            <p class="js-tryper" style="display: inline" id="quotes-typewriter"></p>
            <div class="js-curser" id="quotes-curser" style="display: inline"></div>
          </div>
          <div class="w-5/6">
            <h3 class="text-2xl font-semibold mb-4">Who am I?</h3>
            <div id="about-me" class="compresed mb-6">
              <div class="flex flex-col gap-8 about-text">
                <div>Mit navn er Asger, jeg er <span class="age"></span>-år og læser til softwareingeniør efter at have afsluttet en HTX med Matematik A, Fysik A og Programmering B. Jeg har en stor passion for at kode og udvikle løsninger - både digitale og fysiske - som gør hverdagen lettere og mere effektiv gennem automatisering.</div>
                <div>Mine interesser spænder bredt: fra hardware til backend, fra databasedesign til frontend-udvikling. Jeg ser mig selv som en fullstack-udvikler og nyder at arbejde i hele stacken - både når det handler om logik, struktur og brugeroplevelse.</div>
                <div>En særlig drivkraft for mig er arbejdet med robotter og fysiske enheder. Jeg fascineres af, hvordan nogle linjer kode kan få en fysisk maskine til at bevæge sig, reagere og udføre opgaver i den virkelige verden.</div>
                <div>Jeg prioriterer struktur og skalerbarhed i mine løsninger. Min <a href="/pages/project.html?project=portfolio-hjemmeside">portfolio-hjemmeside</a> er et eksempel: Den er bygget op omkring et JSON-baseret system, så nye projekter let kan tilføjes uden at kode en ny underside hver gang.</div>
                <div>Gennem mit studie har jeg opnået gode samarbejdsevner og erfaring med værktøjer som Git og versionsstyring i praksis.</div>
                <div>Du kan se nogle af mine projekter <a href="#projects">her</a>.</div>
              </div>
              <div id="fade"></div>
              <button id="about-me-read-more" onclick="readMore()">↓</button>
            </div>
            <div class="flex flex-wrap gap-x-12 gap-y-6">
              <div>
                <p class="font-medium"><span class="text-blue-600">Name:</span> Asger Grundtdal Stidsen</p>
                <p class="font-medium"><span class="text-blue-600">Email:</span> asger.g.stidsen@gmail.com</p>
              </div>
              <div>
                <p class="font-medium"><span class="text-blue-600">From:</span> Hadsten, Denmark</p>
                <p class="font-medium"><span class="text-blue-600">Currently:</span> Employed</p>
              </div>
            </div>
            <div class="mt-8 flex flex-wrap gap-x-8 gap-y-6">
              <a href="/pages/cv.html?download=false"
                class="mr-8 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition inline-flex items-center">
                Gå til CV <i class="fa-solid fa-file ml-2"></i>
              </a>
              <a target="_blank" rel="noopener noreferrer" href="/pages/cv.html?download=true"
                class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition inline-flex items-center">
                Download CV <i class="fas fa-download ml-2"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    const quotesTyper = section.querySelector<HTMLElement>('#quotes-typewriter');
    if (quotesTyper) quotesTyper.dataset.info = JSON.stringify(QUOTES_DATA);

    return section;
  },
};
