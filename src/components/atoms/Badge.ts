import type { BadgeProps } from '../../types';

export class Badge {
  static render(props: BadgeProps): HTMLElement {
    const span = document.createElement('span');
    span.className = props.className ?? 'category';
    span.textContent = props.text;
    return span;
  }
}
