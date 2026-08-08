import type { IconProps } from '../../types';

export class Icon {
  static render(props: IconProps): HTMLElement {
    const i = document.createElement('i');
    i.className = props.icon;
    if (props.size) i.style.fontSize = props.size;
    return i;
  }
}
