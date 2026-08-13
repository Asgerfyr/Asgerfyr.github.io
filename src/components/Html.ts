export const Html = {
  render(props: Record<string, unknown> = {}): string {
    const tag = (props.tag as string) || 'div';
    const className = (props.className as string) ?? '';
    const id = (props.id as string) ?? '';
    const html = (props.html as string) ?? '';

    const classAttr = className ? ` class="${className}"` : '';
    const idAttr = id ? ` id="${id}"` : '';

    return `<${tag}${idAttr}${classAttr}>${html}</${tag}>`;
  },
};
