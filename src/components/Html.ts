export const Html = {
  render(props: Record<string, unknown>): HTMLElement {
    const tag = (props.tag as string) || 'div';
    const el = document.createElement(tag);
    if (props.className) el.className = props.className as string;
    if (props.id) el.id = props.id as string;
    el.innerHTML = (props.html as string) ?? '';
    return el;
  },
};
