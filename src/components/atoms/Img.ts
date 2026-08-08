import type { ImgProps } from '../../types';

export class Img {
  static render(props: ImgProps): HTMLImageElement {
    const img = document.createElement('img');
    img.src = props.src;
    img.alt = props.alt;
    if (props.className) img.className = props.className;
    return img;
  }
}
