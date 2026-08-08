import type { ComponentDefinition, RenderChildren } from '../types';

export const Section = {
  async render(props: Record<string, unknown>, renderChildren?: RenderChildren): Promise<HTMLElement> {
    const section = document.createElement('section');
    if (props.id) section.id = props.id as string;
    if (props.className) section.className = props.className as string;

    const inner = document.createElement('div');
    inner.className = (props.innerClassName as string) ?? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

    if (props.heading) {
      const h2 = document.createElement('h2');
      h2.className = 'text-3xl font-bold text-center mb-12';
      h2.innerHTML = props.heading as string;
      inner.appendChild(h2);
    }

    const children = props.children as ComponentDefinition[] | undefined;
    if (children?.length && renderChildren) {
      await renderChildren(children, inner);
    }

    section.appendChild(inner);
    return section;
  },
};
