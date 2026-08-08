import { ComponentRegistry } from './componentRegistry';
import type { PageConfig, ComponentDefinition } from './types';

export class PageBuilder {
  static async renderDefs(defs: ComponentDefinition[], container: HTMLElement): Promise<void> {
    for (const def of defs) {
      const Component = ComponentRegistry.get(def.component);
      if (!Component) {
        console.warn(`Component '${def.component}' not registered`);
        continue;
      }
      const el = await Component.render(def.props ?? {}, PageBuilder.renderDefs.bind(PageBuilder));
      container.appendChild(el);
    }
  }

  static async render(configPath: string): Promise<void> {
    try {
      const config = await this.loadConfig(configPath);
      document.title = config.pageTitle;

      const app = document.getElementById('app');
      if (!app) throw new Error('No #app element found');

      await PageBuilder.renderDefs(config.layout, app);

      // Load interactive scripts after all components are in the DOM
      for (const src of config.scripts ?? []) {
        await this.loadScript(src);
      }

      // Scripts that use DOMContentLoaded won't auto-fire — call their init functions manually
      const w = window as unknown as Record<string, unknown>;
      if (typeof w['addSmoothScrolling'] === 'function') (w['addSmoothScrolling'] as () => void)();
      if (typeof w['age_insert'] === 'function') (w['age_insert'] as () => void)();
      if (typeof w['semester_insert'] === 'function') (w['semester_insert'] as () => void)();
      w['popup_element'] = document.getElementById('popup');
      const hljs = w['hljs'] as Record<string, unknown> | undefined;
      if (typeof hljs?.['highlightAll'] === 'function') (hljs['highlightAll'] as () => void)();
    } catch (error) {
      console.error('PageBuilder error:', error);
    }
  }

  private static loadScript(src: string): Promise<void> {
    return new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve();
      s.onerror = () => resolve();
      document.body.appendChild(s);
    });
  }

  private static async loadConfig(path: string): Promise<PageConfig> {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load config: ${path}`);
    return response.json() as Promise<PageConfig>;
  }
}
