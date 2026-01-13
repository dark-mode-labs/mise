# AI Technical Specification & Schema Atlas

> **Source of Truth:** This document contains the **exact** JSON schemas extracted from the codebase.
> **Date:** January 12, 2026
> **Constraint:** Do not hallucinate properties. Use only what is defined below.

## 1. Global Config (`settings_schema.json`)

```json
{
  "color_schemes": {
    "type": "group",
    "settings": [
      { "type": "color", "id": "background", "label": "Background" },
      { "type": "color", "id": "text", "label": "Text" },
      { "type": "color", "id": "text_secondary", "label": "Secondary Text" },
      { "type": "color", "id": "accent", "label": "Accent / Links" },
      { "type": "color", "id": "surface", "label": "Surface / Card Background" },
      { "type": "color", "id": "border", "label": "Borders" },
      { "type": "color", "id": "shadow", "label": "Shadows" },
      { "type": "color", "id": "button_bg", "label": "Solid Button Background" },
      { "type": "color", "id": "button_text", "label": "Solid Button Label" },
      { "type": "color", "id": "ui_bg", "label": "Control Background" },
      { "type": "color", "id": "ui_text", "label": "Control Icon/Text" }
    ]
  },
  "width_schemes": {
    "type": "group",
    "settings": [
      { "type": "select", "id": "width", "options": ["sm","md","lg","xl","2xl","3xl","4xl","fit","full","custom"] },
      { "type": "text", "id": "custom_width", "conditional": "setting.width == 'custom'" }
    ]
  },
  "typography": [
    { "type": "font_picker", "id": "heading_font" },
    { "type": "font_picker", "id": "body_font" },
    { "type": "font_picker", "id": "button_font" },
    { "type": "range", "id": "type_scale", "min": 80, "max": 120 }
  ],
  "layout": [
    { "type": "range", "id": "grid_gap", "min": 0, "max": 64 },
    { "type": "range", "id": "corner_radius", "min": 0, "max": 40 }
  ]
}
```

---

## 2. Sections Schemas

### Announcement Bar (`sections/announcment-bar.liquid`)
```json
{
  "name": "Announcement Bar",
  "settings": [
    { "type": "width_scheme", "id": "width_scheme", "default": "full" },
    { "type": "checkbox", "id": "autoplay", "default": true },
    { "type": "range", "id": "autoplay_speed", "min": 3, "max": 10, "default": 5 },
    { "type": "checkbox", "id": "show_arrows", "default": true },
    { "type": "checkbox", "id": "show_close", "default": false },
    { "type": "color_scheme", "id": "color_scheme", "default": "default" }
  ],
  "blocks": [{ "type": "_announcement" }]
}
```

### Global Background (`sections/background.liquid`)
```json
{
  "name": "Global Background",
  "settings": [
    { "type": "image_picker", "id": "image" },
    { "type": "color", "id": "bg_color", "default": "#ffffff" },
    { "type": "range", "id": "overlay", "min": 0, "max": 90, "step": 10, "default": 0 }
  ]
}
```

### Divider (`sections/divider.liquid`)
```json
{
  "name": "Divider",
  "settings": [
    { "type": "width_scheme", "id": "width_scheme", "default": "full" },
    { "type": "checkbox", "id": "show_line", "default": true },
    { "type": "checkbox", "id": "show_icon", "default": true },
    { "type": "select", "id": "icon_select", "options": ["star", "chevron-down", "menu"], "default": "star" },
    { "type": "range", "id": "height", "min": 0, "max": 600, "step": 4, "default": 32, "unit": "px" },
    { "type": "color_scheme", "id": "color_scheme", "default": "default" }
  ]
}
```

### Footer (`sections/footer.liquid`)
```json
{
  "name": "Footer",
  "settings": [
    { "type": "width_scheme", "id": "width_scheme", "default": "standard" },
    { "type": "select", "id": "padding_vertical", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "sm" },
    { "type": "range", "id": "padding_vertical_custom", "min": 0, "max": 200, "step": 4, "default": 80, "conditional": "setting.padding_vertical == 'custom'" },
    { "type": "select", "id": "padding_horizontal", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "xs" },
    { "type": "range", "id": "padding_horizontal_custom", "min": 0, "max": 200, "step": 4, "default": 0, "conditional": "setting.padding_horizontal == 'custom'" },
    { "type": "checkbox", "id": "show_policy", "default": true },
    { "type": "checkbox", "id": "show_payment", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "default": "default" }
  ],
  "blocks": [{ "type": "_footer-brand" }, { "type": "_footer-nav" }, { "type": "_footer-newsletter" }]
}
```

### Grid (`sections/grid.liquid`)
```json
{
  "name": "Grid",
  "settings": [
    { "type": "checkbox", "id": "enable_gradient", "default": false },
    { "type": "color", "id": "overlay_color", "default": "" },
    { "type": "range", "id": "overlay_opacity", "min": 0, "max": 100, "default": 40 },
    { "type": "image_picker", "id": "bg_image" },
    { "type": "image_picker", "id": "bg_image_mobile" },
    { "type": "select", "id": "justify_content", "options": ["start", "center", "end", "between"], "default": "center" },
    { "type": "width_scheme", "id": "width_bg", "default": "full" },
    { "type": "width_scheme", "id": "width_scheme", "default": "standard" },
    { "type": "range", "id": "columns_desktop", "min": 2, "max": 4, "default": 3 },
    { "type": "range", "id": "columns_mobile", "min": 1, "max": 2, "default": 1 },
    { "type": "select", "id": "height", "options": ["auto", "sm", "md", "lg", "xl", "custom"], "default": "auto" },
    { "type": "range", "id": "height_custom", "min": 200, "max": 1000, "step": 10, "default": 400, "conditional": "setting.height == 'custom'" },
    { "type": "select", "id": "padding_vertical", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "none" },
    { "type": "range", "id": "padding_vertical_custom", "min": 0, "max": 200, "conditional": "setting.padding_vertical == 'custom'" },
    { "type": "select", "id": "padding_horizontal", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "none" },
    { "type": "range", "id": "padding_horizontal_custom", "min": 0, "max": 200, "conditional": "setting.padding_horizontal == 'custom'" },
    { "type": "checkbox", "id": "enable_animation", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "default": "default" },
    { "type": "checkbox", "id": "enable_cards_global", "default": false },
    { "type": "select", "id": "card_padding", "options": ["none", "xs", "sm", "md", "lg", "custom"], "default": "none" },
    { "type": "range", "id": "card_padding_custom", "min": 0, "max": 100, "default": 24, "conditional": "setting.card_padding == 'custom'" },
    { "type": "checkbox", "id": "card_shadow_global", "default": false, "conditional": "setting.enable_cards_global == true" }
  ],
  "blocks": [{ "type": "_column" }]
}
```

### Header (`sections/header.liquid`)
```json
{
  "name": "Header",
  "settings": [
    { "type": "width_scheme", "id": "width_scheme", "default": "standard" },
    { "type": "select", "id": "desktop_layout", "options": ["logo_center", "logo_left"], "default": "logo_center" },
    { "type": "select", "id": "nav_alignment", "options": ["left", "center", "right"], "default": "left", "conditional": "setting.desktop_layout == 'logo_left'" },
    { "type": "select", "id": "padding_vertical", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "none" },
    { "type": "range", "id": "padding_vertical_custom", "conditional": "setting.padding_vertical == 'custom'" },
    { "type": "select", "id": "padding_horizontal", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "xs" },
    { "type": "range", "id": "padding_horizontal_custom", "conditional": "setting.padding_horizontal == 'custom'" },
    { "type": "select", "id": "sticky_behavior", "options": ["none", "always", "on_scroll_up"], "default": "always" },
    { "type": "checkbox", "id": "enable_transparent", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "default": "default" }
  ],
  "blocks": [{ "type": "_header-logo" }, { "type": "_header-menu" }, { "type": "_header-actions" }]
}
```

### Hero (`sections/hero.liquid`)
```json
{
  "name": "Hero",
  "settings": [
    { "type": "width_scheme", "id": "width_bg", "default": "full" },
    { "type": "width_scheme", "id": "width_scheme", "default": "standard" },
    { "type": "select", "id": "layout_mode", "options": ["overlay", "split_left", "split_right"], "default": "overlay" },
    { "type": "select", "id": "height", "options": ["auto", "sm", "md", "lg", "xl", "custom"], "default": "auto" },
    { "type": "range", "id": "height_custom", "min": 200, "max": 1000, "conditional": "setting.height == 'custom'" },
    { "type": "select", "id": "padding_vertical", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "none" },
    { "type": "range", "id": "padding_vertical_custom", "conditional": "setting.padding_vertical == 'custom'" },
    { "type": "select", "id": "padding_horizontal", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "none" },
    { "type": "range", "id": "padding_horizontal_custom", "conditional": "setting.padding_horizontal == 'custom'" },
    { "type": "image_picker", "id": "bg_image" },
    { "type": "image_picker", "id": "mobile_image" },
    { "type": "text", "id": "video_url" },
    { "type": "image_picker", "id": "bg_image_2" },
    { "type": "image_picker", "id": "mobile_image_2" },
    { "type": "text", "id": "video_url_2" },
    { "type": "checkbox", "id": "show_placeholder", "default": true, "conditional": "setting.bg_image == blank and setting.bg_image_2 == blank" },
    { "type": "checkbox", "id": "enable_gradient", "default": false, "conditional": "setting.layout_mode == 'overlay'" },
    { "type": "color", "id": "overlay_color", "conditional": "setting.layout_mode == 'overlay'" },
    { "type": "range", "id": "overlay_opacity", "min": 0, "max": 100, "default": 40, "conditional": "setting.layout_mode == 'overlay'" },
    { "type": "select", "id": "content_align", "options": ["left", "center", "right"], "default": "center" },
    { "type": "select", "id": "text_align", "options": ["left", "center", "right"], "default": "center" },
    { "type": "select", "id": "vertical_align", "options": ["top", "middle", "bottom"], "default": "middle" },
    { "type": "checkbox", "id": "enable_animation", "default": true },
    { "type": "checkbox", "id": "enable_zoom", "default": false },
    { "type": "color_scheme", "id": "color_scheme", "default": "default" }
  ],
  "blocks": ["@theme", "scroll-indicator", "text", "spacer", "_marquee", "media", "group", "button"]
}
```

### Scrolling Text (`sections/marquee.liquid`)
```json
{
  "name": "Scrolling Text",
  "settings": [
    { "type": "width_scheme", "id": "width_scheme", "default": "full" },
    { "type": "text", "id": "text_list", "default": "Reserve Now, Open Daily, Fresh Ingredients" },
    { "type": "select", "id": "text_size", "options": ["small", "medium", "large", "xl", "display"], "default": "small" },
    { "type": "checkbox", "id": "uppercase", "default": true },
    { "type": "range", "id": "speed", "min": 5, "max": 60, "default": 20 },
    { "type": "select", "id": "direction", "options": ["left", "right"], "default": "left" },
    { "type": "select", "id": "padding_vertical", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "none" },
    { "type": "range", "id": "padding_vertical_custom", "conditional": "setting.padding_vertical == 'custom'" },
    { "type": "select", "id": "padding_horizontal", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "xs" },
    { "type": "range", "id": "padding_horizontal_custom", "conditional": "setting.padding_horizontal == 'custom'" },
    { "type": "color_scheme", "id": "color_scheme", "default": "default" }
  ]
}
```

### Media with Content (`sections/media-with-content.liquid`)
```json
{
  "name": "Media with content",
  "settings": [
    { "type": "width_scheme", "id": "width_scheme", "default": "standard" },
    { "type": "select", "id": "height", "options": ["auto", "sm", "md", "lg", "xl", "custom"], "default": "auto" },
    { "type": "range", "id": "height_custom", "min": 200, "max": 1000, "conditional": "setting.height == 'custom'" },
    { "type": "select", "id": "desktop_layout", "options": ["image_left", "image_right"], "default": "image_left" },
    { "type": "select", "id": "mobile_layout", "options": ["image_first", "text_first"], "default": "image_first" },
    { "type": "select", "id": "content_align", "options": ["left", "center", "right"], "default": "center" },
    { "type": "select", "id": "text_align", "options": ["left", "center", "right"], "default": "center" },
    { "type": "select", "id": "vertical_align", "options": ["top", "middle", "bottom"], "default": "middle" },
    { "type": "checkbox", "id": "show_shadow", "default": true },
    { "type": "select", "id": "padding_vertical", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "none" },
    { "type": "range", "id": "padding_vertical_custom", "conditional": "setting.padding_vertical == 'custom'" },
    { "type": "select", "id": "padding_horizontal", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "none" },
    { "type": "range", "id": "padding_horizontal_custom", "conditional": "setting.padding_horizontal == 'custom'" },
    { "type": "image_picker", "id": "image" },
    { "type": "image_picker", "id": "mobile_image" },
    { "type": "text", "id": "video_url" },
    { "type": "checkbox", "id": "show_placeholder", "default": true },
    { "type": "checkbox", "id": "enable_animation", "default": true },
    { "type": "checkbox", "id": "enable_zoom", "default": false },
    { "type": "color_scheme", "id": "color_scheme", "default": "default" }
  ],
  "blocks": ["text", "button", "logo", "spacer", "@theme"]
}
```

### Menu View (`sections/menu-list.liquid`)
```json
{
  "name": "Menu View",
  "settings": [
    { "type": "collection", "id": "menu" },
    { "type": "select", "id": "display_scope", "options": ["full_menu", "category"], "default": "full_menu" },
    { "type": "collection", "id": "category", "conditional": "setting.display_scope == 'category'" },
    { "type": "checkbox", "id": "enable_filtering", "default": true },
    { "type": "checkbox", "id": "show_nav", "default": true, "conditional": "setting.display_scope == 'full_menu'" },
    { "type": "select", "id": "nav_layout", "options": ["vertical", "horizontal"], "default": "vertical", "conditional": "setting.show_nav" },
    { "type": "range", "id": "nav_sticky_offset", "min": 0, "max": 160, "default": 80, "conditional": "setting.show_nav and setting.nav_layout == 'horizontal'" },
    { "type": "select", "id": "layout_style", "options": ["list", "card-standard", "card-compact"], "default": "list" },
    { "type": "select", "id": "aspect_ratio", "options": ["square", "landscape", "portrait"], "default": "landscape", "conditional": "setting.layout_style != 'list'" },
    { "type": "select", "id": "column_preset", "options": ["1:1:1", "1:2:2", "1:2:3"], "default": "1:2:3" },
    { "type": "select", "id": "grid_gap_x", "options": ["tight", "normal", "relaxed", "loose"], "default": "relaxed" },
    { "type": "select", "id": "grid_gap_y", "options": ["tight", "normal", "relaxed", "loose"], "default": "normal" },
    { "type": "select", "id": "card_padding", "options": ["tight", "compact", "normal", "relaxed", "loose"], "default": "normal", "conditional": "setting.layout_style != 'list'" },
    { "type": "select", "id": "list_row_padding", "options": ["tight", "normal", "relaxed", "loose"], "default": "normal", "conditional": "setting.layout_style == 'list'" },
    { "type": "select", "id": "list_image_size", "options": ["small", "medium", "large"], "default": "medium", "conditional": "setting.layout_style == 'list'" },
    { "type": "width_scheme", "id": "width_scheme", "default": "standard" },
    { "type": "text", "id": "heading", "default": "{{ menu.name }}" },
    { "type": "textarea", "id": "subtext" },
    { "type": "select", "id": "padding_vertical", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "none" },
    { "type": "range", "id": "padding_vertical_custom", "conditional": "setting.padding_vertical == 'custom'" },
    { "type": "select", "id": "padding_horizontal", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "xs" },
    { "type": "range", "id": "padding_horizontal_custom", "conditional": "setting.padding_horizontal == 'custom'" },
    { "type": "checkbox", "id": "enable_animation", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "default": "default" }
  ]
}
```

### Generic Section (`sections/section.liquid`)
```json
{
  "name": "Generic section",
  "settings": [
    { "type": "width_scheme", "id": "width_scheme", "default": "standard" },
    { "type": "select", "id": "height", "options": ["auto", "sm", "md", "lg", "xl", "custom"], "default": "auto" },
    { "type": "range", "id": "height_custom", "conditional": "setting.height == 'custom'" },
    { "type": "select", "id": "flex_direction", "options": ["col", "row"], "default": "col" },
    { "type": "select", "id": "content_align", "options": ["left", "center", "right"], "default": "center" },
    { "type": "select", "id": "text_align", "options": ["left", "center", "right"], "default": "center" },
    { "type": "select", "id": "vertical_align", "options": ["top", "middle", "bottom"], "default": "middle" },
    { "type": "select", "id": "padding_vertical", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "none" },
    { "type": "range", "id": "padding_vertical_custom", "conditional": "setting.padding_vertical == 'custom'" },
    { "type": "select", "id": "padding_horizontal", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "xs" },
    { "type": "range", "id": "padding_horizontal_custom", "conditional": "setting.padding_horizontal == 'custom'" },
    { "type": "checkbox", "id": "enable_animation", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "default": "default" }
  ],
  "blocks": ["@theme", "scroll-indicator", "text", "spacer", "_marquee", "media", "group", "button"]
}
```

### Slideshow (`sections/slideshow.liquid`)
```json
{
  "name": "Slideshow",
  "settings": [
    { "type": "width_scheme", "id": "width_scheme", "default": "standard" },
    { "type": "select", "id": "height", "options": ["sm", "md", "lg", "xl", "custom"], "default": "sm" },
    { "type": "range", "id": "slide_gap", "min": 0, "max": 40, "default": 0, "unit": "px" },
    { "type": "range", "id": "slide_width", "min": 80, "max": 100, "default": 100, "unit": "%" },
    { "type": "range", "id": "slide_width_mobile", "min": 80, "max": 100, "default": 100, "unit": "%" },
    { "type": "checkbox", "id": "show_arrows", "default": true },
    { "type": "checkbox", "id": "show_dots", "default": true },
    { "type": "select", "id": "dot_style", "options": ["dots", "bars", "numbers"], "default": "dots", "conditional": "setting.show_dots" },
    { "type": "select", "id": "arrow_icon", "options": ["chevron-left", "arrow-left"], "default": "chevron-left", "conditional": "setting.show_arrows" },
    { "type": "select", "id": "nav_position", "options": ["bottom_center", "bottom_left", "bottom_right"], "default": "bottom_center", "conditional": "setting.show_dots" },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default" },
    { "type": "checkbox", "id": "infinite_scroll", "default": true },
    { "type": "checkbox", "id": "autoplay", "default": false },
    { "type": "range", "id": "autoplay_speed", "min": 3, "max": 10, "default": 5, "conditional": "setting.autoplay == true" }
  ],
  "blocks": [{ "type": "_slide" }]
}
```

---

## 3. Block Schemas

### Badge Pill (`blocks/badge.liquid`)
```json
{
  "name": "Badge Pill",
  "settings": [
    { "type": "text", "id": "text", "default": "100% Grass-Fed • Zero Seed Oils" },
    { "type": "color", "id": "bg_color", "default": "#06d6a0" },
    { "type": "color", "id": "text_color", "default": "#ffffff" }
  ]
}
```

### Button (`blocks/button.liquid`)
```json
{
  "name": "Button",
  "settings": [
    { "type": "text", "id": "label", "default": "Book Now" },
    { "type": "url", "id": "link" },
    { "type": "select", "id": "style", "options": ["primary", "outline", "link"], "default": "primary" },
    { "type": "select", "id": "width", "options": ["auto", "full"], "default": "auto" },
    { "type": "checkbox", "id": "inherit_styles", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "default": "default", "conditional": "setting.inherit_styles != true" },
    { "type": "checkbox", "id": "bg_color_override", "default": false, "conditional": "setting.inherit_styles != true" },
    { "type": "color", "id": "custom_bg", "default": "#000000", "conditional": "setting.inherit_styles != true and setting.bg_color_override" },
    { "type": "checkbox", "id": "text_color_override", "default": false, "conditional": "setting.inherit_styles != true" },
    { "type": "color", "id": "custom_text", "default": "#ffffff", "conditional": "setting.inherit_styles != true and setting.text_color_override" },
    { "type": "checkbox", "id": "border_radius_override", "default": false, "conditional": "setting.inherit_styles != true" },
    { "type": "range", "id": "border_radius_custom", "min": 0, "max": 80, "step": 4, "default": 4, "conditional": "setting.inherit_styles != true and setting.border_radius_override" }
  ]
}
```

### Group (`blocks/group.liquid`)
```json
{
  "name": "Group",
  "settings": [
    { "type": "select", "id": "layout_mode", "options": ["flex", "grid"], "default": "flex" },
    { "type": "range", "id": "min_column_width", "min": 100, "max": 500, "step": 10, "default": 250, "unit": "px", "conditional": "setting.layout_mode == 'grid'" },
    { "type": "select", "id": "direction", "options": ["column", "row"], "default": "column", "conditional": "setting.layout_mode == 'flex'" },
    { "type": "select", "id": "content_align", "options": ["left", "center", "right", "between", "stretch"], "default": "left", "conditional": "setting.layout_mode == 'flex'" },
    { "type": "select", "id": "vertical_align", "options": ["top", "middle", "bottom", "between", "stretch"], "default": "top", "conditional": "setting.layout_mode == 'flex'" },
    { "type": "checkbox", "id": "wrap_content", "default": false, "conditional": "setting.layout_mode == 'flex'" },
    { "type": "select", "id": "text_align", "options": ["left", "center", "right"], "default": "left" },
    { "type": "select", "id": "width", "options": ["full", "fit"], "default": "full" },
    { "type": "select", "id": "height", "options": ["auto", "full"], "default": "auto" },
    { "type": "select", "id": "position", "options": ["relative", "absolute"], "default": "relative" },
    { "type": "select", "id": "inset", "options": ["top-left", "top-right", "bottom-left", "bottom-right", "cover"], "default": "top-left" },
    { "type": "select", "id": "padding_vertical", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "md" },
    { "type": "range", "id": "padding_vertical_custom", "min": 0, "max": 128, "conditional": "setting.padding_vertical == 'custom'" },
    { "type": "select", "id": "padding_horizontal", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "md" },
    { "type": "range", "id": "padding_horizontal_custom", "min": 0, "max": 128, "conditional": "setting.padding_horizontal == 'custom'" },
    { "type": "select", "id": "gap", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "md" },
    { "type": "range", "id": "gap_custom", "min": 0, "max": 128, "conditional": "setting.gap == 'custom'" },
    { "type": "checkbox", "id": "shadow", "default": false },
    { "type": "checkbox", "id": "enable_glass", "default": false },
    { "type": "checkbox", "id": "overflow_hidden", "default": false },
    { "type": "range", "id": "opacity", "min": 0, "max": 100, "default": 100 },
    { "type": "checkbox", "id": "inherit_styles", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "default": "default", "conditional": "setting.inherit_styles != true" },
    { "type": "checkbox", "id": "bg_color_override", "default": false, "conditional": "setting.inherit_styles != true" },
    { "type": "color", "id": "bg_color", "conditional": "setting.inherit_styles != true and setting.bg_color_override" },
    { "type": "checkbox", "id": "border_radius_override", "default": false, "conditional": "setting.inherit_styles != true" },
    { "type": "range", "id": "border_radius", "min": 0, "max": 60, "conditional": "setting.inherit_styles != true and setting.border_radius_override" },
    { "type": "checkbox", "id": "shadow_color_override", "default": false, "conditional": "setting.inherit_styles != true" },
    { "type": "color", "id": "shadow_color_custom", "default": "rgba(0,0,0,0.5)", "conditional": "setting.inherit_styles != true and setting.shadow_color_override" }
  ]
}
```

### Logo Icon (`blocks/logo.liquid`)
```json
{
  "name": "Logo Icon",
  "settings": [
    { "type": "image_picker", "id": "image" },
    { "type": "range", "id": "width", "min": 50, "max": 300, "default": 150 }
  ]
}
```

### Media (`blocks/media.liquid`)
```json
{
  "name": "Media (Image/Video)",
  "settings": [
    { "type": "image_picker", "id": "image" },
    { "type": "image_picker", "id": "image_mobile" },
    { "type": "text", "id": "video_url" },
    { "type": "checkbox", "id": "show_controls", "default": false },
    { "type": "checkbox", "id": "autoplay", "default": false },
    { "type": "select", "id": "height", "options": ["auto", "sm", "md", "lg", "xl", "custom"], "default": "auto" },
    { "type": "range", "id": "custom_height", "min": 20, "max": 800, "default": 300, "conditional": "setting.height == 'custom'" },
    { "type": "select", "id": "aspect_ratio", "options": ["auto", "square", "video", "portrait", "landscape"], "default": "auto" },
    { "type": "select", "id": "object_fit", "options": ["cover", "contain"], "default": "cover" },
    { "type": "checkbox", "id": "enable_hover", "default": false },
    { "type": "checkbox", "id": "show_shadow", "default": false },
    { "type": "checkbox", "id": "inherit_styles", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "default": "default", "conditional": "setting.inherit_styles != true" },
    { "type": "checkbox", "id": "border_radius_override", "default": false, "conditional": "setting.inherit_styles != true" },
    { "type": "range", "id": "border_radius", "min": 0, "max": 100, "default": 0, "conditional": "setting.inherit_styles != true and setting.border_radius_override" },
    { "type": "checkbox", "id": "shadow_color_override", "default": false, "conditional": "setting.inherit_styles != true" },
    { "type": "color", "id": "shadow_color_custom", "default": "rgba(0,0,0,1)", "conditional": "setting.inherit_styles != true and setting.shadow_color_override" }
  ]
}
```

### Scroll Indicator (`blocks/scroll-indicator.liquid`)
```json
{
  "name": "Scroll Indicator",
  "settings": [
    { "type": "range", "id": "bottom_offset", "min": 0, "max": 120, "default": 32, "unit": "px" },
    { "type": "text", "id": "label", "default": "Scroll" },
    { "type": "checkbox", "id": "inherit_styles", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "default": "default", "conditional": "setting.inherit_styles != true" },
    { "type": "checkbox", "id": "text_color_override", "default": false, "conditional": "setting.inherit_styles != true" },
    { "type": "color", "id": "custom_color", "default": "#ffffff", "conditional": "setting.inherit_styles != true and setting.text_color_override" }
  ]
}
```

### Spacer (`blocks/spacer.liquid`)
```json
{
  "name": "Spacer",
  "settings": [
    { "type": "range", "id": "height", "min": 10, "max": 150, "default": 40 },
    { "type": "checkbox", "id": "hide_mobile", "default": false }
  ]
}
```

### Text (`blocks/text.liquid`)
```json
{
  "name": "Text",
  "settings": [
    { "type": "textarea", "id": "content", "default": "Locally sourced ingredients." },
    { "type": "select", "id": "tag", "options": ["h1", "h2", "h3", "h4", "h5", "h6", "p", "div", "span"], "default": "div" },
    { "type": "select", "id": "display_size", "options": ["h1", "h2", "h3", "h4", "h5", "h6", "display", "body", "caption"], "default": "body" },
    { "type": "select", "id": "text_align", "options": ["", "left", "center", "right"], "default": "" },
    { "type": "select", "id": "font_weight", "options": ["normal", "medium", "bold"], "default": "normal" },
    { "type": "checkbox", "id": "italic", "default": false },
    { "type": "select", "id": "text_transform", "options": ["none", "uppercase", "capitalize", "lowercase"], "default": "none" },
    { "type": "select", "id": "text_wrap", "options": ["wrap", "nowrap", "balance"], "default": "wrap" },
    { "type": "select", "id": "overflow_behavior", "options": ["visible", "hidden", "ellipsis"], "default": "visible" },
    { "type": "checkbox", "id": "inherit_styles", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "default": "default", "conditional": "setting.inherit_styles != true" },
    { "type": "checkbox", "id": "text_color_override", "default": false, "conditional": "setting.inherit_styles != true" },
    { "type": "color", "id": "custom_color", "default": "#ffffff", "conditional": "setting.inherit_styles != true and setting.text_color_override" }
  ]
}
```

### Message (`blocks/_announcement.liquid`)
```json
{
  "name": "Message",
  "settings": [
    { "type": "text", "id": "text", "default": "Welcome to our Restaurant" },
    { "type": "url", "id": "link" },
    { "type": "checkbox", "id": "inherit_styles", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "default": "default", "conditional": "setting.inherit_styles != true" }
  ]
}
```

### Column (`blocks/_column.liquid`)
```json
{
  "name": "Column / Item",
  "settings": [
    { "type": "select", "id": "width", "options": ["auto", "full", "half", "third", "two_thirds", "quarter", "fit"], "default": "auto" },
    { "type": "select", "id": "fill", "options": ["auto", "none"], "default": "none" },
    { "type": "checkbox", "id": "inherit_styles", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "default": "default", "conditional": "setting.inherit_styles != true" }
  ],
  "blocks": [{ "type": "@theme" }]
}
```

### Footer Brand (`blocks/_footer-brand.liquid`)
```json
{
  "name": "Brand & Socials",
  "settings": [
    { "type": "image_picker", "id": "logo", "conditional": "shop.logo_src == blank" },
    { "type": "textarea", "id": "text", "default": "Fine dining in the heart of the city." },
    { "type": "checkbox", "id": "show_socials", "default": true },
    { "type": "checkbox", "id": "inherit_styles", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "default": "default", "conditional": "setting.inherit_styles != true" }
  ]
}
```

### Footer Nav (`blocks/_footer-nav.liquid`)
```json
{
  "name": "Footer Nav Group",
  "settings": [
    { "type": "text", "id": "heading", "default": "Quick Links" },
    { "type": "link_list", "id": "menu", "default": "footer" },
    { "type": "checkbox", "id": "inherit_styles", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "default": "default", "conditional": "setting.inherit_styles != true" }
  ]
}
```

### Footer Newsletter (`blocks/_footer-newsletter.liquid`)
```json
{
  "name": "Newsletter",
  "settings": [
    { "type": "text", "id": "heading", "default": "Join the Club" },
    { "type": "text", "id": "text", "default": "Exclusive events and seasonal menu updates." },
    { "type": "text", "id": "email_placeholder", "default": "Email Address" },
    { "type": "checkbox", "id": "inherit_styles", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "default": "default", "conditional": "setting.inherit_styles != true" }
  ]
}
```

### Header Actions (`blocks/_header-actions.liquid`)
```json
{
  "name": "Header Actions",
  "settings": [
    { "type": "checkbox", "id": "show_search", "default": true },
    { "type": "checkbox", "id": "show_cart", "default": true },
    { "type": "text", "id": "btn_label", "default": "Book Table" },
    { "type": "url", "id": "btn_link" },
    { "type": "checkbox", "id": "inherit_styles", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "default": "default", "conditional": "setting.inherit_styles != true" }
  ]
}
```

### Header Logo (`blocks/_header-logo.liquid`)
```json
{
  "name": "Header Logo",
  "settings": [
    { "type": "image_picker", "id": "logo", "conditional": "shop.logo_src == blank" },
    { "type": "range", "id": "width", "min": 50, "max": 400, "default": 120, "unit": "px" },
    { "type": "checkbox", "id": "inherit_styles", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "default": "default", "conditional": "setting.inherit_styles != true" }
  ]
}
```

### Header Menu (`blocks/_header-menu.liquid`)
```json
{
  "name": "Header Nav",
  "settings": [
    { "type": "link_list", "id": "menu", "default": "main-menu" },
    { "type": "checkbox", "id": "show_promo", "default": false },
    { "type": "image_picker", "id": "promo_image", "conditional": "setting.show_promo" },
    { "type": "text", "id": "promo_heading", "default": "Featured", "conditional": "setting.show_promo" },
    { "type": "text", "id": "promo_text", "default": "Check out our new seasonal specials.", "conditional": "setting.show_promo" },
    { "type": "checkbox", "id": "inherit_styles", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "default": "default", "conditional": "setting.inherit_styles != true" }
  ]
}
```

### Marquee (`blocks/_marquee.liquid`)
```json
{
  "name": "Scrolling Marquee",
  "settings": [
    { "type": "checkbox", "id": "pin_bottom", "default": false },
    { "type": "range", "id": "opacity", "min": 0, "max": 100, "default": 95 },
    { "type": "text", "id": "text_list", "default": "Fresh Pasta, Live Music" },
    { "type": "select", "id": "direction", "options": ["left", "right"], "default": "left" },
    { "type": "select", "id": "text_size", "options": ["small", "medium", "large", "xl", "display"], "default": "small" },
    { "type": "checkbox", "id": "uppercase", "default": true },
    { "type": "range", "id": "speed", "min": 5, "max": 30, "default": 15 },
    { "type": "checkbox", "id": "inherit_styles", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "default": "default", "conditional": "setting.inherit_styles != true" }
  ]
}
```

### Slide (`blocks/_slide.liquid`)
```json
{
  "name": "Slide",
  "settings": [
    { "type": "image_picker", "id": "image" },
    { "type": "image_picker", "id": "image_mobile" },
    { "type": "text", "id": "video_url" },
    { "type": "checkbox", "id": "show_placeholder", "default": true },
    { "type": "checkbox", "id": "enable_zoom", "default": false },
    { "type": "checkbox", "id": "enable_gradient", "default": true },
    { "type": "color", "id": "overlay_color", "default": "#000000" },
    { "type": "range", "id": "overlay_opacity", "min": 0, "max": 100, "default": 40 },
    { "type": "select", "id": "content_align", "options": ["left", "center", "right"], "default": "center" },
    { "type": "select", "id": "text_align", "options": ["left", "center", "right"], "default": "center" },
    { "type": "select", "id": "vertical_align", "options": ["top", "middle", "bottom"], "default": "middle" },
    { "type": "checkbox", "id": "inherit_styles", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "default": "default", "conditional": "setting.inherit_styles != true" }
  ],
  "blocks": [{ "type": "@theme" }]
}
```
