# LucideIcons Integration Guide

## Overview

The project now supports both **FontAwesome** and **Lucide** icons. Lucide provides a modern, clean icon library with 1000+ icons.

## How to Use Lucide Icons

### In ProjectOverview Features

```json
{
  "component": "ProjectOverview",
  "props": {
    "features": [
      {
        "icon": "zap",
        "iconType": "lucide",
        "color": "blue",
        "title": "Fast Performance",
        "description": "Optimized for speed"
      },
      {
        "icon": "tachometer-alt",
        "iconType": "fontawesome",
        "color": "green",
        "title": "Another Feature",
        "description": "Using FontAwesome"
      }
    ]
  }
}
```

### In ProjectSection

```json
{
  "component": "ProjectSection",
  "props": {
    "icon": "code-2",
    "iconType": "lucide",
    "color": "green",
    "title": "Technologies",
    "content": { ... }
  }
}
```

### In ProjectInfo Links

```json
{
  "component": "ProjectInfo",
  "props": {
    "project_links": [
      {
        "label": "GitHub",
        "icon": "github",
        "iconType": "lucide",
        "url": "https://github.com/..."
      },
      {
        "label": "Live Demo",
        "icon": "external-link",
        "iconType": "fontawesome",
        "url": "https://..."
      }
    ]
  }
}
```

## Icon Type Options

- **`"fontawesome"`** (default) - Uses Font Awesome icons (fas/fab prefix)
- **`"lucide"`** - Uses Lucide icons (modern SVG icons)

## Common Lucide Icons

### Navigation & UI
- `menu`, `x`, `arrow-left`, `arrow-right`, `arrow-up`, `arrow-down`, `chevron-down`, `chevron-up`

### Developer & Tech
- `code`, `code-2`, `github`, `gitlab`, `terminal`, `database`, `cpu`, `server`, `zap`, `package`

### Communication
- `mail`, `message-square`, `phone`, `link`, `share-2`, `external-link`

### Content
- `file`, `folder`, `image`, `video`, `music`, `book`, `edit`, `trash-2`

### Status & Feedback
- `check`, `check-circle`, `alert-circle`, `info`, `help-circle`, `x-circle`

### Common Actions
- `download`, `upload`, `save`, `refresh`, `search`, `settings`, `lock`, `unlock`

### Other Useful Icons
- `heart`, `star`, `eye`, `eye-off`, `user`, `users`, `clock`, `calendar`, `map-pin`, `target`

## Full Icon List

For a complete list of all 1000+ Lucide icons, visit:
https://lucide.dev/icons

You can search for icons by name and see previews at the Lucide website.

## Converting Icon Names

Lucide uses **camelCase** for compound names in the code, but the `iconRegistry` automatically converts **kebab-case** names:

- JSON input: `"icon": "arrow-left"`
- Converted to: `arrowLeft` (camelCase)
- Lucide component: `ArrowLeft`

## Mixing Icon Libraries

You can freely mix FontAwesome and Lucide icons in the same page:

```json
{
  "features": [
    { "icon": "zap", "iconType": "lucide", "title": "Feature 1" },
    { "icon": "rocket", "iconType": "fontawesome", "title": "Feature 2" },
    { "icon": "heart", "iconType": "lucide", "title": "Feature 3" }
  ]
}
```

## Icon Sizing

Icons inherit their size from CSS. You can control sizing via:

- Inline `size` property (if supported by component)
- CSS classes (e.g., `text-2xl`, `text-sm`)
- Custom styles in your component

## Troubleshooting

If an icon name is not found:
- Check spelling (use kebab-case in JSON)
- Verify it exists on https://lucide.dev/icons
- Fall back to FontAwesome alternative if needed
- Check browser console for warnings

## Performance Notes

- Lucide icons are embedded as inline SVGs (lightweight)
- FontAwesome uses CSS classes from font file (lightweight)
- Both options are performant for typical usage
- Choose icons that best match your design needs
