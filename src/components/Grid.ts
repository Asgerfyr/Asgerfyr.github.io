import type { ComponentDefinition, RenderChildren } from '../types';

export const Grid = {
  async render(props: Record<string, unknown>, renderChildren?: RenderChildren): Promise<HTMLElement> {
    const cols = (props.columns as number) ?? 2;
    const gap = (props.gap as number) ?? 8;
    const div = document.createElement('div');
    div.className = `grid grid-cols-1 md:grid-cols-${cols} gap-${gap}`;
    if (props.className) div.className += ` ${props.className as string}`;
    if (props.id) div.id = props.id as string;

    const children = props.children as ComponentDefinition[] | undefined;
    if (children?.length && renderChildren) {
      await renderChildren(children, div);
    }

    return div;
  },
};
