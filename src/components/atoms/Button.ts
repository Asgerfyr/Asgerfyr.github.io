import type { ButtonProps } from '../../types';

export class Button {
  static render(props: ButtonProps): HTMLElement {
    const el = props.href
      ? document.createElement('a')
      : document.createElement('button');

    el.className = props.className ?? 'a-button';
    el.textContent = props.text;

    if (props.href && el instanceof HTMLAnchorElement) {
      el.href = props.href;
    }

    return el;
  }
}
