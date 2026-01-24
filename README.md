# Mise Theme

Everything in its place.

Mise is a "Gold Standard" RestaurantOS theme engineered specifically for restaurants, cafes, and hospitality brands. It prioritizes typographic precision, lightning-fast performance, and a robust, "safe" responsive behavior that ensures your menu and brand look pristine on every device, from an iPhone SE to a 4K Menu Board.

## Design System

Mise uses the **golden ratio (φ = 1.618)** throughout for mathematically harmonious proportions:

- **Spacing**: All padding/gaps follow golden ratio scale (6px, 10px, 16px, 26px, 42px, 68px, 110px)
- **Media sizing**: Images use golden ratio aspect-ratios (1.618:1) with responsive constraints
- **Content-driven layouts**: No artificial whitespace - content determines height naturally

See [GOLDEN-RATIO-SYSTEM.md](GOLDEN-RATIO-SYSTEM.md) for complete documentation.

## The Mise Philosophy

Mise en Place: Code should be as organized as a professional kitchen. Components are modular, self-contained, and purpose-built.

Typographic Authority: We believe in the power of whitespace and alignment. We reject visual clutter (like dot leaders) in favor of strong grid systems, top-aligned pricing anchors, and purposeful hierarchy.

Safety First: A restaurant website cannot break during a lunch rush. Our layouts use defensive CSS (flex-wrap, min-w-0) to ensure content never overlaps or crushes the interface.

Native Performance: We use lightweight, vanilla JavaScript and efficient Liquid rendering. No heavy frameworks, no layout thrashing.

## Architecture Overview

Mise is structured around three pillars: Global Utility, Transactional (Menu), and Narrative (Storytelling).

### 1. Global Utility (Site-Wide)

Essential navigation and communication layers.

**`header` (Section)**: The command center.
- **Settings**: Configurable Desktop Layout (Logo Left/Center), Navigation Alignment, and Sticky Behavior (Static, Always, or "Show on Scroll Up").
- **Features**: Supports Transparent Mode over Hero sections, Mobile Drawer navigation, and integrated Search/Cart actions.

**`announcement-bar` (Section)**: The daily special.
- **Purpose**: Urgent notices (Holiday Hours, Sold Out items).
- **Features**: Supports Marquee mode (scrolling text) or static centered text. Closable state is remembered via local storage.

**`footer` (Section)**: The anchor.
- **Content**: Configurable Brand area, Multi-column navigation, and Newsletter signup form.

**`background` (Section)**: Global atmosphere.
- **Purpose**: Sets a fixed background image or color that persists across the site (`z-index: -50`) with optional overlay opacity.

**`divider` (Section)**: The palate cleanser.
- **Features**: Configurable height and line style (Solid, Dashed, Icon: Star, Diamond, Utensils) that respects the global color scheme.

### 2. The Menu System (Transactional Core)

The engine of the theme. Designed to handle complex data with elegance.

**`menu-list` (Section)**: The controller.
- **Smart Grid Logic**: Safely toggles column counts (1:2:2 vs 1:2:3) to prevent text crushing on tablets.
- **Navigation**: Supports "Sidebar" (Vertical) or "Topbar" (Horizontal) layouts with sticky "Spy" navigation.
- **Data**: Populated via `repeater` blocks (inheriting from Collection/JSON) or manual `group` blocks.

**`grid` (Section)**: Flexible Layouts (aka Multi-Column).
- **Purpose**: A generic flex container for grouping content manually (e.g., "Sourcing", "Prep", "Plating").
- **Settings**: Control alignment (Start, Center, End, Between), Width Schemes, and Card usage.

**`snippets/menu-item-list`**: The high-density view.
- **Top-Aligned Pricing**: Anchors prices to the first line of text, preventing the "sinking ship" effect.
- **No Dots**: Replaces noisy leaders with calculated whitespace gutters for a premium aesthetic.

**`snippets/menu-item-card`**: The visual view.
- **Unified Headers**: Complex items display "From $X" in the header instead of hiding pricing in buttons.
- **Layouts**: Supports Standard (Stack) and Compact (Row) modes.

### 3. Narrative Sections (Brand Storytelling)

Tools to communicate ethos, sourcing, and atmosphere.

**`hero` (Section)**: The first impression.
- **Technical**: Supports Full Height (`100svh`) to prevent mobile browser bar jumps.
- **Media**: Handles HTML5 background video with seamless poster fallbacks and automatic dimming layers for text legibility.

**`media-with-content` (Section)**: The versatile storyteller.
- **Layout**: Robust 50/50 grid that stacks vertically on mobile.
- **Rhythm**: Supports alternating alignment (Image Left / Image Right) to create visual flow.

**`slideshow` (Section)**: The visual carousel.
- **Performance**: Uses native scroll snapping (CSS Scroll Snap) instead of heavy JS libraries.
- **Content**: Supports mixed media (Video/Image) slides with independent text overlay positioning.

**`marquee` (Section)**: The vibe setter.
- **Purpose**: Continuous scrolling text or images for brand values ("Organic • Local • Sustainable").
- **Tech**: Pure CSS animation for 60fps performance without JS overhead.

**`section` (Section)**: Generic Container.
- **Purpose**: A blank canvas section that accepts standard blocks (`heading`, `text`, `image`, `video`, `button`) for custom layouts.

## Developer Guidelines

### Golden Ratio System

Mise uses a mathematically-based design system:

**Spacing**: Uses CSS custom properties based on golden ratio (`var(--space-sm)`, `var(--space-md)`, `var(--space-lg)`, etc.)

**Media Sizing**: Pass `size: 'sm|md|lg|xl'` to media snippet. Defaults to `md` (golden ratio aspect-ratio with responsive max-height).

**Layout**: Content-driven heights. No `section-h-*` classes needed - flex layouts naturally size based on content.

See [GOLDEN-RATIO-SYSTEM.md](GOLDEN-RATIO-SYSTEM.md) for details.

### CSS & Tailwind

Mise relies on a semantic Tailwind configuration.

Z-Index: Strict layer system (z-floating, z-header, z-modal). No magic numbers.

Spacing: Uses CSS custom properties based on golden ratio scale (`var(--space-md)`).

### Responsive Strategy

Always design for the "Uncomfortable Middle" (1024px - 1280px).

The iPad Pro Test: Layouts explicitly downgrade to 2 columns or force vertical stacking in this range to prevent content crushing.

Defensive CSS: Always use min-w-0 on flex children to prevent text from forcing containers wider than their parent.

Golden Ratio Responsive: Media and sections use `clamp()` to scale smoothly between mobile and desktop.

### Data Attributes

data-behavior: Hooks a JS class to an element.

data-spy-target: The ID of the section being tracked.

data-spy-trigger: The ID of the link that should light up.

data-tags: Comma-separated list of tags (e.g., v,gf,spicy) for client-side filtering.

## Roadmap

Modifier Modal: A stateful form for handling complex item customization (Radio/Checkbox validation).

Instant Filtering: A sticky filter bar for toggling dietary preferences.

Floating Cart: A persistent "Tab" for mobile users to track their order state.

Mise. Everything in its place.