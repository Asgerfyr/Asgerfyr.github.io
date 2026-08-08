export const TypewriterText = {
  render(props: Record<string, unknown>): HTMLElement {
    const container = document.createElement('div');
    container.className = 'js-tryper-container';

    const tag = (props.tag as string) || 'p';
    const el = document.createElement(tag);
    el.className = 'js-tryper';
    el.style.display = 'inline';
    el.dataset.info = JSON.stringify({
      strings: props.strings ?? [],
      typeSpeed: props.typeSpeed ?? 60,
      loop: props.loop ?? true,
    });

    const cursor = document.createElement('span');
    cursor.className = 'js-curser';
    cursor.style.display = 'inline';

    container.appendChild(el);
    container.appendChild(cursor);
    return container;
  },
};
