import { ComponentRegistry } from './componentRegistry';
import type { PageConfig, ComponentDefinition } from './types';

export class PageBuilder {
  static async renderDefs(defs: ComponentDefinition[], container: HTMLElement): Promise<void> {
    // Extract sections from ProjectSection components in the layout
    const sections = ['Overview'];
    for (const def of defs) {
      if (def.component === 'ProjectSection' && def.props?.title) {
        sections.push(def.props.title as string);
      }
    }
    sections.push('Conclusion');

    for (const def of defs) {
      const Component = ComponentRegistry.get(def.component);
      if (!Component) {
        console.warn(`Component '${def.component}' not registered`);
        continue;
      }

      // Pass sections to ProjectHeader
      const props = def.component === 'ProjectHeader' 
        ? { ...def.props, sections }
        : def.props;

      const html = await Component.render(props ?? {});
      
      // Insert HTML directly without wrapper
      container.insertAdjacentHTML('beforeend', html);
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
    if (path.includes('__preview')) {
      const stored = sessionStorage.getItem('creator-preview');
      if (!stored) throw new Error('No preview data — open from the Page Creator');
      return JSON.parse(stored) as PageConfig;
    }
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load config: ${path}`);
    return response.json() as Promise<PageConfig>;
  }
}
