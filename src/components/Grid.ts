export const Grid = {
  render(props: Record<string, unknown> = {}): string {
    const cols = (props.columns as number) ?? 2;
    const gap = (props.gap as number) ?? 8;
    const className = (props.className as string) ?? '';
    const id = (props.id as string) ?? '';
    
    const idAttr = id ? ` id="${id}"` : '';
    const classAttr = `grid grid-cols-1 md:grid-cols-${cols} gap-${gap}${className ? ` ${className}` : ''}`;

    return `<div class="${classAttr}"${idAttr}></div>`;
  },
};
