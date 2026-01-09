# Golden Ratio Design System

## Overview

Mise uses the golden ratio (φ = 1.618) for mathematically harmonious proportions. **Content drives height, not containers.**

## The Problem Solved

Users upload images with varying dimensions. Without constraints, sites look wonky. With our system:
- Images get consistent golden ratio proportions (1.618:1)
- Responsive sizing via `clamp()` scales smoothly across devices
- Original image dimensions don't matter - output is always harmonious

## User-Facing Controls

In section settings, users see:
```
Height: Auto | Small | Medium | Large | Fullscreen | Custom
```

This controls **media sizing only**, not section height. Sections naturally size to content.

## How It Works

### 1. User selects height in schema → stored as `s.height`
### 2. Section passes it to media: `{% render 'media', media_height: s.height %}`
### 3. CSS applies golden ratio constraints via `.mh-{size}`
### 4. All images get consistent proportions regardless of upload

## Spacing Scale

CSS variables following golden ratio progression:

```css
--space-xs:  6px    --space-sm:  10px   --space-md:  16px
--space-lg:  26px   --space-xl:  42px   --space-2xl: 68px
--space-3xl: 110px
```

**Usage**: `section-py-md`, `section-px-lg`, `grid-gap-y-sm`, `menu-gap-x-normal`

## Media Sizing

### In Liquid
```liquid
{% render 'media', src: image, media_height: s.height %}
```

The `media_height` parameter accepts: `auto`, `sm`, `md`, `lg`, `xl`, `custom`

### CSS Classes Applied

- `.mh-sm` - max 480px, aspect 1.618:1
- `.mh-md` - max 720px, aspect 1.618:1  
- `.mh-lg` - max 900px, aspect 1.618:1
- `.mh-xl` - max 1100px, aspect 1.618:1
- `.mh-auto` - no constraints

Each scales responsively: `max-height: clamp(mobile, viewport%, desktop)`

**Key**: No matter what image dimensions user uploads, these classes enforce golden ratio proportions.

## Layout Patterns

### Overlay (Hero/Grid)

```liquid
<section class="hero-layout-overlay section-py-lg">
  <div class="hero-media-overlay">
    {% render 'media', src: s.bg_image, media_height: s.height %}
  </div>
  <div class="hero-content-overlay">
    <!-- Content determines height -->
  </div>
</section>
```

Media is absolute, content determines container size with min-height.

### Split (50/50)

```liquid
<section class="media-layout-left section-py-md">
  <div class="media-media-split">
    {% render 'media', src: s.image, media_height: s.height %}
  </div>
  <div class="media-content-split">
    <!-- Content -->
  </div>
</section>
```

Media adapts to content height in split layouts (aspect-ratio overridden to auto).

## When to Use Each Size

**User selects based on visual weight**:
- **Auto**: Special full-bleed cases (backgrounds, slideshows)
- **Small**: Thumbnails, cards in grids
- **Medium**: Default for most sections
- **Large**: Feature images, hero sections
- **Fullscreen**: Dramatic full-height heroes
- **Custom**: Specific pixel height

## Key Benefits

1. **Consistent output** - varying uploads → harmonious results
2. **No wonky layouts** - golden ratio enforces proportions
3. **Responsive** - scales smoothly mobile → desktop
4. **Content-driven** - no artificial section heights
5. **User-friendly** - simple dropdown controls

## Technical Details

### Split Layout Override
```css
.hero-media-split .media-wrapper,
.media-media-split .media-wrapper {
  aspect-ratio: auto;  /* Let content drive height */
  height: 100%;
  max-height: none;
}
```

In 50/50 splits, media fills available height instead of using aspect-ratio.

### Overlay Layout Fix
```css
.hero-content-overlay {
  min-height: clamp(400px, calc(100vh * 0.618), 800px);
  /* Content sets min, can grow naturally */
}
```

Content determines container size, media fills it.

---

**Result**: Users upload any image size → system enforces golden ratio → beautiful, consistent layouts.
