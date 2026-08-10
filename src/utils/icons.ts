import * as LucideIcons from 'lucide';

export interface IconOptions {
  size?: string;
  className?: string;
}

class IconRegistry {
  private lucideIcons = LucideIcons;

  /**
   * Render a Lucide icon as an HTML element
   */
  renderIcon(name: string, options: IconOptions = {}): HTMLElement {
    const { size, className = '' } = options;
    return this.renderLucideIcon(name, size, className);
  }

  /**
   * Render a Lucide icon
   */
  private renderLucideIcon(name: string, size?: string, className: string = ''): HTMLElement {
    const iconName = this.toPascalCase(name);
    
    // Get the icon path data from lucide
    const iconData = (this.lucideIcons as Record<string, any>)[iconName];
    
    if (!iconData) {
      console.warn(`Lucide icon "${name}" (${iconName}) not found`);
      return this.createPlaceholderIcon(name, size, className);
    }

    try {
      const span = document.createElement('span');
      span.className = `lucide-icon ${className}`;
      
      // Create SVG from lucide path data
      const svg = this.createSVGFromPath(iconData);
      span.innerHTML = svg;
      
      // Apply size styling if provided
      if (size) {
        const svgElement = span.querySelector('svg');
        if (svgElement) {
          svgElement.style.width = size;
          svgElement.style.height = size;
        }
      }
      
      return span;
    } catch (e) {
      console.error(`Error rendering Lucide icon "${name}":`, e);
      return this.createPlaceholderIcon(name, size, className);
    }
  }

  /**
   * Create SVG from lucide path data
   */
  private createSVGFromPath(pathData: any[]): string {
    const attrs = [
      'width="24"',
      'height="24"',
      'viewBox="0 0 24 24"',
      'fill="none"',
      'stroke="currentColor"',
      'stroke-width="2"',
      'stroke-linecap="round"',
      'stroke-linejoin="round"',
    ].join(' ');

    let elements = '';
    pathData.forEach((element) => {
      const [tag, attrs] = element;
      if (tag && attrs) {
        const attrString = Object.entries(attrs)
          .map(([key, val]) => `${key}="${val}"`)
          .join(' ');
        elements += `<${tag} ${attrString} />`;
      }
    });

    return `<svg ${attrs}>${elements}</svg>`;
  }

  /**
   * Convert kebab-case to PascalCase for Lucide icon names
   */
  private toPascalCase(str: string): string {
    const camelCase = str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    // Capitalize first letter for PascalCase
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  }

  /**
   * Create a placeholder icon when the requested icon is not found
   */
  private createPlaceholderIcon(name: string, size?: string, className: string = ''): HTMLElement {
    const span = document.createElement('span');
    span.className = `lucide-icon ${className}`;
    span.textContent = '?';
    span.title = `Icon not found: ${name}`;
    if (size) span.style.fontSize = size;
    return span;
  }

  /**
   * Render icon as HTML string (for use in innerHTML)
   */
  renderIconHTML(name: string, options: IconOptions = {}): string {
    const { size, className = '' } = options;
    return this.renderLucideIconHTML(name, size, className);
  }

  /**
   * Render Lucide icon as HTML string (returns SVG wrapped in span)
   */
  private renderLucideIconHTML(name: string, size?: string, className: string = ''): string {
    const iconName = this.toPascalCase(name);
    const iconData = (this.lucideIcons as Record<string, any>)[iconName];
    
    if (!iconData) {
      console.warn(`Lucide icon "${name}" (${iconName}) not found`);
      return `<span style="color: #ef4444">?</span>`;
    }

    const sizeStyle = size ? ` style="width: ${size}; height: ${size}; flex-shrink: 0;"` : '';
    
    try {
      const svg = this.createSVGFromPath(iconData);
      
      // Wrap in span that applies color via currentColor
      return `<span class="lucide-icon inline-flex items-center justify-center ${className}"${sizeStyle}>${svg}</span>`;
    } catch (e) {
      console.error(`Error rendering Lucide icon "${name}":`, e);
      return `<span style="color: #ef4444">?</span>`;
    }
  }
}

export const iconRegistry = new IconRegistry();
