import type { RenderFn } from './types';

export class ComponentRegistry {
  private static registry = new Map<string, { render: RenderFn }>();

  static register(name: string, component: { render: RenderFn }): void {
    this.registry.set(name, component);
  }

  static get(name: string): { render: RenderFn } | undefined {
    return this.registry.get(name);
  }

  static list(): string[] {
    return Array.from(this.registry.keys());
  }
}
