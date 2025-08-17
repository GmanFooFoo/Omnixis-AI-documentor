# Icon System Documentation

## Overview

The DocuAI application uses a comprehensive icon system built on FontAwesome with standardized sizing, spacing, and usage patterns to ensure visual consistency and accessibility across all components.

## Icon Library

**Primary Library**: FontAwesome 6.4.0 (Free)
- Loaded via CDN: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
- Prefix: `fas` (solid), `far` (regular), `fab` (brands)

## Size System

### Standard Sizes
| Class | Size | Pixels | Use Case |
|-------|------|--------|----------|
| `.icon-xs` | 0.75rem | 12px | Inline text, small labels |
| `.icon-sm` | 0.875rem | 14px | Button text, form elements |
| `.icon-base` | 1rem | 16px | Body text, default size |
| `.icon-lg` | 1.125rem | 18px | Headings, emphasis |
| `.icon-xl` | 1.25rem | 20px | Section headers |
| `.icon-2xl` | 1.5rem | 24px | Card headers, file icons |
| `.icon-3xl` | 1.875rem | 30px | Dashboard tiles |
| `.icon-4xl` | 2.25rem | 36px | Large displays |
| `.icon-5xl` | 3rem | 48px | KPI tiles, hero elements |
| `.icon-6xl` | 3.75rem | 60px | Landing pages, empty states |

### Context-Specific Sizes
| Class | Size | Context |
|-------|------|---------|
| `.btn-icon-sm` | 14px | Small buttons |
| `.btn-icon-md` | 16px | Medium buttons |
| `.btn-icon-lg` | 18px | Large buttons |
| `.nav-icon` | 18px | Navigation menu items |
| `.menu-icon` | 20px | Dropdown menus |
| `.sidebar-icon` | 18px | Sidebar navigation |
| `.card-icon` | 20px | Card headers |
| `.table-icon` | 16px | Table cells |
| `.header-icon` | 24px | Page headers |

## Spacing System

### Margin Utilities
- `.icon-mr-1` - margin-right: 0.25rem (4px)
- `.icon-mr-2` - margin-right: 0.5rem (8px)  
- `.icon-mr-3` - margin-right: 0.75rem (12px)
- `.icon-ml-1` - margin-left: 0.25rem (4px)
- `.icon-ml-2` - margin-left: 0.5rem (8px)
- `.icon-ml-3` - margin-left: 0.75rem (12px)

### Icon Containers
| Class | Size | Purpose |
|-------|------|---------|
| `.icon-container-sm` | 24px | Small interactive areas |
| `.icon-container-md` | 32px | Standard touch targets |
| `.icon-container-lg` | 40px | Prominent elements |
| `.icon-container-xl` | 48px | Large touch targets |

## File Type Icons

### Color-Coded System
| File Type | Icon | Color Class | Hex Color (Light) | Hex Color (Dark) |
|-----------|------|-------------|-------------------|------------------|
| PDF | `fa-file-pdf` | `.icon-pdf` | #C53030 | #FC8181 |
| Word | `fa-file-word` | `.icon-word` | #2B6CB0 | #63B3ED |
| Excel | `fa-file-excel` | `.icon-excel` | #38A169 | #68D391 |
| PowerPoint | `fa-file-powerpoint` | `.icon-powerpoint` | #D69E2E | #F6E05E |
| Image | `fa-file-image` | `.icon-image` | #805AD5 | #B794F6 |
| Text | `fa-file-alt` | `.icon-text` | #4A5568 | #A0AEC0 |

### Usage Example
```html
<i class="fas fa-file-pdf icon-pdf icon-2xl icon-mr-2"></i>
```

## Common Icon Categories

### Navigation & UI
- `fa-home` - Dashboard/Home
- `fa-file-text` - Documents
- `fa-cog` - Settings  
- `fa-user` - Profile/Account
- `fa-bell` - Notifications
- `fa-search` - Search functionality
- `fa-plus` - Add/Create actions
- `fa-trash` - Delete actions
- `fa-edit` - Edit actions
- `fa-eye` - View/Preview
- `fa-download` - Download actions

### Status & Feedback
- `fa-check-circle` - Success states (green)
- `fa-exclamation-triangle` - Warning states (orange) 
- `fa-times-circle` - Error states (red)
- `fa-info-circle` - Information states (blue)
- `fa-spinner` - Loading states (with spin animation)

### Document Processing
- `fa-cloud-upload-alt` - File upload
- `fa-file-text` - Document processing
- `fa-image` - Image extraction
- `fa-vector-square` - Vector embeddings
- `fa-database` - Storage/Database
- `fa-brain` - AI processing

## Accessibility Guidelines

### WCAG Compliance
- All file type icons use color contrast ratios of 4.5:1 or higher
- Icons are never the sole means of conveying information
- Hover states increase opacity for better visibility
- Focus states include proper outline indicators

### Screen Reader Support
- Use `aria-hidden="true"` for decorative icons
- Include `aria-label` for functional icons
- Provide text alternatives when icons carry meaning

### Example
```html
<!-- Decorative icon -->
<i class="fas fa-file-pdf icon-pdf" aria-hidden="true"></i>
<span>Document.pdf</span>

<!-- Functional icon -->
<button aria-label="Delete document">
  <i class="fas fa-trash icon-sm" aria-hidden="true"></i>
</button>
```

## Animation & States

### Loading States
```css
.loading-icon {
  animation: spin 1s linear infinite;
}
```

### Interactive States
```css
.icon-accessible {
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.icon-accessible:hover {
  opacity: 1;
}
```

## Implementation Guidelines

### Do's
✅ Use consistent sizing within the same component  
✅ Apply appropriate color coding for file types  
✅ Include proper spacing between icons and text  
✅ Use semantic icon choices that match functionality  
✅ Test color contrast in both light and dark themes  

### Don'ts
❌ Mix different icon styles within the same context  
❌ Use icons without proper accessibility attributes  
❌ Rely solely on color to convey information  
❌ Use overly large icons in constrained spaces  
❌ Forget to test touch targets on mobile devices  

## Responsive Behavior

### Mobile Considerations
- Minimum touch target size: 44px x 44px
- Icons in buttons should be at least 16px
- Consider reducing icon density on smaller screens
- Ensure adequate spacing between interactive icons

### Breakpoint Adjustments
```css
/* Mobile first approach */
.kpi-icon {
  font-size: 2rem; /* 32px */
}

@media (min-width: 640px) {
  .kpi-icon {
    font-size: 3rem; /* 48px */
  }
}
```

## Maintenance

### Adding New Icons
1. Check FontAwesome library for available icons
2. Add appropriate size and color classes if needed
3. Update this documentation with new categories
4. Test accessibility compliance
5. Verify responsive behavior

### Version Updates
- Review FontAwesome changelog for breaking changes
- Test existing icon implementations
- Update CDN links in index.css
- Validate color contrast ratios remain compliant