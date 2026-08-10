"use strict";
(() => {
  // src/componentRegistry.ts
  var ComponentRegistry = class {
    static register(name, component) {
      this.registry.set(name, component);
    }
    static get(name) {
      return this.registry.get(name);
    }
    static list() {
      return Array.from(this.registry.keys());
    }
  };
  ComponentRegistry.registry = /* @__PURE__ */ new Map();

  // src/pageBuilder.ts
  var PageBuilder = class _PageBuilder {
    static async renderDefs(defs, container) {
      for (const def of defs) {
        const Component = ComponentRegistry.get(def.component);
        if (!Component) {
          console.warn(`Component '${def.component}' not registered`);
          continue;
        }
        const el = await Component.render(def.props ?? {}, _PageBuilder.renderDefs.bind(_PageBuilder));
        container.appendChild(el);
      }
    }
    static async render(configPath) {
      try {
        const config = await this.loadConfig(configPath);
        document.title = config.pageTitle;
        const app = document.getElementById("app");
        if (!app)
          throw new Error("No #app element found");
        await _PageBuilder.renderDefs(config.layout, app);
        for (const src of config.scripts ?? []) {
          await this.loadScript(src);
        }
        const w = window;
        if (typeof w["addSmoothScrolling"] === "function")
          w["addSmoothScrolling"]();
        if (typeof w["age_insert"] === "function")
          w["age_insert"]();
        if (typeof w["semester_insert"] === "function")
          w["semester_insert"]();
        w["popup_element"] = document.getElementById("popup");
        const hljs = w["hljs"];
        if (typeof hljs?.["highlightAll"] === "function")
          hljs["highlightAll"]();
      } catch (error) {
        console.error("PageBuilder error:", error);
      }
    }
    static loadScript(src) {
      return new Promise((resolve) => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => resolve();
        s.onerror = () => resolve();
        document.body.appendChild(s);
      });
    }
    static async loadConfig(path) {
      if (path.includes("__preview")) {
        const stored = sessionStorage.getItem("creator-preview");
        if (!stored)
          throw new Error("No preview data \u2014 open from the Page Creator");
        return JSON.parse(stored);
      }
      const response = await fetch(path);
      if (!response.ok)
        throw new Error(`Failed to load config: ${path}`);
      return response.json();
    }
  };

  // src/components/Header.ts
  var TYPEWRITER_DATA = {
    strings: [
      { string: "", typeStyle: "deleteTo", pauseFor: 500 },
      { string: "Frontend Developer", pauseFor: 300 },
      { string: '<div class="type-error">Frontend</div> Developer', typeStyle: "blink", pauseFor: 1e3 },
      { string: '<div class="type-error">Frontend</div>', typeStyle: "deleteTo" },
      { string: "Frontend", typeStyle: "blink" },
      { string: "", typeStyle: "deleteTo", pauseFor: 1e3 },
      { string: "Backend Developer", pauseFor: 300 },
      { string: '<div class="type-error">Backend</div> Developer', typeStyle: "blink", pauseFor: 1e3 },
      { string: '<div class="type-error">Backend</div>', typeStyle: "deleteTo" },
      { string: "Backend", typeStyle: "blink" },
      { string: "", typeStyle: "deleteTo", pauseFor: 1e3 },
      { string: "Full Stack Dev", pauseFor: 1e3 },
      { string: "eloper", pauseFor: 4e3 },
      { string: "", typeStyle: "deleteTo", pauseFor: 1e3 },
      { string: "Keen interest in Math", pauseFor: 1e3 },
      { string: '<div style="display:block;">Keen interest in Math</div>', typeStyle: "blink", pauseFor: 100 },
      { string: "and robotics", pauseFor: 2e3 },
      { string: '<div style="display:block;">Keen interest in Math</div>', typeStyle: "deleteTo" },
      { string: "Keen interest in Math", typeStyle: "blink" }
    ],
    typeSpeed: 60,
    loop: true
  };
  var Header = {
    render(props) {
      const p = props;
      const name = p.name ?? "Asger Stidsen";
      const subtitle = p.subtitle ?? "The world need solutions not problems";
      const image = p.image ?? "";
      const imageText = p.imageText ?? "";
      const buttons = p.buttons ?? [{ text: "Hire Me", href: "#contact" }, { text: "View Work", href: "#projects" }];
      const header = document.createElement("header");
      header.id = "header";
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
          ${buttons.map((b) => `<a class="a-button" href="${b.href}">${b.text}</a>`).join("")}
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
      const typer = header.querySelector(".js-tryper");
      if (typer)
        typer.dataset.info = JSON.stringify(TYPEWRITER_DATA);
      requestAnimationFrame(() => {
        const s = document.createElement("script");
        s.src = "/js/index/p5_flock.js";
        document.body.appendChild(s);
      });
      return header;
    }
  };

  // src/components/Navigation.ts
  var Navigation = {
    render(props) {
      const p = props;
      const nav = document.createElement("nav");
      const links = p.links ?? [];
      nav.innerHTML = `
      <div class="flex-container px-20">
        <div id="nav-header">
          <a href="#header" class="text-big color-title-highlight">${p.brand ?? "Portfolio"}</a>
        </div>
        <div class="menu-container" id="nav-menu">
          <button class="menu-button" id="nav-menu-btn" aria-label="Toggle menu">
            <i class="fas fa-bars" style="font-size: var(--big-font-size)"></i>
          </button>
          <div class="menu-content" id="nav-menu-content">
            <div class="flex-container" id="nav-menu-items">
              ${links.map((l) => `<a href="${l.href}" class="nav-menu-link">${l.text}</a>`).join("")}
              <button class="theme-toggle dark-theme menu-button">
                <i class="fa-solid fa-moon dark icon"></i>
                <i class="fa-solid fa-sun light icon"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
      const menuBtn = nav.querySelector("#nav-menu-btn");
      const menuContent = nav.querySelector("#nav-menu-content");
      const menuLinks = nav.querySelectorAll(".nav-menu-link");
      menuBtn?.addEventListener("click", () => menuContent?.classList.toggle("show"));
      window.addEventListener("click", (e) => {
        if (!e.target.closest(".menu-button") && !e.target.closest(".nav-menu-link")) {
          menuContent?.classList.remove("show");
        }
      });
      menuLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const href = link.getAttribute("href");
          if (href?.startsWith("#")) {
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
              const offset = 80;
              const distanceToTargetY = targetElement.getBoundingClientRect().top - offset;
              smoothScrollTo(distanceToTargetY, 1e3);
              menuContent?.classList.remove("show");
            }
          }
        });
      });
      const smoothScrollTo = (distance, duration = 500) => {
        const startY = window.scrollY;
        let startTime = null;
        const animation = (currentTime) => {
          if (!startTime)
            startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);
          const ease = easeInOutQuad(progress);
          window.scrollTo(0, startY + distance * ease);
          if (progress < 1) {
            requestAnimationFrame(animation);
          }
        };
        const easeInOutQuad = (t) => {
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        };
        requestAnimationFrame(animation);
      };
      const themeBtn = nav.querySelector(".theme-toggle");
      themeBtn?.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        themeBtn.classList.toggle("dark-theme");
      });
      return nav;
    }
  };

  // src/components/About.ts
  var QUOTES_DATA = {
    strings: [
      { string: "I think in patterns, not panic.", pauseFor: 5e3 },
      { string: "", typeStyle: "deleteTo", pauseFor: 300 },
      { string: "I see every project as a chance to grow and contribute.", pauseFor: 5e3 },
      { string: "", typeStyle: "deleteTo", pauseFor: 300 },
      { string: "Every problem is an opportunity in disguise.", pauseFor: 5e3 },
      { string: "", typeStyle: "deleteTo", pauseFor: 300 },
      { string: "I genuinely enjoy figuring things out.", pauseFor: 5e3 },
      { string: "", typeStyle: "deleteTo", pauseFor: 300 },
      { string: "I turn constraints into creative opportunities.", pauseFor: 5e3 },
      { string: "", typeStyle: "deleteTo", pauseFor: 300 },
      { string: "Complexity does not scare me, it inspires me.", pauseFor: 5e3 },
      { string: "", typeStyle: "deleteTo", pauseFor: 300 },
      { string: "I believe problem-solving should feel like play.", pauseFor: 5e3 },
      { string: "", typeStyle: "deleteTo", pauseFor: 300 },
      { string: "I solve problems with curiosity, not just code.", pauseFor: 5e3 },
      { string: "", typeStyle: "deleteTo", pauseFor: 300 },
      { string: "For me, coding is problem-solving with purpose.", pauseFor: 5e3 },
      { string: "", typeStyle: "deleteTo", pauseFor: 300 },
      { string: "I do not look for quick fixes, I look for lasting solutions.", pauseFor: 5e3 },
      { string: "", typeStyle: "deleteTo", pauseFor: 300 },
      { string: "I have fun making ideas work.", pauseFor: 5e3 },
      { string: "", typeStyle: "deleteTo", pauseFor: 300 }
    ],
    typeSpeed: 60,
    loop: true
  };
  var About = {
    render(_props) {
      const section = document.createElement("section");
      section.id = "about";
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
                <div>Mit navn er Asger, jeg er <span class="age"></span>-\xE5r og l\xE6ser til softwareingeni\xF8r efter at have afsluttet en HTX med Matematik A, Fysik A og Programmering B. Jeg har en stor passion for at kode og udvikle l\xF8sninger - b\xE5de digitale og fysiske - som g\xF8r hverdagen lettere og mere effektiv gennem automatisering.</div>
                <div>Mine interesser sp\xE6nder bredt: fra hardware til backend, fra databasedesign til frontend-udvikling. Jeg ser mig selv som en fullstack-udvikler og nyder at arbejde i hele stacken - b\xE5de n\xE5r det handler om logik, struktur og brugeroplevelse.</div>
                <div>En s\xE6rlig drivkraft for mig er arbejdet med robotter og fysiske enheder. Jeg fascineres af, hvordan nogle linjer kode kan f\xE5 en fysisk maskine til at bev\xE6ge sig, reagere og udf\xF8re opgaver i den virkelige verden.</div>
                <div>Jeg prioriterer struktur og skalerbarhed i mine l\xF8sninger. Min <a href="/pages/project.html?project=portfolio-hjemmeside">portfolio-hjemmeside</a> er et eksempel: Den er bygget op omkring et JSON-baseret system, s\xE5 nye projekter let kan tilf\xF8jes uden at kode en ny underside hver gang.</div>
                <div>Gennem mit studie har jeg opn\xE5et gode samarbejdsevner og erfaring med v\xE6rkt\xF8jer som Git og versionsstyring i praksis.</div>
                <div>Du kan se nogle af mine projekter <a href="#projects">her</a>.</div>
              </div>
              <div id="fade"></div>
              <button id="about-me-read-more" onclick="readMore()">\u2193</button>
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
                G\xE5 til CV <i class="fa-solid fa-file ml-2"></i>
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
      const quotesTyper = section.querySelector("#quotes-typewriter");
      if (quotesTyper)
        quotesTyper.dataset.info = JSON.stringify(QUOTES_DATA);
      return section;
    }
  };

  // src/components/ProjectList.ts
  var ProjectList = {
    async render(props) {
      const p = props;
      const section = document.createElement("div");
      section.id = "projects";
      section.className = "py-20";
      const inner = document.createElement("div");
      inner.className = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
      section.appendChild(inner);
      inner.innerHTML = `
      <h2 class="text-3xl font-bold text-center mb-4">
        My <span class="text-blue-600">Projects</span>
      </h2>
      <p class="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        Here are some of my recent projects. Click on any project to view more details.
      </p>
      <div class="m-auto flex justify-center mb-12 w-2/3">
        <div class="project-filters inline-flex rounded-md shadow-sm">
          <button data-filter="all" class="filter-btn px-4 py-2 text-sm font-medium rounded-l-lg rounded-r bg-blue-600 text-white">
            All Projects
          </button>
        </div>
      </div>
      <div id="projects-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"></div>
      <div class="text-center mt-12">
        <a href="/pages/template.html?page=project_viewer"
          class="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition">
          View All Projects
        </a>
      </div>
    `;
      try {
        const res = await fetch(p.dataSource);
        const data = await res.json();
        const grid = inner.querySelector("#projects-grid");
        const filterBar = inner.querySelector(".project-filters");
        const entries = Object.entries(data).reverse();
        const categories = this.getTopCategories(data);
        this.addFilterButtons(filterBar, categories);
        entries.forEach(([key, project]) => grid.appendChild(this.renderCard(key, project)));
        this.setupFilters(inner);
      } catch (e) {
        console.error("ProjectList error:", e);
      }
      return section;
    },
    getTopCategories(data) {
      const counts = {};
      Object.values(data).forEach((p) => p.category.forEach((c) => {
        counts[c] = (counts[c] ?? 0) + 1;
      }));
      return Object.entries(counts).sort(([, a], [, b]) => b - a).map(([c]) => c);
    },
    addFilterButtons(bar, categories) {
      const allBtn = bar.querySelector('[data-filter="all"]');
      allBtn.classList.remove("rounded-r");
      categories.forEach((cat, i) => {
        const btn = document.createElement("button");
        btn.className = "filter-btn px-4 py-2 text-sm font-medium bg-white text-gray-700";
        if (i === categories.length - 1)
          btn.classList.add("rounded-r");
        btn.dataset.filter = cat;
        btn.textContent = cat;
        bar.appendChild(btn);
      });
    },
    setupFilters(container) {
      const filterBtns = container.querySelectorAll(".filter-btn");
      const cards = container.querySelectorAll(".project-card");
      filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          filterBtns.forEach((b) => b.classList.remove("bg-blue-600", "text-white"));
          filterBtns.forEach((b) => b.classList.add("bg-white", "text-gray-700"));
          btn.classList.add("bg-blue-600", "text-white");
          btn.classList.remove("bg-white", "text-gray-700");
          const filter = btn.dataset.filter ?? "all";
          cards.forEach((card) => {
            card.style.display = filter === "all" || card.classList.contains(filter) ? "" : "none";
          });
        });
      });
    },
    renderCard(key, project) {
      const card = document.createElement("div");
      card.className = "project-card";
      if (project.category.length)
        card.classList.add(...project.category);
      card.id = `Project-${key}`;
      const imageWrap = document.createElement("div");
      imageWrap.className = "h-48 overflow-hidden";
      const img = document.createElement("img");
      img.src = project.image;
      img.alt = project.title;
      img.className = "project-image transition duration-500 hover:scale-110";
      imageWrap.appendChild(img);
      const content = document.createElement("div");
      content.className = "p-6";
      const title = document.createElement("h3");
      title.className = "text-xl font-semibold mb-1 text-black";
      title.textContent = project.title;
      const date = document.createElement("p");
      date.className = "text-sm text-gray-500 mb-3";
      date.textContent = project.date;
      const desc = document.createElement("p");
      desc.className = "text-gray-600 mb-4";
      desc.textContent = project.sub_description;
      const topics = document.createElement("div");
      topics.className = "flex flex-wrap gap-2";
      project.topicsSummery.forEach((t) => {
        const span = document.createElement("span");
        span.className = "bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded";
        span.textContent = t;
        topics.appendChild(span);
      });
      content.appendChild(title);
      content.appendChild(date);
      content.appendChild(desc);
      content.appendChild(topics);
      card.appendChild(imageWrap);
      card.appendChild(content);
      card.addEventListener("click", () => this.showModal(project));
      return card;
    },
    showModal(project) {
      const overlay = document.createElement("div");
      overlay.style.cssText = "position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(0,0,0,0.6)";
      const modal = document.createElement("div");
      modal.style.cssText = `background:var(--theme-section-background-color);color:var(--theme-text-color);border-radius:0.75rem;max-width:640px;width:100%;overflow:hidden;position:relative;box-shadow:0 25px 50px rgba(0,0,0,0.3);max-height:90vh;display:flex;flex-direction:column`;
      const img = document.createElement("img");
      img.src = project.image;
      img.alt = project.title;
      img.style.cssText = "width:100%;height:220px;object-fit:cover;flex-shrink:0";
      const body = document.createElement("div");
      body.style.cssText = "padding:1.5rem;overflow-y:auto";
      const titleEl = document.createElement("h2");
      titleEl.style.cssText = `font-size:1.5rem;font-weight:700;margin-bottom:0.5rem;color:var(--theme-text-color)`;
      titleEl.textContent = project.title;
      const dateEl = document.createElement("p");
      dateEl.style.cssText = `font-size:0.875rem;color:var(--theme-text-color);opacity:0.7;margin-bottom:1rem`;
      dateEl.textContent = project.date;
      const descEl = document.createElement("p");
      descEl.style.cssText = `color:var(--theme-text-color);margin-bottom:1rem;line-height:1.6;opacity:0.9`;
      descEl.textContent = project.sub_description;
      const tags = document.createElement("div");
      tags.style.cssText = "display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.5rem";
      project.topicsSummery.forEach((t) => {
        const span = document.createElement("span");
        span.style.cssText = `background:var(--theme-highlight-color);color:white;font-size:0.75rem;padding:0.25rem 0.625rem;border-radius:9999px;opacity:0.9`;
        span.textContent = t;
        tags.appendChild(span);
      });
      project.category.forEach((c) => {
        const span = document.createElement("span");
        span.style.cssText = `background:var(--theme-subtle-standout-color);color:var(--theme-text-color);font-size:0.75rem;padding:0.25rem 0.625rem;border-radius:9999px;opacity:0.8`;
        span.textContent = c;
        tags.appendChild(span);
      });
      const actions = document.createElement("div");
      actions.style.cssText = "display:flex;gap:0.75rem;flex-wrap:wrap";
      const viewBtn = document.createElement("a");
      viewBtn.href = project.pageKey ? `/pages/template.html?page=${project.pageKey}` : `/pages/template.html?page=project&project=${encodeURIComponent(project.link)}`;
      viewBtn.style.cssText = "background:#3b82f6;color:white;padding:0.625rem 1.25rem;border-radius:0.5rem;text-decoration:none;font-weight:500;font-size:0.875rem";
      viewBtn.textContent = "View Full Project \u2192";
      actions.appendChild(viewBtn);
      body.appendChild(titleEl);
      body.appendChild(dateEl);
      body.appendChild(descEl);
      body.appendChild(tags);
      body.appendChild(actions);
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "\xD7";
      closeBtn.style.cssText = "position:absolute;top:0.75rem;right:0.75rem;background:white;border:none;width:2rem;height:2rem;border-radius:50%;font-size:1.25rem;line-height:1;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center";
      const close = () => overlay.remove();
      closeBtn.addEventListener("click", close);
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay)
          close();
      });
      document.addEventListener("keydown", function esc(e) {
        if (e.key === "Escape") {
          close();
          document.removeEventListener("keydown", esc);
        }
      });
      modal.appendChild(img);
      modal.appendChild(body);
      modal.appendChild(closeBtn);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
    }
  };

  // src/components/Skills.ts
  var Skills = {
    render(_props) {
      const section = document.createElement("section");
      section.id = "skills";
      section.className = "py-20";
      section.innerHTML = `
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
              <div class="flex justify-between mb-1 border-b"><span class="font-medium">C#:</span><span class="font-medium">middelm\xE5dig</span></div>
              <div class="flex justify-between mb-1 border-b"><span class="font-medium">Python:</span><span class="font-medium">Erfaren</span></div>
              <div class="flex justify-between mb-1 border-b"><span class="font-medium">Node and Express:</span><span class="font-medium">middelm\xE5dig</span></div>
              <div class="flex justify-between mb-1 border-b"><span class="font-medium">Database and Mysql:</span><span class="font-medium">middelm\xE5dig</span></div>
              <div class="flex justify-between mb-1 border-b"><span class="font-medium">3D modeling/3D printing:</span><span class="font-medium">Erfaren</span></div>
              <div class="flex justify-between mb-1 border-b"><span class="font-medium">Design brugergr\xE6nseflade:</span><span class="font-medium">begynder</span></div>
            </div>
          </div>
          <div class="lg:w-2/3">
            <span class="pb-5 pt-10 block">
              Jeg har erfaring med udvikling af b\xE5de frontend- og backend-l\xF8sninger, herunder design af brugervenlige og strukturerede webapplikationer med fokus p\xE5 sikkerhed, datastyring og rollebaseret adgang.
            </span>
            <span class="pb-5 block">
              Inden for hardware og embedded systemer har jeg erfaring med styring, automation og integration af sensorer og aktuatorer. Jeg kan designe kredsl\xF8b, udvikle firmware og ops\xE6tte tr\xE5dl\xF8se systemer med fokus p\xE5 stabilitet, funktionalitet og sikkerhed.
            </span>
            <span class="pb-5 block">
              Jeg har ogs\xE5 erfaring med 3D-modellering og print, hvor jeg kan skabe kabinetter, mekaniske dele og strukturer, som kombinerer funktionalitet, pr\xE6cision og brugervenlighed.
            </span>
          </div>
        </div>
      </div>
    `;
      return section;
    }
  };

  // src/components/Contact.ts
  var Contact = {
    render(_props) {
      const section = document.createElement("section");
      section.id = "contact";
      section.className = "py-20";
      section.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-4">
          Get In <span class="text-blue-600">Touch</span>
        </h2>
        <p class="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Have a project in mind or want to discuss potential opportunities? Feel free to reach out!
        </p>
        <div class="flex flex-col md:flex-row gap-12">
          <div class="md:w-1/2">
            <h3 class="text-xl font-semibold mb-6">Contact Information</h3>
            <div class="space-y-6">
              <div class="flex items-start">
                <div class="bg-blue-100 p-3 rounded-full mr-4"><i class="fas fa-envelope text-blue-600"></i></div>
                <div><h4 class="font-medium">Email</h4><p class="text-white-600">Asger.g.stidsen@gmail.com</p></div>
              </div>
              <div class="flex items-start">
                <div class="bg-blue-100 p-3 rounded-full mr-4"><i class="fas fa-phone-alt text-blue-600"></i></div>
                <div><h4 class="font-medium">Phone</h4><p class="text-white-600">+45 50 56 91 45</p></div>
              </div>
              <div class="flex items-start">
                <div class="bg-blue-100 p-3 rounded-full mr-4"><i class="fas fa-map-marker-alt text-blue-600"></i></div>
                <div><h4 class="font-medium">Location</h4><p class="text-white-600">Hadsten 8370, Denmark</p></div>
              </div>
            </div>
            <h3 class="text-xl font-semibold mt-10 mb-6">Follow Me</h3>
            <div class="flex space-x-4">
              <a href="https://github.com/asgerfyr" class="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition">
                <i class="fab fa-github"></i>
              </a>
              <a href="https://www.linkedin.com/in/asger-stidsen-a906902b0/" class="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition">
                <i class="fab fa-linkedin-in"></i>
              </a>
              <a href="https://stackoverflow.com/users/30637407/asger-stidsen" target="_blank" rel="noopener" class="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition">
                <i class="fab fa-stack-overflow"></i>
              </a>
            </div>
          </div>
          <div class="md:w-1/2">
            <form id="contact-form" class="bg-white p-6 rounded-lg shadow-md text-gray-700">
              <div class="mb-4">
                <label for="name" class="block text-gray-700 font-medium mb-2">Your Name</label>
                <input type="text" id="name" name="name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div class="mb-4">
                <label for="email" class="block text-gray-700 font-medium mb-2">Email Address</label>
                <input type="email" id="email" name="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div class="mb-4">
                <label for="subject" class="block text-gray-700 font-medium mb-2">Subject</label>
                <input type="text" id="subject" name="subject" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div class="mb-4">
                <label for="message" class="block text-gray-700 font-medium mb-2">Message</label>
                <textarea id="message" rows="4" name="message" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <button type="submit" class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <div id="popup">Beskeden er sendt</div>
    `;
      return section;
    }
  };

  // src/components/Footer.ts
  var Footer = {
    render(_props) {
      const footer = document.createElement("footer");
      footer.className = "bg-gray-800 text-white py-8";
      footer.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 mr-20">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <span class="text-xl font-bold">MyPortfolio</span>
            <p class="text-gray-400 mt-2 max-w-[40vw]">\xA9 2025 Asger Stidsen. Written content may not be copied or reused.
              Code and layout may be used with proper credit.</p>
          </div>
        </div>
      </div>
    `;
      return footer;
    }
  };

  // src/components/Html.ts
  var Html = {
    render(props) {
      const tag = props.tag || "div";
      const el = document.createElement(tag);
      if (props.className)
        el.className = props.className;
      if (props.id)
        el.id = props.id;
      el.innerHTML = props.html ?? "";
      return el;
    }
  };

  // src/components/Section.ts
  var Section = {
    async render(props, renderChildren) {
      const section = document.createElement("section");
      if (props.id)
        section.id = props.id;
      if (props.className)
        section.className = props.className;
      const inner = document.createElement("div");
      inner.className = props.innerClassName ?? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
      if (props.heading) {
        const h2 = document.createElement("h2");
        h2.className = "text-3xl font-bold text-center mb-12";
        h2.innerHTML = props.heading;
        inner.appendChild(h2);
      }
      const children = props.children;
      if (children?.length && renderChildren) {
        await renderChildren(children, inner);
      }
      section.appendChild(inner);
      return section;
    }
  };

  // src/components/Grid.ts
  var Grid = {
    async render(props, renderChildren) {
      const cols = props.columns ?? 2;
      const gap = props.gap ?? 8;
      const div = document.createElement("div");
      div.className = `grid grid-cols-1 md:grid-cols-${cols} gap-${gap}`;
      if (props.className)
        div.className += ` ${props.className}`;
      if (props.id)
        div.id = props.id;
      const children = props.children;
      if (children?.length && renderChildren) {
        await renderChildren(children, div);
      }
      return div;
    }
  };

  // src/components/CodeBlock.ts
  var CodeBlock = {
    render(props) {
      const wrapper = document.createElement("div");
      wrapper.className = "bg-gray-800 text-white rounded-lg p-3 text-sm mb-4 overflow-x-auto";
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      const lang = props.language;
      if (lang)
        code.className = `language-${lang}`;
      code.textContent = props.code ?? "";
      pre.appendChild(code);
      wrapper.appendChild(pre);
      return wrapper;
    }
  };

  // src/components/TypewriterText.ts
  var TypewriterText = {
    render(props) {
      const container = document.createElement("div");
      container.className = "js-tryper-container";
      const tag = props.tag || "p";
      const el = document.createElement(tag);
      el.className = "js-tryper";
      el.style.display = "inline";
      el.dataset.info = JSON.stringify({
        strings: props.strings ?? [],
        typeSpeed: props.typeSpeed ?? 60,
        loop: props.loop ?? true
      });
      const cursor = document.createElement("span");
      cursor.className = "js-curser";
      cursor.style.display = "inline";
      container.appendChild(el);
      container.appendChild(cursor);
      return container;
    }
  };

  // src/components/ProjectViewer.ts
  var ProjectViewer = {
    async render(_props) {
      if (!document.querySelector('link[href*="font-awesome"]')) {
        const faLink = document.createElement("link");
        faLink.rel = "stylesheet";
        faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
        document.head.appendChild(faLink);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      if (!document.querySelector('link[href="/css/project_viewer/style.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/css/project_viewer/style.css";
        document.head.appendChild(link);
      }
      document.title = "Project Viewer";
      const container = document.createElement("div");
      container.id = "page-container";
      container.innerHTML = `
      <div id="header">
        <a href="/" id="home" style="display: flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; color: #3b82f6;"><i class="fas fa-home" style="font-size: 1.25rem;"></i></a>
        <h1>Project Viewer</h1>
      </div>
      <div id="content-layout-container">
        <div id="sidebar">
          <input type="text" id="pv-search" placeholder="Search\u2026" />
          <div id="all-selection-container">
            <button id="all-selection" class="active">All</button>
          </div>
          <div id="category-selection"></div>
        </div>
        <div id="main-content">
          <div id="sorting-options">
            <button id="sort-by-date" class="sort_button active">Sort by Date <span class="arrow">\u2193</span></button>
            <button id="sort-by-name" class="sort_button">Sort by Name <span class="arrow">\u2193</span></button>
          </div>
          <div id="project-list"></div>
        </div>
      </div>
    `;
      let projects = [];
      const categories = /* @__PURE__ */ new Map();
      let selected = /* @__PURE__ */ new Set();
      let search = "";
      let sortType = "date";
      let sortOrder = "desc";
      const listEl = container.querySelector("#project-list");
      const catEl = container.querySelector("#category-selection");
      try {
        const data = await fetch("/data/frontpage_project.json").then((r) => r.json());
        projects = Object.entries(data).map(([id, p]) => ({
          id,
          title: p["title"] || id,
          link: p["link"] || id,
          image: p["image"] || "",
          categories: Array.isArray(p["category"]) ? p["category"] : [],
          description: p["description"] || "",
          sub_description: p["sub_description"] || "",
          date: p["date"] || "",
          topics: p["topics"] || [],
          topicsSummery: p["topicsSummery"] || [],
          pageKey: p["pageKey"] || void 0
        }));
        categories.clear();
        categories.set("All", projects.length);
        projects.forEach((p) => p.categories.forEach((c) => categories.set(c, (categories.get(c) ?? 0) + 1)));
      } catch (e) {
        console.error("ProjectViewer load error:", e);
        listEl.innerHTML = '<p style="padding:20px;color:red">Failed to load projects</p>';
        return container;
      }
      const getFiltered = () => {
        let r = [...projects];
        if (selected.size > 0) {
          r = r.filter((p) => p.categories.some((c) => selected.has(c)));
        }
        if (search) {
          const q = search.toLowerCase();
          r = r.filter(
            (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sub_description.toLowerCase().includes(q)
          );
        }
        r.sort((a, b) => {
          const cmp = sortType === "date" ? new Date(a.date || "2000").getTime() - new Date(b.date || "2000").getTime() : a.title.localeCompare(b.title);
          return sortOrder === "asc" ? cmp : -cmp;
        });
        return r;
      };
      const refresh = () => {
        listEl.innerHTML = "";
        const filtered = getFiltered();
        if (!filtered.length) {
          listEl.innerHTML = '<p class="no-results" style="padding:20px;color:gray">No projects found</p>';
          return;
        }
        filtered.forEach((p) => listEl.appendChild(makeCard(p)));
      };
      const buildCategories = () => {
        catEl.innerHTML = "";
        const allBtn = container.querySelector("#all-selection");
        allBtn.className = selected.size === 0 ? "active" : "";
        allBtn.onclick = () => {
          selected.clear();
          buildCategories();
          refresh();
        };
        [...categories.entries()].filter(([c]) => c !== "All").forEach(([cat]) => {
          const label = document.createElement("label");
          label.className = "category-checkbox-label";
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.className = "category-checkbox";
          checkbox.checked = selected.has(cat);
          checkbox.onchange = function() {
            if (this.checked) {
              selected.add(cat);
            } else {
              selected.delete(cat);
            }
            buildCategories();
            refresh();
          };
          const text = document.createElement("span");
          text.textContent = `${cat} (${categories.get(cat)})`;
          label.appendChild(checkbox);
          label.appendChild(text);
          catEl.appendChild(label);
        });
      };
      const makeCard = (p) => {
        const card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML = `
        <div class="project-image-wrap">
          <img src="${p.image}" alt="${p.title}" class="project-image" />
        </div>
        <div class="project-content">
          <h3 class="project-title">${p.title}</h3>
          <p class="project-description">${p.sub_description || p.description}</p>
          <div class="project-meta">
            <div class="categories">${p.categories.map((c) => `<span class="category">${c}</span>`).join("")}</div>
            ${p.date ? `<span class="date">${p.date}</span>` : ""}
          </div>
        </div>
      `;
        card.addEventListener("click", () => showModal(p));
        return card;
      };
      const showModal = (p) => {
        const wrap = document.createElement("div");
        wrap.className = "modal-wrapper";
        wrap.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-container">
          <button class="modal-close" aria-label="Close">\xD7</button>
          <div class="modal-content">
            <div class="modal-header"><h2 class="modal-title">${p.title}</h2></div>
            <div class="modal-body">
              <div class="modal-image"><img src="${p.image}" alt="${p.title}" /></div>
              <div class="modal-info">
                ${p.sub_description ? `<section class="modal-section"><h3>Overview</h3><p class="modal-overview">${p.sub_description}</p></section>` : ""}
                <section class="modal-section"><h3>Description</h3><p class="modal-description">${p.description}</p></section>
                ${p.topics.length ? `<section class="modal-section"><h3>Technologies</h3><div class="modal-topics">${p.topics.map((t) => `<span class="topic-tag">${t}</span>`).join("")}</div></section>` : ""}
              </div>
            </div>
            <div class="modal-footer">
              <div class="modal-actions">
                <a href="${p.pageKey ? `/pages/template.html?page=${p.pageKey}` : `/pages/template.html?page=project&project=${encodeURIComponent(p.link)}`}" class="btn btn-primary">View Full Project</a>
              </div>
            </div>
          </div>
        </div>
      `;
        const close = () => {
          wrap.classList.add("modal-closing");
          setTimeout(() => {
            wrap.remove();
            document.body.classList.remove("modal-open");
          }, 300);
        };
        wrap.querySelector(".modal-close").addEventListener("click", close);
        wrap.querySelector(".modal-overlay").addEventListener("click", close);
        document.addEventListener("keydown", function esc(e) {
          if (e.key === "Escape") {
            close();
            document.removeEventListener("keydown", esc);
          }
        });
        document.body.classList.add("modal-open");
        document.body.appendChild(wrap);
        requestAnimationFrame(() => wrap.classList.add("modal-open"));
      };
      container.querySelector("#sort-by-date").addEventListener("click", function() {
        const other = container.querySelector("#sort-by-name");
        if (this.classList.contains("active")) {
          sortOrder = sortOrder === "asc" ? "desc" : "asc";
          this.querySelector(".arrow").textContent = sortOrder === "asc" ? "\u2191" : "\u2193";
        } else {
          other.classList.remove("active");
          this.classList.add("active");
          sortType = "date";
          sortOrder = "asc";
          this.querySelector(".arrow").textContent = "\u2191";
        }
        refresh();
      });
      container.querySelector("#sort-by-name").addEventListener("click", function() {
        const other = container.querySelector("#sort-by-date");
        if (this.classList.contains("active")) {
          sortOrder = sortOrder === "asc" ? "desc" : "asc";
          this.querySelector(".arrow").textContent = sortOrder === "asc" ? "\u2191" : "\u2193";
        } else {
          other.classList.remove("active");
          this.classList.add("active");
          sortType = "name";
          sortOrder = "asc";
          this.querySelector(".arrow").textContent = "\u2191";
        }
        refresh();
      });
      container.querySelector("#pv-search").addEventListener("input", function() {
        search = this.value;
        refresh();
      });
      buildCategories();
      refresh();
      return container;
    }
  };

  // src/components/ProjectHeader.ts
  var ProjectHeader = {
    render(props) {
      const title = props.title ?? "Project";
      document.title = `${title} Documentation`;
      const div = document.createElement("div");
      div.className = "bg-white shadow-md sticky top-0 z-40";
      div.innerHTML = `
      <a href="/" class="absolute top-3 left-3 text-blue-500"><i class="fas fa-home"></i></a>
      <div class="container mx-auto px-6 pl-9 py-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center title-wrap">
            <i class="fas fa-project-diagram text-blue-500 text-2xl mr-3"></i>
            <div class="title">
              <h1 class="project-title">${title}</h1>
              <span class="project-subtitle">Documentation</span>
            </div>
          </div>

          <div class="actions" style="display:flex;align-items:center;gap:0.5rem">
            <button id="sections-toggle" class="menu-button" aria-expanded="false" aria-controls="nav-links">Sections \u25BC</button>
            <div id="nav-links" class="sections-panel" aria-hidden="true">
              <a href="#overview" class="nav-link">Overview</a>
              <a id="conclusion-link" href="#conclusion" class="nav-link">Conclusion</a>
            </div>
          </div>
        </div>
      </div>
    `;
      setTimeout(() => {
        const toggle = div.querySelector("#sections-toggle");
        const panel = div.querySelector("#nav-links");
        if (!toggle || !panel)
          return;
        function closePanel() {
          panel.classList.remove("open");
          panel.setAttribute("aria-hidden", "true");
          toggle.setAttribute("aria-expanded", "false");
          toggle.textContent = "Sections \u25BC";
        }
        function openPanel() {
          panel.classList.add("open");
          panel.setAttribute("aria-hidden", "false");
          toggle.setAttribute("aria-expanded", "true");
          toggle.textContent = "Sections \u25B2";
        }
        toggle.addEventListener("click", (e) => {
          e.stopPropagation();
          if (panel.classList.contains("open"))
            closePanel();
          else
            openPanel();
        });
        panel.addEventListener("click", (e) => {
          const t = e.target;
          if (t && t.tagName === "A")
            closePanel();
        });
        document.addEventListener("click", (e) => {
          if (!div.contains(e.target))
            closePanel();
        });
      }, 50);
      return div;
    }
  };

  // src/utils/project.ts
  function ensureShowcase() {
    if (document.getElementById("image_showcase_container"))
      return;
    const el = document.createElement("div");
    el.id = "image_showcase_container";
    el.className = "invis fixed inset-0 z-50 flex items-center justify-content p-4 cursor-pointer";
    el.style.cssText = "background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center";
    el.innerHTML = `
    <img id="image_showcase" src="" alt="" style="max-width:100%;max-height:100%;object-fit:contain;border-radius:10px;border:5px solid #242323;background-color:white" />
    <div id="showcase-nav" style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:white;text-align:center;font-size:14px;opacity:0.7">
      <p>Use \u2190 \u2192 arrow keys to navigate</p>
    </div>
  `;
    el.addEventListener("click", () => el.classList.toggle("invis"));
    document.body.appendChild(el);
  }
  function openShowcase(url, alt) {
    ensureShowcase();
    const img = document.getElementById("image_showcase");
    img.src = url;
    img.alt = alt;
    document.getElementById("image_showcase_container").classList.remove("invis");
  }
  function renderImageGallery(heading, images) {
    ensureShowcase();
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8";
    const h3 = document.createElement("h3");
    h3.className = "text-xl font-semibold mb-6 flex items-center";
    h3.innerHTML = `<i class="fas fa-images text-blue-500 mr-3"></i>${heading}`;
    card.appendChild(h3);
    const gallery = document.createElement("div");
    gallery.className = "image-gallery";
    let currentImageIndex = 0;
    let pinnedItem = null;
    function updateShowcaseImage(index) {
      if (index >= 0 && index < images.length) {
        currentImageIndex = index;
        openShowcase(images[index].url, images[index].alt);
      }
    }
    const items = [];
    images.forEach((img, index) => {
      const item = document.createElement("div");
      item.className = "image-card cursor-pointer";
      item.innerHTML = `<img src="${img.url}" alt="${img.alt}" class="w-full h-48 object-cover rounded-lg bg-white" /><p class="text-sm text-gray-500 mt-2 text-center">${img.caption ?? ""}</p>`;
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const container2 = document.getElementById("image_showcase_container");
        if (!container2)
          return;
        if (pinnedItem === item) {
          pinnedItem = null;
          container2.classList.add("invis");
        } else {
          pinnedItem = item;
          currentImageIndex = index;
          openShowcase(img.url, img.alt);
        }
      });
      items.push(item);
      gallery.appendChild(item);
    });
    const handleKeyDown = (e) => {
      if (!pinnedItem)
        return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const newIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateShowcaseImage(newIndex);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const newIndex = (currentImageIndex + 1) % images.length;
        updateShowcaseImage(newIndex);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    const container = document.getElementById("image_showcase_container");
    if (container) {
      container.addEventListener("click", () => {
        pinnedItem = null;
        container.classList.add("invis");
      });
    }
    card.appendChild(gallery);
    return card;
  }
  function renderSubItem(item) {
    switch (item.type) {
      case "text": {
        const p = document.createElement("p");
        p.className = "text-gray-600 mb-4";
        p.innerHTML = item.content;
        return p;
      }
      case "code": {
        const wrap = document.createElement("div");
        wrap.className = "bg-gray-800 text-white rounded-lg p-2 text-sm mb-4";
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        if (item.language)
          code.className = `language-${item.language}`;
        code.innerHTML = item.content;
        pre.appendChild(code);
        wrap.appendChild(pre);
        return wrap;
      }
      case "list": {
        const ul = document.createElement("ul");
        ul.className = "list-disc pl-6 space-y-2 text-gray-600 mb-4";
        item.content.forEach((t) => {
          const li = document.createElement("li");
          li.innerHTML = t;
          ul.appendChild(li);
        });
        return ul;
      }
      case "checklist": {
        const wrap = document.createElement("div");
        wrap.className = "bg-gray-100 rounded-lg p-4 mb-4";
        const ul = document.createElement("ul");
        ul.className = "space-y-2";
        item.content.forEach(({ checked, text }) => {
          const li = document.createElement("li");
          li.className = "flex items-center";
          li.innerHTML = `<i class="fas fa-${checked ? "check-circle text-green" : "times-circle text-red"}-500 mr-2"></i><span>${text}</span>`;
          ul.appendChild(li);
        });
        wrap.appendChild(ul);
        return wrap;
      }
      case "table": {
        const { headers, rows } = item.content;
        const wrap = document.createElement("div");
        wrap.className = "table-overflow bg-gray-100 rounded-lg p-4 mb-4";
        const table = document.createElement("table");
        table.className = "w-full";
        const thead = document.createElement("thead");
        const hrow = document.createElement("tr");
        hrow.className = "border-b";
        headers.forEach((h) => {
          const th = document.createElement("th");
          th.className = "text-left py-2 px-2";
          th.innerHTML = h;
          hrow.appendChild(th);
        });
        thead.appendChild(hrow);
        table.appendChild(thead);
        const tbody = document.createElement("tbody");
        rows.forEach((row, i) => {
          const tr = document.createElement("tr");
          if (i < rows.length - 1)
            tr.className = "border-b";
          row.forEach((cell) => {
            const td = document.createElement("td");
            td.className = "py-2 px-2 text-sm";
            td.innerHTML = cell;
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        wrap.appendChild(table);
        return wrap;
      }
      default: {
        const p = document.createElement("p");
        p.className = "text-gray-400 text-sm mb-2";
        p.textContent = `[Unknown type: ${item.type}]`;
        return p;
      }
    }
  }

  // src/components/ProjectOverview.ts
  var ProjectOverview = {
    async render(props) {
      const description = props.description ?? "";
      const objectives = props.objectives ?? [];
      const features = props.features ?? [];
      const images = props.images ?? [];
      const wrapper = document.createElement("div");
      wrapper.id = "overview";
      wrapper.className = "section-anchor mb-16 container mx-auto px-6 pt-8";
      const card = document.createElement("div");
      card.className = "bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8";
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
            ${objectives.map((o) => `<li>${o}</li>`).join("")}
          </ul>
        </div>
        <div>
          <h3 class="text-xl font-semibold mb-4">Key Features</h3>
          <div class="space-y-4">
            ${features.map((f) => {
        const color = f.color || "blue";
        return `
                <div class="flex items-start">
                  <div class="bg-${color}-100 p-3 rounded-full mr-3 flex-shrink-0 flex justify-center items-center" style="width:2.5rem">
                    <i class="fas fa-${f.icon} text-${color}-500"></i>
                  </div>
                  <div>
                    <h4 class="font-medium">${f.title}</h4>
                    <p class="text-sm text-gray-500">${f.description}</p>
                  </div>
                </div>`;
      }).join("")}
          </div>
        </div>
      </div>
    `;
      wrapper.appendChild(card);
      if (images.length) {
        ensureShowcase();
        const imgCard = document.createElement("div");
        imgCard.className = "bg-white rounded-xl shadow-md overflow-hidden p-6";
        imgCard.innerHTML = `
        <h3 class="text-xl font-semibold mb-6 flex items-center">
          <i class="fas fa-images text-blue-500 mr-3"></i>Project Images
        </h3>
        <div class="image-gallery"></div>
      `;
        const gallery = imgCard.querySelector(".image-gallery");
        images.forEach((img) => {
          const item = document.createElement("div");
          item.className = "image-card cursor-pointer";
          item.innerHTML = `<img src="${img.url}" alt="${img.alt}" class="w-full h-48 object-cover rounded-lg" /><p class="text-sm text-gray-500 mt-2 text-center">${img.caption ?? ""}</p>`;
          item.addEventListener("click", () => openShowcase(img.url, img.alt));
          gallery.appendChild(item);
        });
        wrapper.appendChild(imgCard);
      }
      return wrapper;
    }
  };

  // src/components/ProjectSection.ts
  var ProjectSection = {
    async render(props) {
      const icon = props.icon ?? "cube";
      const color = props.color ?? "blue";
      const title = props.title ?? "Section";
      const content = props.content ?? {};
      const images = props.images;
      const slugify = (s) => {
        let str = (s || "").toString().trim();
        str = str.replace(/<[^>]*>/g, "");
        try {
          str = str.normalize("NFKD").replace(/\p{M}/gu, "");
        } catch (e) {
        }
        str = str.toLowerCase();
        str = str.replace(/[^a-z0-9\s\-_]/g, "");
        str = str.replace(/[\s\-]+/g, "_");
        str = str.replace(/_+/g, "_");
        str = str.replace(/^_+|_+$/g, "");
        return "_" + (str || "section");
      };
      let baseId = slugify(title);
      let id = baseId;
      let suffix = 1;
      while (document.getElementById(id)) {
        id = `${baseId}_${suffix++}`;
      }
      const wrapper = document.createElement("div");
      wrapper.className = "section-anchor mb-16 container mx-auto px-6";
      wrapper.id = id;
      requestAnimationFrame(() => {
        const navLinks = document.getElementById("nav-links");
        const conclusionLink = document.getElementById("conclusion-link");
        if (navLinks && conclusionLink) {
          const a = document.createElement("a");
          a.className = "nav-link section-item";
          const existing = navLinks.querySelectorAll(".section-item").length;
          const idx = existing + 1;
          const titleText = title;
          a.innerHTML = `<span class="section-number">${idx}</span><span class="section-text">${titleText}</span>`;
          a.href = `#${id}`;
          a.title = title;
          a.setAttribute("data-section-index", String(idx));
          navLinks.insertBefore(a, conclusionLink);
          a.addEventListener("click", (e) => {
            e.preventDefault();
            const targetElement = document.querySelector(`#${id}`);
            if (targetElement) {
              const offset = 80;
              const distanceToTargetY = targetElement.getBoundingClientRect().top - offset;
              smoothScrollTo(distanceToTargetY, 1e3);
            }
          });
        }
      });
      const smoothScrollTo = (distance, duration = 500) => {
        const startY = window.scrollY;
        let startTime = null;
        const animation = (currentTime) => {
          if (!startTime)
            startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);
          const ease = easeInOutQuad(progress);
          window.scrollTo(0, startY + distance * ease);
          if (progress < 1) {
            requestAnimationFrame(animation);
          }
        };
        const easeInOutQuad = (t) => {
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        };
        requestAnimationFrame(animation);
      };
      const card = document.createElement("div");
      card.className = "bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8";
      card.innerHTML = `
      <div class="flex items-center mb-6">
        <i class="fas fa-${icon} text-${color}-500 text-2xl mr-3"></i>
        <h2 class="text-2xl font-bold">${title} Documentation</h2>
      </div>
    `;
      const grid = document.createElement("div");
      grid.className = "section-grid-container";
      Object.entries(content).forEach(([key, subs]) => {
        const subDiv = document.createElement("div");
        const h3 = document.createElement("h3");
        h3.className = "text-xl font-bold mb-4";
        h3.innerHTML = key.toLowerCase() === "null" ? "" : key;
        subDiv.appendChild(h3);
        subs.forEach((item) => {
          try {
            subDiv.appendChild(renderSubItem(item));
          } catch (e) {
            console.error(`ProjectSection render error (${item.type}):`, e);
          }
        });
        grid.appendChild(subDiv);
      });
      card.appendChild(grid);
      wrapper.appendChild(card);
      if (images?.image_elements?.length) {
        wrapper.appendChild(
          renderImageGallery(`${title} ${images.image_title ?? "Images"}`, images.image_elements)
        );
      }
      return wrapper;
    }
  };

  // src/components/ProjectConclusion.ts
  var ProjectConclusion = {
    render(props) {
      const results = props.results ?? "";
      const learned = props.learned ?? "";
      const improvements = props.improvements ?? [];
      const wrapper = document.createElement("div");
      wrapper.id = "conclusion";
      wrapper.className = "section-anchor container mx-auto px-6 pb-8";
      const card = document.createElement("div");
      card.className = "bg-white rounded-xl shadow-md overflow-hidden p-6";
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
            </div>` : ""}
          ${improvements.length ? `
            <h3 class="text-xl font-semibold mb-4">Future Improvements</h3>
            <ul class="list-disc pl-6 space-y-2 text-gray-600">
              ${improvements.map((i) => `<li>${i}</li>`).join("")}
            </ul>` : ""}
        </div>
      </div>
    `;
      wrapper.appendChild(card);
      return wrapper;
    }
  };

  // src/components/ProjectInfo.ts
  var ProjectInfo = {
    render(props) {
      const date = props.completion_date ?? "";
      const size = props.team_size ?? 1;
      const members = props.team_members ?? [];
      const dur = props.duration ?? "";
      const links = props.project_links ?? [];
      const wrapper = document.createElement("div");
      wrapper.className = "container mx-auto px-6 pb-8";
      const card = document.createElement("div");
      card.className = "bg-white rounded-xl shadow-md overflow-hidden p-6";
      let linksHtml = "";
      if (links.length) {
        linksHtml = `
        <div>
          <p class="text-xs text-gray-400 uppercase mb-3 font-semibold">Project Links</p>
          <div class="flex flex-wrap gap-3">
            ${links.map((l) => {
          const isBrandIcon = ["github", "gitlab", "linkedin", "twitter", "facebook", "instagram", "youtube", "discord"].includes(l.icon || "");
          const prefix = isBrandIcon ? "fab" : "fas";
          const iconHtml = l.icon ? `<i class="${prefix} fa-${l.icon}"></i>` : "";
          return `
                <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
                  ${iconHtml}
                  ${l.label}
                </a>
              `;
        }).join("")}
          </div>
        </div>
      `;
      }
      card.innerHTML = `
      <div class="flex items-center mb-6">
        <i class="fas fa-info text-blue-500 text-2xl mr-3"></i>
        <h2 class="text-2xl font-bold">Project Info</h2>
      </div>
      <div class="flex flex-wrap gap-8 text-gray-600">
        ${date ? `<div><p class="text-xs text-gray-400 uppercase mb-1">Completion</p><p class="font-medium">${date}</p></div>` : ""}
        ${dur ? `<div><p class="text-xs text-gray-400 uppercase mb-1">Duration</p><p class="font-medium">${dur}</p></div>` : ""}
        <div>
          <p class="text-xs text-gray-400 uppercase mb-1">Team</p>
          <p class="font-medium">${size === 1 ? "Solo project" : `${size} members`}</p>
          ${members.length ? `<ul class="mt-2 space-y-1 text-sm">
            ${members.map((m) => `<li>${m.link ? `<a href="${m.link}" class="text-blue-500 hover:underline">${m.name}</a>` : m.name} \u2014 ${m.role}</li>`).join("")}
          </ul>` : ""}
        </div>
      </div>
      ${linksHtml ? `<div class="mt-6 pt-6 border-t border-gray-200">${linksHtml}</div>` : ""}
    `;
      wrapper.appendChild(card);
      return wrapper;
    }
  };

  // src/components/ToTopArrow.ts
  var ToTopArrow = {
    render(props) {
      const trigger = document.createElement("div");
      trigger.className = "to-top-arrow-trigger";
      const arrow = document.createElement("button");
      arrow.className = "to-top-arrow";
      arrow.title = "Back to top";
      arrow.innerHTML = '<i class="fas fa-chevron-up"></i>';
      arrow.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
      trigger.appendChild(arrow);
      return trigger;
    }
  };

  // src/app.ts
  ComponentRegistry.register("Header", Header);
  ComponentRegistry.register("Navigation", Navigation);
  ComponentRegistry.register("About", About);
  ComponentRegistry.register("ProjectList", ProjectList);
  ComponentRegistry.register("Skills", Skills);
  ComponentRegistry.register("Contact", Contact);
  ComponentRegistry.register("Footer", Footer);
  ComponentRegistry.register("Html", Html);
  ComponentRegistry.register("Section", Section);
  ComponentRegistry.register("Grid", Grid);
  ComponentRegistry.register("CodeBlock", CodeBlock);
  ComponentRegistry.register("TypewriterText", TypewriterText);
  ComponentRegistry.register("ProjectViewer", ProjectViewer);
  ComponentRegistry.register("ProjectHeader", ProjectHeader);
  ComponentRegistry.register("ProjectOverview", ProjectOverview);
  ComponentRegistry.register("ProjectSection", ProjectSection);
  ComponentRegistry.register("ProjectConclusion", ProjectConclusion);
  ComponentRegistry.register("ProjectInfo", ProjectInfo);
  ComponentRegistry.register("ToTopArrow", ToTopArrow);
  var page = new URLSearchParams(window.location.search).get("page") ?? "home";
  PageBuilder.render(`/data/pages/${page}.json`);
})();
