# AI Technical Specification & Schema Atlas

> **Source of Truth:** This document contains the **exact** JSON schemas extracted from the codebase.
> **Date:** January 22, 2026 (Updated)
> **Constraint:** Do not hallucinate properties. Based on actual file definitions in `sections/` and `blocks/`.

---

## 1. Global Config (`settings_schema.json`)

```json
{
  "schema": [
    {
      "name": "Color Schemes",
      "type": "group",
      "id": "color_schemes",
      "settings": [
        { "type": "text", "id": "title", "label": "Name", "default": "Default Color Scheme" },
        { "type": "header", "content": "Base Colors" },
        { "type": "color", "id": "background", "label": "Background", "default": "rgba(255, 255, 255, 1)" },
        { "type": "color", "id": "text", "label": "Text", "default": "rgba(255, 255, 255, 1)" },
        { "type": "color", "id": "text_secondary", "label": "Secondary Text", "default": "rgba(102, 102, 102, 1)" },
        { "type": "color", "id": "accent", "label": "Accent / Links", "default": "rgba(0, 0, 0, 1)" },
        { "type": "color", "id": "surface", "label": "Surface / Card Background", "default": "rgba(245, 245, 245, 1)" },
        { "type": "color", "id": "border", "label": "Borders", "default": "rgba(255, 255, 255, 1)" },
        { "type": "color", "id": "shadow", "label": "Shadows", "default": "rgba(0, 0, 0, 1)" },
        { "type": "header", "content": "Buttons" },
        { "type": "color", "id": "button_bg", "label": "Solid Button Background", "default": "rgba(255, 255, 255, 1)" },
        { "type": "color", "id": "button_text", "label": "Solid Button Label", "default": "rgba(255, 255, 255, 1)" },
        { "type": "header", "content": "UI Controls (Arrows/Dots)" },
        { "type": "color", "id": "ui_bg", "label": "Control Background", "default": "rgba(255, 255, 255, 1)" },
        { "type": "color", "id": "ui_text", "label": "Control Icon/Text", "default": "rgba(0, 0, 0, 1)" }
      ]
    },
    {
      "name": "Typography",
      "id": "typography",
      "settings": [
        { "type": "font_picker", "id": "heading_font", "label": "Headings", "default": "sans-serif" },
        { "type": "font_picker", "id": "body_font", "label": "Body Text", "default": "sans-serif" },
        { "type": "font_picker", "id": "button_font", "label": "Buttons & UI", "default": "sans-serif" },
        { "type": "range", "id": "type_scale", "label": "Type Scale", "min": 80, "max": 120, "step": 5, "default": 100, "unit": "%" }
      ]
    },
    {
      "name": "Max Width Schemes",
      "type": "group",
      "id": "width_schemes",
      "settings": [
        { "type": "text", "id": "title", "label": "Name", "default": "Default Width Scheme" },
        { "type": "select", "id": "width", "label": "Width", "options": [
            { "value": "sm", "label": "Small" },
            { "value": "md", "label": "Medium" },
            { "value": "lg", "label": "Large" },
            { "value": "xl", "label": "x-Large" },
            { "value": "2xl", "label": "2x-Large" },
            { "value": "3xl", "label": "3x-Large" },
            { "value": "4xl", "label": "4x-Large" },
            { "value": "fit", "label": "Fit Content" },
            { "value": "full", "label": "Full" },
            { "value": "custom", "label": "Custom" }
          ], "default": "1240px" },
        { "type": "text", "id": "custom_width", "label": "Width", "default": "1496px", "conditional": "setting.width == 'custom'" }
      ]
    },
    {
      "name": "Layout",
      "id": "layout",
      "settings": [
        { "type": "range", "id": "grid_gap", "label": "Grid Gap", "min": 0, "max": 64, "step": 4, "default": 32, "unit": "px" },
        { "type": "range", "id": "corner_radius", "label": "Global Corner Radius", "min": 0, "max": 40, "step": 4, "default": 0, "unit": "px", "info": "Affects buttons, cards, and media." }
      ]
    },
    {
      "name": "Social Media",
      "id": "social-media",
      "settings": [
        { "type": "header", "content": "Accounts" },
        { "type": "text", "id": "social_instagram_link", "label": "Instagram" },
        { "type": "text", "id": "social_facebook_link", "label": "Facebook" },
        { "type": "text", "id": "social_tiktok_link", "label": "TikTok" },
        { "type": "text", "id": "social_twitter_link", "label": "X (Twitter)" },
        { "type": "text", "id": "social_yelp_link", "label": "Yelp" },
        { "type": "text", "id": "social_linkedin_link", "label": "LinkedIn" },
        { "type": "text", "id": "social_youtube_link", "label": "YouTube" }
      ]
    }
  ]
}
```

---

## 2. Sections Schemas

### Announcement Bar (`sections/announcment-bar.liquid`)
```json
{
  "name": "Announcement Bar",
  "class": "section-group-header",
  "restriction": { "groups": ["header"] },
  "settings": [
    { "type": "header", "content": "Layout" },
    { "type": "width_scheme", "id": "width_scheme", "label": "Max Content Width", "default": "full" },
    { "type": "header", "content": "Behavior" },
    { "type": "checkbox", "id": "autoplay", "label": "Autoplay", "default": true },
    { "type": "range", "id": "autoplay_speed", "label": "Speed (s)", "min": 3, "max": 10, "default": 5 },
    { "type": "checkbox", "id": "show_arrows", "label": "Show Arrows on Hover", "default": true },
    { "type": "checkbox", "id": "show_close", "label": "Show Close Button", "default": false },
    { "type": "header", "content": "Theme" },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default" }
  ],
  "blocks": [{ "type": "_announcement" }]
}
```

### Global Background (`sections/background.liquid`)
```json
{
  "name": "Global Background",
  "settings": [
    { "type": "image_picker", "id": "image", "label": "Background Image" },
    { "type": "color", "id": "bg_color", "label": "Background Color", "default": "#ffffff" },
    { "type": "range", "id": "overlay", "label": "Overlay Opacity", "min": 0, "max": 90, "step": 10, "default": 0 }
  ]
}
```

### Divider (`sections/divider.liquid`)
```json
{
  "name": "Divider",
  "settings": [
    { "type": "header", "content": "Layout" },
    { "type": "width_scheme", "id": "width_scheme", "label": "Max Content Width", "default": "full" },
    { "type": "header", "content": "Visuals" },
    { "type": "checkbox", "id": "show_line", "label": "Show Line", "default": true },
    { "type": "checkbox", "id": "show_icon", "label": "Show Icon", "default": true },
    { "type": "select", "id": "icon_select", "label": "Icon", "options": ["star", "chevron-down", "menu"], "default": "star" },
    { "type": "header", "content": "Spacing" },
    { "type": "range", "id": "height", "label": "Height", "min": 0, "max": 600, "step": 4, "default": 32, "unit": "px" },
    { "type": "header", "content": "Theme" },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default" }
  ]
}
```

### Footer (`sections/footer.liquid`)
```json
{
  "name": "Footer",
  "restriction": { "groups": ["footer"] },
  "settings": [
    { "type": "header", "content": "Layout" },
    { "type": "width_scheme", "id": "width_scheme", "label": "Max Content Width", "default": "standard" },
    { "type": "header", "content": "Section Spacing" },
    { "type": "select", "id": "padding_vertical", "label": "Vertical Padding", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "sm" },
    { "type": "range", "id": "padding_vertical_custom", "label": "Custom Vertical Padding", "min": 0, "max": 200, "step": 4, "default": 80, "unit": "px", "conditional": "setting.padding_vertical == 'custom'" },
    { "type": "select", "id": "padding_horizontal", "label": "Horizontal Padding", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "xs" },
    { "type": "range", "id": "padding_horizontal_custom", "label": "Custom Horizontal Padding", "min": 0, "max": 200, "step": 4, "default": 0, "unit": "px", "conditional": "setting.padding_horizontal == 'custom'" },
    { "type": "header", "content": "Bottom Bar" },
    { "type": "checkbox", "id": "show_policy", "label": "Show Policy Links", "default": true },
    { "type": "checkbox", "id": "show_payment", "label": "Show Payment Icons", "default": true },
    { "type": "header", "content": "Theme" },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default" }
  ],
  "blocks": [{ "type": "_footer-brand" }, { "type": "_footer-nav" }, { "type": "_footer-newsletter" }]
}
```

### Flex Container / Grid (`sections/grid.liquid`)
```json
{
  "name": "Flex Container",
  "settings": [
    { "type": "header", "content": "Overlay" },
    { "type": "checkbox", "id": "enable_overlay", "label": "Use Overlay", "default": false },
    { "type": "color", "id": "overlay_color", "label": "Tint / Background Color", "default": "", "conditional": "setting.enable_overlay == true" },
    { "type": "range", "id": "overlay_opacity", "label": "Opacity", "min": 0, "max": 100, "default": 40, "conditional": "setting.enable_overlay == true" },
    { "type": "image_picker", "id": "bg_image", "label": "Background Image" },
    { "type": "image_picker", "id": "bg_image_mobile", "label": "Mobile Background" },
    { "type": "header", "content": "Layout" },
    { "type": "select", "id": "justify_content", "label": "Alignment", "options": ["start", "center", "end", "between"], "default": "center" },
    { "type": "width_scheme", "id": "width_bg", "label": "Background Width", "default": "full" },
    { "type": "width_scheme", "id": "width_scheme", "label": "Content Width", "default": "standard" },
    { "type": "header", "content": "Spacing" },
    { "type": "select", "id": "height", "label": "Section Height", "options": ["auto", "sm", "md", "lg", "xl", "custom"], "default": "auto" },
    { "type": "range", "id": "height_custom", "label": "Custom Height", "min": 200, "max": 1000, "step": 10, "default": 400, "unit": "px", "conditional": "setting.height == 'custom'" },
    { "type": "select", "id": "padding_vertical", "label": "Vertical Padding", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "none" },
    { "type": "range", "id": "padding_vertical_custom", "label": "Custom Vertical Padding", "min": 0, "max": 200, "step": 4, "default": 80, "unit": "px", "conditional": "setting.padding_vertical == 'custom'" },
    { "type": "select", "id": "padding_horizontal", "label": "Horizontal Padding", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "none" },
    { "type": "range", "id": "padding_horizontal_custom", "label": "Custom Horizontal Padding", "min": 0, "max": 200, "step": 4, "default": 0, "unit": "px", "conditional": "setting.padding_horizontal == 'custom'" },
    { "type": "header", "content": "Theme" },
    { "type": "checkbox", "id": "enable_animation", "label": "Enable Animation", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default" },
    { "type": "header", "content": "Gap & Cards" },
    { "type": "checkbox", "id": "enable_cards_global", "label": "Enable Cards for All Columns", "default": false },
    { "type": "select", "id": "card_padding", "label": "Gap / Card Padding", "options": ["none", "xs", "sm", "md", "lg", "custom"], "default": "none" },
    { "type": "range", "id": "card_padding_custom", "label": "Custom Gap", "min": 0, "max": 100, "default": 24, "conditional": "setting.card_padding == 'custom'" },
    { "type": "checkbox", "id": "card_shadow_global", "label": "Show Shadow", "default": false, "conditional": "setting.enable_cards_global == true" }
  ],
  "blocks": [{ "type": "group" }]
}
```

### Header (`sections/header.liquid`)
```json
{
  "name": "Header",
  "class": "section-header",
  "restriction": { "groups": [] },
  "settings": [
    { "type": "header", "content": "Layout" },
    { "type": "width_scheme", "id": "width_scheme", "label": "Max Content Width", "default": "standard" },
    { "type": "select", "id": "desktop_layout", "label": "Logo placement", "options": ["logo_center", "logo_left"], "default": "logo_center" },
    { "type": "select", "id": "nav_alignment", "label": "Navigation Alignment (Desktop)", "options": ["left", "center", "right"], "default": "left", "conditional": "setting.desktop_layout == 'logo_left'" },
    { "type": "header", "content": "Section Spacing" },
    { "type": "select", "id": "padding_vertical", "label": "Vertical Padding", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "none" },
    { "type": "range", "id": "padding_vertical_custom", "label": "Custom Vertical Padding", "min": 0, "max": 200, "step": 4, "default": 80, "unit": "px", "conditional": "setting.padding_vertical == 'custom'" },
    { "type": "select", "id": "padding_horizontal", "label": "Horizontal Padding", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "xs" },
    { "type": "range", "id": "padding_horizontal_custom", "label": "Custom Horizontal Padding", "min": 0, "max": 200, "step": 4, "default": 0, "unit": "px", "conditional": "setting.padding_horizontal == 'custom'" },
    { "type": "header", "content": "Behavior" },
    { "type": "select", "id": "sticky_behavior", "label": "Sticky Mode", "options": ["none", "always", "on_scroll_up"], "default": "always" },
    { "type": "checkbox", "id": "enable_transparent", "label": "Transparent on Top", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default" }
  ],
  "blocks": [{ "type": "_header-logo" }, { "type": "_header-menu" }, { "type": "_header-actions" }]
}
```

### Hero (`sections/hero.liquid`)
```json
{
  "name": "Hero",
  "settings": [
    { "type": "header", "content": "Layout Mode" },
    { "type": "select", "id": "layout_mode", "label": "Layout Mode", "options": ["overlay", "split_left", "split_right"], "default": "overlay" },
    { "type": "header", "content": "Dimensions" },
    { "type": "width_scheme", "id": "width_bg", "label": "Background Width", "default": "full" },
    { "type": "width_scheme", "id": "width_scheme", "label": "Content Width", "default": "standard" },
    { "type": "select", "id": "height", "label": "Section Height", "options": ["auto", "sm", "md", "lg", "xl", "custom"], "default": "auto" },
    { "type": "range", "id": "height_custom", "label": "Custom Height", "min": 200, "max": 1000, "conditional": "setting.height == 'custom'" },
    { "type": "header", "content": "Media" },
    { "type": "image_picker", "id": "bg_image", "label": "Background Image" },
    { "type": "image_picker", "id": "mobile_image", "label": "Mobile Image" },
    { "type": "text", "id": "video_url", "label": "Video URL" },
    { "type": "checkbox", "id": "show_placeholder", "label": "Show Placeholder", "default": true, "conditional": "setting.bg_image == blank" },
    { "type": "header", "content": "Overlay" },
    { "type": "checkbox", "id": "enable_overlay", "label": "Use Overlay", "default": false },
    { "type": "color", "id": "overlay_color", "label": "Tint Color", "default": "", "conditional": "setting.enable_overlay == true" },
    { "type": "range", "id": "overlay_opacity", "label": "Opacity", "min": 0, "max": 100, "default": 40, "conditional": "setting.enable_overlay == true" },
    { "type": "header", "content": "Alignment" },
    { "type": "select", "id": "content_align", "label": "Content Alignment", "options": ["left", "center", "right"], "default": "center" },
    { "type": "select", "id": "text_align", "label": "Text Alignment", "options": ["left", "center", "right"], "default": "center" },
    { "type": "select", "id": "vertical_align", "label": "Vertical Alignment", "options": ["top", "middle", "bottom"], "default": "middle" },
    { "type": "header", "content": "Theme" },
    { "type": "checkbox", "id": "enable_animation", "label": "Enable Entry Animation", "default": true },
    { "type": "checkbox", "id": "enable_zoom", "label": "Enable Ken Burns Effect", "default": false },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default" }
  ],
  "blocks": ["@theme", "scroll-indicator", "text", "spacer", "_marquee", "media", "group", "button"]
}
```

### Scrolling Text (`sections/marquee.liquid`)
```json
{
  "name": "Scrolling Text",
  "settings": [
    { "type": "header", "content": "Layout" },
    { "type": "width_scheme", "id": "width_scheme", "label": "Max Content Width", "default": "full" },
    { "type": "text", "id": "text_list", "label": "Text", "default": "Reserve Now, Open Daily, Fresh Ingredients" },
    { "type": "select", "id": "text_size", "label": "Text Size", "options": ["small", "medium", "large", "xl", "display"], "default": "small" },
    { "type": "checkbox", "id": "uppercase", "label": "Uppercase", "default": true },
    { "type": "range", "id": "speed", "label": "Speed", "min": 5, "max": 60, "default": 20 },
    { "type": "select", "id": "direction", "label": "Direction", "options": ["left", "right"], "default": "left" },
    { "type": "header", "content": "Section Spacing" },
    { "type": "select", "id": "padding_vertical", "label": "Vertical Padding", "default": "none", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"] },
    { "type": "range", "id": "padding_vertical_custom", "min": 0, "max": 200, "step": 4, "default": 80 },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default" }
  ]
}
```

### Media with content (`sections/media-with-content.liquid`)
```json
{
  "name": "Media with content",
  "settings": [
    { "type": "header", "content": "Layout" },
    { "type": "width_scheme", "id": "width_scheme", "label": "Max Content Width", "default": "standard" },
    { "type": "select", "id": "height", "label": "Image Height", "options": ["auto", "sm", "md", "lg", "xl", "custom"], "default": "auto" },
    { "type": "range", "id": "height_custom", "min": 200, "max": 1000, "step": 10, "default": 600, "conditional": "setting.height == 'custom'" },
    { "type": "select", "id": "desktop_layout", "label": "Desktop Stacking", "options": ["image_left", "image_right"], "default": "image_left" },
    { "type": "select", "id": "mobile_layout", "label": "Mobile Stacking", "options": ["image_first", "text_first"], "default": "image_first" },
    { "type": "select", "id": "content_align", "label": "Content Alignment", "options": ["left", "center", "right"], "default": "center" },
    { "type": "select", "id": "text_align", "label": "Text Alignment", "options": ["left", "center", "right"], "default": "center" },
    { "type": "select", "id": "vertical_align", "label": "Vertical Alignment", "options": ["top", "middle", "bottom"], "default": "middle" },
    { "type": "checkbox", "id": "show_shadow", "label": "Show Shadow on Media", "default": true },
    { "type": "header", "content": "Section Spacing" },
    { "type": "select", "id": "padding_vertical", "label": "Vertical Padding", "default": "none", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"] },
    { "type": "range", "id": "padding_vertical_custom", "min": 0, "max": 200, "step": 4, "default": 80 },
    { "type": "header", "content": "Media" },
    { "type": "image_picker", "id": "image", "label": "Feature Image" },
    { "type": "image_picker", "id": "mobile_image", "label": "Feature Image (Mobile)" },
    { "type": "text", "id": "video_url", "label": "Feature Video" },
    { "type": "checkbox", "id": "show_placeholder", "label": "Show Placeholder", "default": true },
    { "type": "header", "content": "Visuals" },
    { "type": "checkbox", "id": "enable_animation", "label": "Enable Entry Animation", "default": true },
    { "type": "checkbox", "id": "enable_zoom", "label": "Enable Ken Burns Effect", "default": false },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default" }
  ],
  "blocks": ["text", "button", "logo", "spacer", "@theme"]
}
```

### Menu View (`sections/menu-list.liquid`)
```json
{
  "name": "Menu View",
  "settings": [
    { "type": "header", "content": "Data Source" },
    { "type": "collection", "id": "menu", "label": "Select Menu" },
    { "type": "select", "id": "display_scope", "label": "Display Scope", "options": ["full_menu", "category"], "default": "full_menu" },
    { "type": "collection", "id": "category", "label": "Category Name", "conditional": "setting.display_scope == 'category'" },
    { "type": "header", "content": "Filtering & Search" },
    { "type": "checkbox", "id": "enable_filtering", "label": "Enable Filtering Bar", "default": true },
    { "type": "header", "content": "Navigation" },
    { "type": "checkbox", "id": "show_nav", "label": "Show Sticky Navigation", "default": true, "conditional": "setting.display_scope == 'full_menu'" },
    { "type": "select", "id": "nav_layout", "label": "Navigation Layout", "options": ["vertical", "horizontal"], "default": "vertical", "conditional": "setting.show_nav" },
    { "type": "range", "id": "nav_sticky_offset", "label": "Sticky Top Offset", "min": 0, "max": 160, "default": 80, "conditional": "setting.show_nav" },
    { "type": "header", "content": "Layout" },
    { "type": "select", "id": "layout_style", "label": "Layout Style", "options": ["list", "card-standard", "card-compact"], "default": "list" },
    { "type": "select", "id": "aspect_ratio", "label": "Card Image Ratio", "options": ["square", "landscape", "portrait"], "default": "landscape", "conditional": "setting.layout_style != 'list'" },
    { "type": "select", "id": "column_preset", "label": "Column Presets", "options": ["1:1:1", "1:2:2", "1:2:3"], "default": "1:2:3" },
    { "type": "header", "content": "Layout Tuning" },
    { "type": "select", "id": "grid_gap_x", "label": "Horizontal Grid Gap", "options": ["tight", "normal", "relaxed", "loose"], "default": "relaxed" },
    { "type": "select", "id": "grid_gap_y", "label": "Vertical Grid Gap", "options": ["tight", "normal", "relaxed", "loose"], "default": "normal" },
    { "type": "select", "id": "card_padding", "label": "Card Internal Padding", "options": ["tight", "compact", "normal", "relaxed", "loose"], "default": "normal", "conditional": "setting.layout_style != 'list'" },
    { "type": "header", "content": "Content" },
    { "type": "text", "id": "heading", "label": "Section Heading", "default": "Menu" },
    { "type": "textarea", "id": "subtext", "label": "Description" },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default" }
  ]
}
```

### Generic section (`sections/section.liquid`)
```json
{
  "name": "Generic section",
  "settings": [
    { "type": "header", "content": "Layout" },
    { "type": "width_scheme", "id": "width_scheme", "label": "Max Content Width", "default": "standard" },
    { "type": "select", "id": "height", "label": "Section Height", "options": ["auto", "sm", "md", "lg", "xl", "custom"], "default": "auto" },
    { "type": "range", "id": "height_custom", "label": "Custom Height", "min": 200, "max": 1000, "conditional": "setting.height == 'custom'" },
    { "type": "select", "id": "flex_direction", "label": "Flex Direction", "options": ["col", "row"], "default": "col" },
    { "type": "header", "content": "Alignment" },
    { "type": "select", "id": "content_align", "label": "Content Alignment", "options": ["left", "center", "right"], "default": "center" },
    { "type": "select", "id": "text_align", "label": "Text Alignment", "options": ["left", "center", "right"], "default": "center" },
    { "type": "select", "id": "vertical_align", "label": "Vertical Alignment", "options": ["top", "middle", "bottom"], "default": "middle" },
    { "type": "header", "content": "Section Spacing" },
    { "type": "select", "id": "padding_vertical", "label": "Vertical Padding", "default": "none", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"] },
    { "type": "range", "id": "padding_vertical_custom", "min": 0, "max": 200, "step": 4, "default": 80 },
    { "type": "header", "content": "Theme" },
    { "type": "checkbox", "id": "enable_animation", "label": "Enable Animation", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default" }
  ],
  "blocks": ["@theme", "scroll-indicator", "text", "spacer", "_marquee", "media", "group", "button"]
}
```

### Slideshow (`sections/slideshow.liquid`)
```json
{
  "name": "Slideshow",
  "settings": [
    { "type": "header", "content": "Layout" },
    { "type": "width_scheme", "id": "width_scheme", "label": "Max Content Width", "default": "standard" },
    { "type": "select", "id": "height", "label": "Image Height", "options": ["sm", "md", "lg", "xl", "custom"], "default": "sm" },
    { "type": "range", "id": "slide_gap", "label": "Gap between slides", "min": 0, "max": 40, "default": 0, "unit": "px" },
    { "type": "range", "id": "slide_width", "label": "Slide Width (Desktop)", "min": 80, "max": 100, "default": 100, "unit": "%" },
    { "type": "range", "id": "slide_width_mobile", "label": "Slide Width (Mobile)", "min": 80, "max": 100, "default": 100, "unit": "%" },
    { "type": "header", "content": "Controls" },
    { "type": "checkbox", "id": "show_arrows", "label": "Show Arrows", "default": true },
    { "type": "checkbox", "id": "show_dots", "label": "Show Pagination", "default": true },
    { "type": "select", "id": "dot_style", "label": "Pagination Style", "options": ["dots", "bars", "numbers"], "default": "dots", "conditional": "setting.show_dots" },
    { "type": "select", "id": "arrow_icon", "label": "Arrow Style", "options": ["chevron-left", "arrow-left"], "default": "chevron-left", "conditional": "setting.show_arrows" },
    { "type": "select", "id": "nav_position", "label": "Controls Position", "options": ["bottom_center", "bottom_left", "bottom_right"], "default": "bottom_center", "conditional": "setting.show_dots" },
    { "type": "header", "content": "Behavior" },
    { "type": "checkbox", "id": "infinite_scroll", "label": "Infinite Loop", "default": true },
    { "type": "checkbox", "id": "autoplay", "label": "Autoplay", "default": false },
    { "type": "range", "id": "autoplay_speed", "label": "Speed", "min": 3, "max": 10, "default": 5, "conditional": "setting.autoplay == true" },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default" }
  ],
  "blocks": [{ "type": "_slide" }]
}
```

---

## 3. Block Schemas

### Repeater (`blocks/repeater.liquid`)
```json
{
  "name": "Repeater Template",
  "settings": [
    { "type": "header", "content": "Data Source" },
    {
      "type": "select",
      "id": "data_source_type",
      "label": "Type",
      "options": [
        { "value": "json", "label": "JSON" },
        { "value": "inherit", "label": "Inherit" },
        { "value": "item_collection", "label": "Item Collection" }
      ]
    },
    { "type": "json", "id": "data_json", "label": "JSON", "default": "{}", "conditional": "setting.data_source_type == 'json'" },
    { "type": "text", "id": "data_field", "label": "Context Field", "conditional": "setting.data_source_type == 'inherit'" },
    { "type": "collection", "id": "item_collection", "label": "Select Item Collection", "conditional": "setting.data_source_type == 'item_collection'" }
  ],
  "blocks": [{ "type": "@theme" }, { "type": "_menu-card-full" }, { "type": "_menu-card-compact" }]
}
```

### Menu Card Full (`blocks/_menu-card-full.liquid`)
```json
{
  "name": "full-menu-card",
  "blocks": {
    "menu-card-header": {
      "type": "group",
      "name": "Heading",
      "static": true,
      "settings": { "gap": "none", "padding_vertical": "none", "padding_horizontal": "none" },
      "blocks": { "img": { "type": "media" } }
    },
    "menu-card-content": {
      "type": "group",
      "name": "Content",
      "static": true,
      "settings": { "gap": "sm", "padding_vertical": "xs", "padding_horizontal": "md" },
      "blocks": {
        "desc": { "type": "text" },
        "info": { "type": "group" }
      }
    },
    "menu-card-footer": {
      "type": "group",
      "name": "Footer",
      "static": true,
      "settings": { "gap": "xs", "padding_vertical": "xs", "padding_horizontal": "md" },
      "blocks": { "btn": { "type": "button" } }
    }
  },
  "settings": { "gap": "none", "shadow": true }
}
```

### Menu Card Compact (`blocks/_menu-card-compact.liquid`)
```json
{
  "name": "compact-menu-card",
  "blocks": {
    "menu-card-side": {
      "type": "group",
      "name": "Side Image",
      "static": true,
      "settings": { "width": "fit", "padding_vertical": "none", "padding_horizontal": "none" },
      "blocks": {
        "img": { "type": "media", "settings": { "height": "custom", "custom_height": 120, "aspect_ratio": "square" } }
      }
    },
    "menu-card-content": {
      "type": "group",
      "name": "Content",
      "static": true,
      "settings": { "gap": "xs", "padding_vertical": "sm", "padding_horizontal": "sm" },
      "blocks": {
        "title": { "type": "text" },
        "price": { "type": "text" },
        "desc": { "type": "text" }
      }
    },
    "menu-card-footer": {
      "type": "group",
      "name": "Footer",
      "static": true,
      "settings": { "gap": "xs", "padding_vertical": "sm", "padding_horizontal": "sm" },
      "blocks": { "btn": { "type": "button" } }
    }
  },
  "settings": { "direction": "row", "gap": "none", "shadow": true }
}
```

### Group (`blocks/group.liquid`)
```json
{
  "name": "Group",
  "settings": [
    { "type": "header", "content": "Layout Mode" },
    { "type": "select", "id": "layout_mode", "label": "Mode", "options": ["flex", "grid"], "default": "flex" },
    { "type": "range", "id": "min_column_width", "label": "Min Item Width", "min": 100, "max": 500, "step": 10, "conditional": "setting.layout_mode == 'grid'" },
    { "type": "header", "content": "Flex Settings" },
    { "type": "select", "id": "direction", "label": "Direction", "options": ["column", "row"], "default": "column", "conditional": "setting.layout_mode == 'flex'" },
    { "type": "select", "id": "content_align", "label": "Horizontal Alignment", "options": ["left", "center", "right", "between", "stretch"], "default": "left", "conditional": "setting.layout_mode == 'flex'" },
    { "type": "select", "id": "vertical_align", "label": "Vertical Alignment", "options": ["top", "middle", "bottom", "between", "stretch"], "default": "top", "conditional": "setting.layout_mode == 'flex'" },
    { "type": "checkbox", "id": "wrap_content", "label": "Wrap Content", "default": false, "conditional": "setting.layout_mode == 'flex'" },
    { "type": "header", "content": "General Styles" },
    { "type": "select", "id": "width", "label": "Width", "options": ["full", "fit"], "default": "full" },
    { "type": "select", "id": "height", "label": "Height", "options": ["auto", "full"], "default": "auto" },
    { "type": "select", "id": "position", "label": "Position Type", "options": ["relative", "absolute"], "default": "relative" },
    { "type": "select", "id": "inset", "label": "Anchor", "options": ["top-left", "top-right", "bottom-left", "bottom-right", "cover"], "default": "top-left", "conditional": "setting.position == 'absolute'" },
    { "type": "select", "id": "padding_vertical", "label": "Vertical Padding", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "md" },
    { "type": "select", "id": "padding_horizontal", "label": "Horizontal Padding", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "md" },
    { "type": "select", "id": "gap", "label": "Gap", "options": ["none", "xs", "sm", "md", "lg", "xl", "custom"], "default": "md" },
    { "type": "header", "content": "Style" },
    { "type": "checkbox", "id": "shadow", "label": "Show Shadow", "default": false },
    { "type": "checkbox", "id": "enable_glass", "label": "Glass Effect", "default": false },
    { "type": "checkbox", "id": "overflow_hidden", "label": "Clip Content", "default": false },
    { "type": "checkbox", "id": "inherit_styles", "label": "Inherit Theme Styles", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Scheme", "default": "default", "conditional": "setting.inherit_styles != true" }
  ],
  "blocks": [{ "type": "@theme" }]
}
```

### Media (`blocks/media.liquid`)
```json
{
  "name": "Media (Image/Video)",
  "settings": [
    { "type": "header", "content": "Content" },
    { "type": "image_picker", "id": "image", "label": "Desktop Image" },
    { "type": "image_picker", "id": "image_mobile", "label": "Mobile Image" },
    { "type": "text", "id": "video_url", "label": "Video URL (MP4)" },
    { "type": "checkbox", "id": "show_controls", "label": "Show Video Controls", "default": false },
    { "type": "checkbox", "id": "autoplay", "label": "Autoplay Video", "default": false },
    { "type": "header", "content": "Layout" },
    { "type": "select", "id": "height", "label": "Image Height", "options": ["auto", "sm", "md", "lg", "xl", "thumbnail", "custom"], "default": "auto" },
    { "type": "range", "id": "custom_height", "label": "Custom Height (px)", "min": 20, "max": 800, "conditional": "setting.height == 'custom'" },
    { "type": "select", "id": "aspect_ratio", "label": "Aspect Ratio", "options": ["auto", "square", "video", "portrait", "landscape"], "default": "auto" },
    { "type": "select", "id": "object_fit", "label": "Object Fit", "options": ["cover", "contain"], "default": "cover" },
    { "type": "header", "content": "Style" },
    { "type": "checkbox", "id": "enable_hover", "label": "Enable Hover Zoom", "default": false },
    { "type": "checkbox", "id": "show_shadow", "label": "Show Shadow", "default": false },
    { "type": "checkbox", "id": "inherit_styles", "label": "Inherit Global Styles", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default", "conditional": "setting.inherit_styles != true" },
    { "type": "checkbox", "id": "border_radius_override", "label": "Override Border Radius", "default": false, "conditional": "setting.inherit_styles != true" },
    { "type": "range", "id": "border_radius", "label": "Custom Radius", "min": 0, "max": 100, "conditional": "setting.inherit_styles != true and setting.border_radius_override" }
  ]
}
```

### Text (`blocks/text.liquid`)
```json
{
  "name": "Text",
  "settings": [
    { "type": "textarea", "id": "content", "label": "Content", "default": "Locally sourced ingredients." },
    { "type": "header", "content": "Typography" },
    { "type": "select", "id": "tag", "label": "HTML Tag", "options": ["h1", "h2", "h3", "h4", "h5", "h6", "p", "div", "span"], "default": "div" },
    { "type": "select", "id": "display_size", "label": "Size", "options": ["h1", "h2", "display", "body", "caption", "small"], "default": "body" },
    { "type": "select", "id": "text_align", "label": "Alignment", "options": ["", "left", "center", "right"], "default": "" },
    { "type": "select", "id": "font_weight", "label": "Weight", "options": ["normal", "medium", "bold"], "default": "normal" },
    { "type": "checkbox", "id": "italic", "label": "Italic", "default": false },
    { "type": "select", "id": "text_transform", "label": "Text Transform", "default": "none", "options": ["none", "uppercase", "capitalize", "lowercase"] },
    { "type": "select", "id": "text_wrap", "label": "Text Wrapping", "default": "wrap", "options": ["wrap", "nowrap", "balance"] },
    { "type": "header", "content": "Style" },
    { "type": "checkbox", "id": "inherit_styles", "label": "Inherit Global Styles", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default", "conditional": "setting.inherit_styles != true" }
  ]
}
```

### Button (`blocks/button.liquid`)
```json
{
  "name": "Button",
  "settings": [
    { "type": "text", "id": "label", "label": "Label", "default": "Book Now" },
    { "type": "url", "id": "link", "label": "Link" },
    { "type": "select", "id": "style", "label": "Layout", "default": "primary", "options": ["primary", "outline", "link"] },
    { "type": "select", "id": "width", "label": "Width", "default": "auto", "options": ["auto", "full"] },
    { "type": "header", "content": "Style" },
    { "type": "checkbox", "id": "inherit_styles", "label": "Inherit Theme Colors", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default", "conditional": "setting.inherit_styles != true" },
    { "type": "checkbox", "id": "bg_color_override", "label": "Override Background", "default": false, "conditional": "setting.inherit_styles != true" },
    { "type": "color", "id": "custom_bg", "label": "Custom Background", "conditional": "setting.inherit_styles != true and setting.bg_color_override" },
    { "type": "checkbox", "id": "text_color_override", "label": "Override Text Color", "default": false, "conditional": "setting.inherit_styles != true" },
    { "type": "checkbox", "id": "border_radius_override", "label": "Override Border Radius", "default": false, "conditional": "setting.inherit_styles != true" }
  ]
}
```

### Spacer (`blocks/spacer.liquid`)
```json
{
  "name": "Spacer",
  "settings": [
    { "type": "range", "id": "height", "label": "Height (px)", "min": 10, "max": 150, "default": 40 },
    { "type": "checkbox", "id": "hide_mobile", "label": "Hide on Mobile", "default": false }
  ]
}
```

### Scroll Indicator (`blocks/scroll-indicator.liquid`)
```json
{
  "name": "Scroll Indicator",
  "settings": [
    { "type": "range", "id": "bottom_offset", "label": "Bottom Offset", "min": 0, "max": 120, "default": 32 },
    { "type": "text", "id": "label", "label": "Label", "default": "Scroll" },
    { "type": "checkbox", "id": "inherit_styles", "label": "Inherit Global Styles", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default", "conditional": "setting.inherit_styles != true" }
  ]
}
```

### Badge Pill (`blocks/badge.liquid`)
```json
{
  "name": "Badge Pill",
  "settings": [
    { "type": "text", "id": "text", "label": "Text", "default": "100% Grass-Fed • Zero Seed Oils" },
    { "type": "color", "id": "bg_color", "label": "Background Color", "default": "#06d6a0" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#ffffff" }
  ]
}
```

### Logo (`blocks/logo.liquid`)
```json
{
  "name": "Logo Icon",
  "settings": [
    { "type": "image_picker", "id": "image", "label": "Image" },
    { "type": "range", "id": "width", "label": "Width", "min": 50, "max": 300, "default": 150 }
  ]
}
```

### Scoped Blocks (Private / Inherited)

#### Announcement Message (`blocks/_announcement.liquid`)
```json
{
  "name": "Message",
  "settings": [
    { "type": "text", "id": "text", "label": "Text", "default": "Welcome to our Restaurant" },
    { "type": "url", "id": "link", "label": "Link" },
    { "type": "header", "content": "Style" },
    { "type": "checkbox", "id": "inherit_styles", "label": "Inherit Styles", "default": true },
    { "type": "header", "content": "Overrides", "conditional": "setting.inherit_styles != true" },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default", "conditional": "setting.inherit_styles != true" }
  ]
}
```

#### Column Item (`blocks/_column.liquid`)
```json
{
  "name": "Column / Item",
  "settings": [
    { "type": "select", "id": "width", "label": "Width", "options": [{"value":"auto","label":"Auto (Grid Default)"},{"value":"full","label":"Full (100%)"},{"value":"half","label":"Half (50%)"},{"value":"third","label":"Third (33%)"},{"value":"two_thirds","label":"Two Thirds (66%)"},{"value":"quarter","label":"Quarter (25%)"},{"value":"fit","label":"Fit to Content (Crisp)"}], "default": "auto" },
    { "type": "select", "id": "fill", "label": "Flex Fill", "options": [{"value":"auto","label":"Fill"},{"value":"none","label":"None"}], "default": "none" },
    { "type": "header", "content": "Style" },
    { "type": "checkbox", "id": "inherit_styles", "label": "Inherit Styles", "default": true },
    { "type": "header", "content": "Overrides", "conditional": "setting.inherit_styles != true" },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default", "conditional": "setting.inherit_styles != true" }
  ],
  "blocks": [{ "type": "@theme" }],
  "presets": [{ "name": "Column", "settings": {}, "blocks": {}, "block_order": [] }]
}
```

#### Footer Brand (`blocks/_footer-brand.liquid`)
```json
{
  "name": "Brand & Socials",
  "settings": [
    { "type": "image_picker", "id": "logo", "label": "Footer Logo", "conditional": "shop.logo_src == blank" },
    { "type": "textarea", "id": "text", "label": "Bio", "default": "Fine dining in the heart of the city." },
    { "type": "checkbox", "id": "show_socials", "label": "Show Social Icons", "default": true },
    { "type": "header", "content": "Style" },
    { "type": "checkbox", "id": "inherit_styles", "label": "Inherit Styles", "default": true },
    { "type": "header", "content": "Overrides", "conditional": "setting.inherit_styles != true" },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default", "conditional": "setting.inherit_styles != true" }
  ]
}
```

#### Footer Navigation (`blocks/_footer-nav.liquid`)
```json
{
  "name": "Footer Nav Group",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Quick Links" },
    { "type": "link_list", "id": "menu", "label": "Menu", "default": "footer" },
    { "type": "header", "content": "Style" },
    { "type": "checkbox", "id": "inherit_styles", "label": "Inherit Styles", "default": true },
    { "type": "header", "content": "Overrides", "conditional": "setting.inherit_styles != true" },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default", "conditional": "setting.inherit_styles != true" }
  ]
}
```

#### Footer Newsletter (`blocks/_footer-newsletter.liquid`)
```json
{
  "name": "Newsletter",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Join the Club" },
    { "type": "text", "id": "text", "label": "Text", "default": "Exclusive events and seasonal menu updates." },
    { "type": "text", "id": "email_placeholder", "label": "Placeholder text", "default": "Email Address" },
    { "type": "header", "content": "Style" },
    { "type": "checkbox", "id": "inherit_styles", "label": "Inherit Styles", "default": true },
    { "type": "header", "content": "Overrides", "conditional": "setting.inherit_styles != true" },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default", "conditional": "setting.inherit_styles != true" }
  ]
}
```

#### Header Actions (`blocks/_header-actions.liquid`)
```json
{
  "name": "Header Actions",
  "settings": [
    { "type": "checkbox", "id": "show_search", "label": "Show Search", "default": true },
    { "type": "checkbox", "id": "show_cart", "label": "Show Cart", "default": true },
    { "type": "header", "content": "Style" },
    { "type": "checkbox", "id": "inherit_styles", "label": "Inherit Styles", "default": true },
    { "type": "header", "content": "Overrides", "conditional": "setting.inherit_styles != true" },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default", "conditional": "setting.inherit_styles != true" }
  ],
  "blocks": [{ "type": "button" }],
  "presets": [{ "name": "Action Button", "settings": {}, "blocks": {}, "block_order": [] }]
}
```

#### Header Logo (`blocks/_header-logo.liquid`)
```json
{
  "name": "Header Logo",
  "settings": [
    { "type": "image_picker", "id": "logo", "label": "Logo", "conditional": "shop.logo_src == blank" },
    { "type": "range", "id": "width", "label": "Width", "min": 50, "max": 400, "default": 120, "unit": "px" },
    { "type": "header", "content": "Style", "conditional": "shop.logo_src == blank" },
    { "type": "checkbox", "id": "inherit_styles", "label": "Inherit Styles", "default": true, "conditional": "shop.logo_src == blank" },
    { "type": "header", "content": "Overrides", "conditional": "setting.inherit_styles != true and shop.logo_src == blank" },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default", "conditional": "setting.inherit_styles != true and shop.logo_src == blank" },
    { "type": "checkbox", "id": "text_color_override", "label": "Override Text Color", "default": false, "conditional": "setting.inherit_styles != true and shop.logo_src == blank" },
    { "type": "color", "id": "custom_text_color", "label": "Custom Text Color", "default": "#ffffff", "conditional": "setting.inherit_styles != true and setting.text_color_override and shop.logo_src == blank" }
  ]
}
```

#### Header Menu (`blocks/_header-menu.liquid`)
```json
{
  "name": "Header Nav",
  "settings": [
    { "type": "link_list", "id": "menu", "label": "Menu", "default": "main-menu" },
    { "type": "header", "content": "Mega Menu Promo" },
    { "type": "checkbox", "id": "show_promo", "label": "Show Promo Block", "default": false },
    { "type": "image_picker", "id": "promo_image", "label": "Promo Image", "conditional": "setting.show_promo" },
    { "type": "text", "id": "promo_heading", "label": "Promo Heading", "default": "Featured", "conditional": "setting.show_promo" },
    { "type": "text", "id": "promo_text", "label": "Promo Text", "default": "Check out our new seasonal specials.", "conditional": "setting.show_promo" },
    { "type": "header", "content": "Style" },
    { "type": "checkbox", "id": "inherit_styles", "label": "Inherit Styles", "default": true },
    { "type": "header", "content": "Overrides", "conditional": "setting.inherit_styles != true" },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default", "conditional": "setting.inherit_styles != true" }
  ]
}
```

#### Marquee Item (`blocks/_marquee.liquid`)
```json
{
  "name": "Scrolling Marquee",
  "settings": [
    { "type": "header", "content": "Layout" },
    { "type": "checkbox", "id": "pin_bottom", "label": "Pin to Bottom", "default": false },
    { "type": "range", "id": "opacity", "label": "Opacity", "min": 0, "max": 100, "default": 95 },
    { "type": "header", "content": "Content" },
    { "type": "text", "id": "text_list", "label": "Items", "default": "Fresh Pasta, Live Music" },
    { "type": "select", "id": "direction", "label": "Direction", "options": [{"value":"left","label":"Left"},{"value":"right","label":"Right"}], "default": "left" },
    { "type": "select", "id": "text_size", "label": "Text Size", "options": [{"value":"small","label":"Small"},{"value":"medium","label":"Medium"},{"value":"large","label":"Large"},{"value":"xl","label":"Extra Large"},{"value":"display","label":"Display"}], "default": "small" },
    { "type": "checkbox", "id": "uppercase", "label": "Uppercase", "default": true },
    { "type": "range", "id": "speed", "label": "Speed", "min": 5, "max": 30, "default": 15 },
    { "type": "header", "content": "Style" },
    { "type": "checkbox", "id": "inherit_styles", "label": "Inherit Color Scheme", "default": true },
    { "type": "header", "content": "Overrides", "conditional": "setting.inherit_styles != true" },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Scheme", "default": "default", "conditional": "setting.inherit_styles != true" }
  ]
}
```

#### Slide (`blocks/_slide.liquid`)
```json
{
  "name": "Slide",
  "settings": [
    { "type": "header", "content": "Media" },
    { "type": "image_picker", "id": "image", "label": "Desktop Image" },
    { "type": "image_picker", "id": "image_mobile", "label": "Mobile Image" },
    { "type": "text", "id": "video_url", "label": "Video URL (MP4)" },
    { "type": "checkbox", "id": "show_placeholder", "label": "Show Placeholder", "default": true },
    { "type": "checkbox", "id": "enable_zoom", "label": "Enable Ken Burns (Zoom)", "default": false },
    { "type": "header", "content": "Overlay" },
    { "type": "checkbox", "id": "enable_overlay", "label": "Use Overlay", "default": true },
    { "type": "color", "id": "overlay_color", "label": "Tint Color", "default": "#000000", "conditional": "setting.enable_overlay == true" },
    { "type": "range", "id": "overlay_opacity", "label": "Opacity", "min": 0, "max": 100, "default": 40, "conditional": "setting.enable_overlay == true" },
    { "type": "header", "content": "Alignment" },
    { "type": "select", "id": "content_align", "label": "Content Alignment", "options": ["left", "center", "right"], "default": "center" },
    { "type": "select", "id": "text_align", "label": "Text Alignment", "options": ["left", "center", "right"], "default": "center" },
    { "type": "select", "id": "vertical_align", "label": "Vertical Alignment", "options": ["top", "middle", "bottom"], "default": "middle" },
    { "type": "header", "content": "Style" },
    { "type": "checkbox", "id": "inherit_styles", "label": "Inherit Color Scheme", "default": true },
    { "type": "header", "content": "Overrides", "conditional": "setting.inherit_styles != true" },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color Palette", "default": "default", "conditional": "setting.inherit_styles != true" }
  ],
  "blocks": [{ "type": "@theme" }]
}
```
