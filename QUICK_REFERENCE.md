# LucideIcons Quick Reference

## 🚀 Quick Start

### 1. Using Lucide Icons in JSON
```json
{
  "icon": "arrow-left",
  "iconType": "lucide"
}
```

### 2. Default to FontAwesome
```json
{
  "icon": "arrow-left"
  // iconType defaults to "fontawesome"
}
```

## 📍 Where to Use Icons

| Component | Property | Example |
|-----------|----------|---------|
| ProjectOverview | features[].icon | `"icon": "zap"` |
| ProjectOverview | features[].iconType | `"iconType": "lucide"` |
| ProjectSection | icon | `"icon": "code-2"` |
| ProjectSection | iconType | `"iconType": "lucide"` |
| ProjectInfo | project_links[].icon | `"icon": "github"` |
| ProjectInfo | project_links[].iconType | `"iconType": "lucide"` |

## 🎨 Popular Icons by Category

### Navigation
```
arrow-left, arrow-right, arrow-up, arrow-down
chevron-left, chevron-right, chevron-up, chevron-down
menu, x, home
```

### Development
```
code, code-2, terminal, github, gitlab
database, server, cpu, package, zap
git-branch, git-merge, git-commit
```

### Content & Files
```
file, folder, image, video, download, upload
edit, trash-2, copy, save, share-2
```

### UI & Status
```
check, check-circle, x-circle, alert-circle, info
eye, eye-off, settings, lock, unlock
heart, star, bookmark, flag
```

### Other
```
user, users, mail, phone, clock, calendar
map-pin, target, search, bell, settings
```

## 💡 Icon Naming Rules

| Format | Example | Type |
|--------|---------|------|
| Kebab-case | `arrow-left` | Input (JSON) |
| camelCase | `arrowLeft` | Internal conversion |
| PascalCase | `ArrowLeft` | Lucide component name |

**Always use kebab-case in JSON files!**

## 🔄 Migration Guide

### From FontAwesome to Lucide
```json
// Before (FontAwesome)
{ "icon": "arrow-left" }

// After (Lucide)
{ "icon": "arrow-left", "iconType": "lucide" }
```

### Finding Lucide Equivalents
| FontAwesome | Lucide | Notes |
|-------------|--------|-------|
| fa-code | code | Simple code icon |
| fa-code-branch | git-branch | Git branching |
| fa-database | database | Database icon |
| fa-zap | zap | Lightning/energy |
| fa-users | users | Multiple people |

## 🎯 Common Use Cases

### Project Overview Features
```json
{
  "features": [
    { "icon": "smartphone", "iconType": "lucide", "title": "Responsive" },
    { "icon": "zap", "iconType": "lucide", "title": "Fast" },
    { "icon": "shield", "iconType": "lucide", "title": "Secure" }
  ]
}
```

### Project Section Headers
```json
{
  "icon": "code-2",
  "iconType": "lucide",
  "color": "green",
  "title": "Technologies"
}
```

### Project Links
```json
{
  "project_links": [
    { "label": "GitHub", "icon": "github", "iconType": "lucide", "url": "..." },
    { "label": "Demo", "icon": "external-link", "iconType": "lucide", "url": "..." }
  ]
}
```

## 🔗 Resources

- **Full Icon List**: https://lucide.dev/icons
- **Icon Preview**: https://lucide.dev/preview
- **Search Icons**: https://lucide.dev (search bar on site)
- **Local Helper**: Use `src/utils/lucideHelpers.ts` for programmatic access

## ⚡ Pro Tips

1. **Use Lucide for modern look**: Lucide icons are more contemporary
2. **Use FontAwesome for brands**: Better for social media icons
3. **Mix both**: No restriction on mixing in the same project
4. **Check the guide**: See `LUCIDE_ICONS_GUIDE.md` for detailed info
5. **Console warnings**: Check browser console for icon not found errors

## 🐛 Debugging

### Icon not showing?
1. Verify spelling: `arrow-left` ✓ vs `arrowleft` ✗
2. Check `iconType`: should be `"lucide"` or `"fontawesome"`
3. Confirm icon exists at lucide.dev
4. Check browser console for warnings

### Icon shows question mark?
- Icon name doesn't exist
- Check exact name at lucide.dev
- Use a different icon

## 📞 Questions?

- See `LUCIDE_ICONS_GUIDE.md` for full documentation
- Check `IMPLEMENTATION_SUMMARY.md` for implementation details
- Visit https://lucide.dev for comprehensive icon reference
