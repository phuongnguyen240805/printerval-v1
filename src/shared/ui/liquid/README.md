# Shared Liquid Glass

`LiquidTheme` is mounted once in each router root (`pages/_app.tsx` and `app/editor/layout.tsx`). The SSR `<html class="liquid-site">` scopes the theme and includes portal content. Do not mount a new interaction engine in individual pages.

## Adjust the theme

- `src/styles/liquid-tokens.css`: shared colors, field/panel fills, corner radii, blur and shadows; dark theme overrides live here too.
- `src/styles/liquid-site.css`: shared material and accessible interaction states, native-control compatibility, mobile font size and reduced-motion/transparency fallbacks.
- `config.ts`: ripple timing, bounds and delegated interaction selectors.
- `home-glass.css`: homepage composition and header navigation; shared page background references the same tokens.

## Components

Use shared `Button`, `Input`, `Textarea`, `Select`, `Card` and popup components. They already expose the material attributes, preserve native props/refs, and need no page-specific effect code.

```tsx
import { LiquidSurface } from '@/shared/ui/liquid/LiquidSurface';

<LiquidSurface className="p-6">
  {/* Panel with a frosted background; content remains sharp. */}
</LiquidSurface>
<LiquidSurface material="card" className="overflow-hidden p-4" />
<LiquidSurface material="background" className="p-8" />
```

For custom components, add `data-liquid-control`, `data-liquid-field`, `data-liquid-card`, `data-liquid-badge`, or `data-liquid-surface`. Choose `data-liquid-shape="pill"` or `"round"` for pill/icon controls. A local CSS variable such as `--liquid-radius-panel` customizes one surface without changing all pages.

Compatibility selectors also cover legacy native buttons, text inputs, textareas, product links, ARIA menus and rounded white page panels. Migrate those to shared components when changing their behavior; avoid duplicating effect CSS in pages. Checkbox/radio/range/color/file inputs are excluded from the text-field material. Disabled and invalid states remain visible. `data-liquid="off"` disables decorative pointer interactions within a subtree and field/legacy-panel styling.

Glass uses CSS highlights and bounded interaction ripples across the site. The homepage's bounded liquidGL lens is a separate enhancement; do not instantiate a WebGL renderer for each field/card. Check mobile overflow, keyboard focus, selection, disabled/error states and reduced motion when changing these primitives.
