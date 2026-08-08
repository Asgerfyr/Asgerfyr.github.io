import type { HeaderProps } from '../types';

const TYPEWRITER_DATA = {
  strings: [
    { string: '', typeStyle: 'deleteTo', pauseFor: 500 },
    { string: 'Frontend Developer', pauseFor: 300 },
    { string: '<div class="type-error">Frontend</div> Developer', typeStyle: 'blink', pauseFor: 1000 },
    { string: '<div class="type-error">Frontend</div>', typeStyle: 'deleteTo' },
    { string: 'Frontend', typeStyle: 'blink' },
    { string: '', typeStyle: 'deleteTo', pauseFor: 1000 },
    { string: 'Backend Developer', pauseFor: 300 },
    { string: '<div class="type-error">Backend</div> Developer', typeStyle: 'blink', pauseFor: 1000 },
    { string: '<div class="type-error">Backend</div>', typeStyle: 'deleteTo' },
    { string: 'Backend', typeStyle: 'blink' },
    { string: '', typeStyle: 'deleteTo', pauseFor: 1000 },
    { string: 'Full Stack Dev', pauseFor: 1000 },
    { string: 'eloper', pauseFor: 4000 },
    { string: '', typeStyle: 'deleteTo', pauseFor: 1000 },
    { string: 'Keen interest in Math', pauseFor: 1000 },
    { string: '<div style="display:block;">Keen interest in Math</div>', typeStyle: 'blink', pauseFor: 100 },
    { string: 'and robotics', pauseFor: 2000 },
    { string: '<div style="display:block;">Keen interest in Math</div>', typeStyle: 'deleteTo' },
    { string: 'Keen interest in Math', typeStyle: 'blink' },
  ],
  typeSpeed: 60,
  loop: true,
};

export const Header = {
  render(props: Record<string, unknown>): HTMLElement {
    const p = props as HeaderProps;
    const name = p.name ?? 'Asger Stidsen';
    const subtitle = p.subtitle ?? 'The world need solutions not problems';
    const image = p.image ?? '';
    const imageText = p.imageText ?? '';
    const buttons = p.buttons ?? [{ text: 'Hire Me', href: '#contact' }, { text: 'View Work', href: '#projects' }];

    const header = document.createElement('header');
    header.id = 'header';
    header.innerHTML = `
      <div id="header-canvas"></div>
      <div id="header-skill-title" class="absolute">
        <div class="js-tryper-container">
          <h2 class="js-tryper" style="display: inline"></h2>
          <div class="js-curser" style="display: inline"></div>
        </div>
      </div>
      <div class="absolute" id="header-text-box">
        <h1>Hi, I'm <span class="color-title-highlight">${name}</span></h1>
        <h2 id="header-text-undertitle">${subtitle}</h2>
        <div class="flex-container pu-5">
          ${buttons.map(b => `<a class="a-button" href="${b.href}">${b.text}</a>`).join('')}
        </div>
      </div>
      <div class="overflow-hidden absolute" id="header-image-box">
        <div class="reletive skew-10 fill-y" id="header-image-container">
          <img src="${image}" alt="Profile Picture" class="fill-y" id="header-image" />
        </div>
      </div>
      <div class="highlight absolute bottom-90 no-wrap round-20 p5" id="header-image-text">
        ${imageText}
      </div>
    `;

    // Set typewriter data safely via dataset to avoid attribute escaping issues
    const typer = header.querySelector<HTMLElement>('.js-tryper');
    if (typer) typer.dataset.info = JSON.stringify(TYPEWRITER_DATA);

    // p5.js must be loaded in template head; load the flock sketch after header is appended
    requestAnimationFrame(() => {
      const s = document.createElement('script');
      s.src = '/js/index/p5_flock.js';
      document.body.appendChild(s);
    });

    return header;
  },
};
