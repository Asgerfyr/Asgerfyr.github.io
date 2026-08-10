import * as LucideIcons from 'lucide';

/**
 * Utility to inspect available Lucide icons
 * Useful for development and debugging
 */

export function getAllLucideIcons(): string[] {
  const icons = Object.keys(LucideIcons)
    .filter(key => {
      // Filter out non-icon exports (lowercase names and special exports)
      const isComponent = typeof (LucideIcons as Record<string, any>)[key] === 'function';
      const isUpperCase = /^[A-Z]/.test(key);
      return isComponent && isUpperCase;
    })
    .map(key => camelCaseToKebabCase(key))
    .sort();
  
  return icons;
}

/**
 * Convert camelCase to kebab-case for icon names
 */
export function camelCaseToKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Check if a Lucide icon exists
 */
export function lucideIconExists(name: string): boolean {
  const camelCase = name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  const iconName = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  return (LucideIcons as Record<string, any>)[iconName] !== undefined;
}

/**
 * Get a filtered list of Lucide icons by category/pattern
 */
export function filterLucideIcons(pattern: string | RegExp): string[] {
  const regex = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
  return getAllLucideIcons().filter(icon => regex.test(icon));
}

/**
 * Log all available Lucide icons to console (for debugging)
 */
export function logAllLucideIcons(): void {
  const icons = getAllLucideIcons();
  console.table({
    'Total Icons': icons.length,
    'Sample Icons': icons.slice(0, 10).join(', '),
  });
  console.log('All Lucide Icons:', icons);
}

// Export icon list as a constant for reference
export const LUCIDE_ICON_LIST = getAllLucideIcons();

// Common icon categories for quick reference
export const LUCIDE_ICON_CATEGORIES = {
  navigation: [
    'arrow-down',
    'arrow-left',
    'arrow-right',
    'arrow-up',
    'chevron-down',
    'chevron-left',
    'chevron-right',
    'chevron-up',
    'menu',
    'x',
  ],
  development: [
    'code',
    'code-2',
    'github',
    'gitlab',
    'terminal',
    'database',
    'cpu',
    'server',
    'package',
    'git-branch',
    'git-merge',
  ],
  communication: [
    'mail',
    'message-square',
    'phone',
    'link',
    'share-2',
    'external-link',
    'send',
  ],
  content: [
    'file',
    'folder',
    'image',
    'video',
    'music',
    'book',
    'edit',
    'trash-2',
    'copy',
  ],
  status: [
    'check',
    'check-circle',
    'alert-circle',
    'info',
    'help-circle',
    'x-circle',
    'minus-circle',
  ],
  actions: [
    'download',
    'upload',
    'save',
    'refresh',
    'search',
    'settings',
    'lock',
    'unlock',
    'eye',
    'eye-off',
  ],
  other: ['heart', 'star', 'user', 'users', 'clock', 'calendar', 'map-pin', 'target', 'zap'],
};
