import type { IconProps } from '../../types';
import { iconRegistry } from '../../utils/icons';

export class Icon {
  static render(props: IconProps): HTMLElement {
    return iconRegistry.renderIcon(props.icon, {
      size: props.size,
      className: props.className,
    });
  }
}
