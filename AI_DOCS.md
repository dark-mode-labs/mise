# AI Theme Documentation & Component Reference

This document serves as the Interface Control Document (ICD) and SDK reference for the `mise` theme. It exhaustively lists every architectural concept, component, property, and allowed value. Use this strictly for generating valid theme code.

## 0. Development Conventions
- **Liquid Syntax**: Use standard tags `{{ variable }}` and `{% tag %}`.
  - **Do NOT** use whitespace control tags like `{{- variable -}}` or `{%- tag -%}`.
- **File Naming**:
  - `_filename.liquid`: Scoped/Structural block (intended for specific parent).
  - `filename.liquid`: Generic block or Section.

---

## 1. System Architecture

### 1.1 Hierarchy & Composition
The theme follows a strict compositional hierarchy:
1.  **Layout** (`layout/*.liquid`): The root HTML frame. Renders logical **Groups** (Header/Footer) and the dynamic **Main** content.
2.  **Sections** (`sections/*.liquid`): The primary structural units of a page.
    *   **Can contain**: Blocks (via JSON schema) or Snippets (via `{% render %}`).
    *   **Responsibilities**: Container width, vertical spacing, background surfaces.
3.  **Blocks** (`blocks/*.liquid`): Modular content units.
    *   **Can contain**: Other Blocks (via `@theme` or preset logic) or Snippets.
    *   **Generic**: Reusable anywhere (e.g., `button`, `text`).
    *   **Scoped**: Designed for specific parents (e.g., `_slide`, `_column`).
4.  **Snippets** (`snippets/*.liquid`): Atomic, reusable rendering logic.
    *   **Atomic**: Cannot contain blocks or sections. Accepts arguments via `with` or named parameters.

### 1.2 Special Schema Attributes
- **`presets`**: Defines default configurations (settings & block structure) when a section is added via the CMS.
- **`static: true`**: (Block only) Indicates the block is structurally fixed within its parent section. It cannot be added, removed, or reordered by the editor—only customized.
- **`"type": "@theme"`**: (Block Schema) A keyword in `schema.blocks` allowing the section/block to accept *any* generic block registered in the theme (e.g., `text`, `button`, `image`).

---

## 2. Global Design Tokens (`settings_schema.json`)
Reference these IDs in `settings` or CSS variables.

### Color Schemes (`color_schemes`)
Defines the palette used by the theme.
- **Base Colors**: `background`, `text`, `text_secondary`
- **Surface/UI**: `accent`, `surface`, `border`, `shadow`
- **Buttons**: `button_bg`, `button_text`
- **Controls**: `ui_bg`, `ui_text`

### Typography (`typography`)
- `heading_font`: Headings (H1-H6)
- `body_font`: Body text
- `button_font`: Buttons & UI
- `type_scale`: Range (`80`-`120`)

### Max Width Schemes (`width_schemes`)
Used by `width_scheme` settings in sections.
- `width`: Select (`sm`...`4xl`, `fit`, `full`, `custom`)
- `custom_width`: Text (e.g., `1496px`)

### Layout (`layout`)
- `grid_gap`: Range (`0`-`64`px)
- `corner_radius`: Range (`0`-`40`px)

### Social Media (`social-media`)
Links for `social-links` snippet.
- `social_instagram_link` (Handle)
- `social_facebook_link` (Page)
- `social_tiktok_link` (Handle)
- `social_twitter_link` (Handle)
- `social_yelp_link` (Biz ID)
- `social_linkedin_link` (Company)
- `social_youtube_link` (Handle)

---

## 3. Sections Reference (ICD)

### **Announcement Bar** (`sections/announcment-bar.liquid`)
*Top-of-page scrolling or static alerts.*
- **Presets**: Default setup with 2 announcements.
- **Settings**:
  - `width_scheme`: Select (`full`)
  - `autoplay`: Checkbox (`true`)
  - `autoplay_speed`: Range (`3`-`10`, default `5`)
  - `show_arrows`: Checkbox (`true`)
  - `show_close`: Checkbox (`false`)
  - `color_scheme`: Color Scheme (`default`)
- **Blocks**: `_announcement`

### **Divider** (`sections/divider.liquid`)
*Visual separator with optional icon.*
- **Settings**:
  - `width_scheme`: Select (`full`)
  - `show_line`: Checkbox (`true`)
  - `show_icon`: Checkbox (`true`)
  - `icon_select`: Select (`star`, `chevron-down`, `menu`, default: `star`)

### **Footer** (`sections/footer.liquid`)
*Site footer container.*
- **Settings**:
  - `width_scheme`: Select (`standard`)
  - `padding_vertical`: Select (`none`, `xs`, `sm`, `md`, `lg`, `xl`, `custom`)
  - `padding_vertical_custom`: Range (`0`-`200`px)
  - `padding_horizontal`: Select (`none`, `xs`... `custom`)
  - `show_policy`: Checkbox (`true`)
  - `show_payment`: Checkbox (`true`)
  - `color_scheme`: Color Scheme (`default`)
- **Blocks**: `_footer-brand`, `_footer-nav`, `_footer-newsletter`

### **Grid** (`sections/grid.liquid`)
*Multi-column layout for features, process steps, or cards.*
- **Settings**:
  - `justify_content`: Select (`start`, `center`, `end`, `between`, default: `center`)
  - `width_scheme`: Select (`standard`)
  - `enable_gradient`: Checkbox (`false`)
  - `overlay_color`: Color
  - `overlay_opacity`: Range (`0`-`100`)
  - `bg_image` / `bg_image_mobile`: Image Picker
  - `columns_desktop`: Range (`2`-`4`, default `3`)
  - `columns_mobile`: Range (`1`-`2`, default `2`)
  - `height`: Select (`auto`, `sm`, `md`, `lg`, `xl`, `custom`)
  - `height_custom`: Range (`200`-`1000`)
  - `enable_cards_global`: Checkbox (`false`)
  - `card_padding`: Select (`none`...`lg`, `custom`, default: `md`)
  - `card_shadow_global`: Checkbox (`false`)
- **Blocks**: `_column` (Container for generic blocks)

### **Header** (`sections/header.liquid`)
*Main site navigation.*
- **Settings**:
  - `desktop_layout`: Select (`logo_center`, `logo_left`)
  - `nav_alignment`: Select (`left`, `center`, `right`, default: `left`)
  - `sticky_behavior`: Select (`none`, `always`, `on_scroll_up`)
  - `enable_transparent`: Checkbox (`true`)
  - `color_scheme`: Color Scheme
- **Blocks**: `_header-logo` (static), `_header-menu` (static), `_header-actions` (static)

### **Hero** (`sections/hero.liquid`)
*Primary impact section.*
- **Settings**:
  - `layout_mode`: Select (`overlay`, `split_left`, `split_right`)
  - `height`: Select (`auto`, `sm`... `xl`, `custom`, default: `auto`)
  - `bg_image` / `mobile_image`: Image Picker
  - `video_url`: Text (MP4)
  - `bg_image_2` / `video_url_2`: Secondary media for split mode
  - `enable_gradient`: Checkbox
  - `overlay_color`: Color
  - `overlay_opacity`: Range (`0`-`100`)
  - `content_align` / `text_align`: Select (`left`, `center`, `right`)
  - `vertical_align`: Select (`top`, `middle`, `bottom`)
  - `enable_animation`: Checkbox
  - `enable_zoom`: Checkbox
- **Blocks**: `@theme` (Any generic block), `scroll-indicator`

### **Marquee** (`sections/marquee.liquid`)
*Scrolling text banner.*
- **Settings**:
  - `text_list`: Text (Comma separated)
  - `text_size`: Select (`small`, `medium`, `large`, `xl`, `display`)
  - `uppercase`: Checkbox (`true`)
  - `speed`: Range (`5`-`60`, default: `20`)
  - `direction`: Select (`left`, `right`)
  - `color_scheme`: Color Scheme

### **Media with Content** (`sections/media-with-content.liquid`)
*Narrative section (Image + Text).*
- **Settings**:
  - `desktop_layout`: Select (`image_left`, `image_right`)
  - `mobile_layout`: Select (`image_first`, `text_first`)
  - `content_align` / `text_align` / `vertical_align`: Alignment controls
  - `show_shadow`: Checkbox
  - `image` / `video_url`: Media source
  - `enable_animation`: Checkbox
  - `enable_zoom`: Checkbox (Ken Burns)
- **Blocks**: `heading`, `text`, `button`, `logo`, `spacer`

### **Menu List** (`sections/menu-list.liquid`)
*Complex collection-based menu rendering.*
- **Settings**:
  - `menu`: Collection
  - `display_scope`: Select (`full_menu`, `category`)
  - `enable_filtering`: Checkbox
  - `show_nav`: Checkbox (Sticky nav)
  - `nav_layout`: Select (`vertical`, `horizontal`)
  - `layout_style`: Select (`list`, `card-standard`, `card-compact`)
  - `aspect_ratio`: Select (`square`, `landscape`, `portrait`)
  - `column_preset`: Select (`1:1:1`, `1:2:2`, `1:2:3`)
  - `grid_gap_x` / `grid_gap_y`: Select (`tight`, `normal`, `relaxed`, `loose`)
  - `list_image_size`: Select (`small`, `medium`, `large`)

### **Slideshow** (`sections/slideshow.liquid`)
*Carousel.*
- **Settings**:
  - `height`: Select (`sm`...`xl`, `custom`)
  - `slide_gap`: Range (`0`-`40`px)
  - `slide_width`: Range (`80`-`100`%)
  - `show_arrows` / `show_dots`: Checkbox
  - `dot_style`: Select (`dots`, `bars`, `numbers`)
  - `autoplay` / `infinite_scroll`: Behavior
- **Blocks**: `_slide` (Container)

---

## 4. Blocks Reference (ICD)

### A. Generic Blocks (Available in `@theme` slots)

#### **Button** (`blocks/button.liquid`)
- **Settings**:
  - `label`: Text
  - `link`: URL
  - `style`: Select (`primary`, `outline`, `link`)
  - `width`: Select (`auto`, `full`)
  - `inherit_style`: Checkbox (If false, use custom colors)
  - `custom_bg` / `custom_text`: Color

#### **Badge Pill** (`blocks/badge.liquid`)
- **Settings**:
  - `text`: Text (Default: "100% Grass-Fed...")
  - `bg_color`: Color (Default: `#06d6a0`)
  - `text_color`: Color (Default: `#ffffff`)

#### **Group** (`blocks/group.liquid`)
*Flexbox container for nesting other blocks.*
- **Settings**:
  - `direction`: Select (`row`, `col`, default: `col`)
  - `text_align`: Select (`left`, `center`, `right`)
  - `content_align`: Select (`left`, `center`, `right`, `between`, `stretch`, default: `start`)
  - `vertical_align`: Select (`top`, `middle`, `bottom`, `between`, `stretch`, default: `start`)
  - `wrap_content`: Checkbox
  - `width`: Select (`fit`, `full`)
  - `height`: Select (`auto`, `full`, `screen`)
  - `gap` / `gap_custom`: Range for spacing
  - `padding_vertical`: Select (`none`...`custom`)
  - `padding_horizontal`: Select (`none`...`custom`)
  - `inherit_styles`: Checkbox
  - `position`: Select (`relative`, `absolute`)
  - `inset`: Select (e.g., `top-left`, `bottom-right`)
  - `color_scheme`: Color Scheme
- **Contains**: `@theme` (Any block)

#### **Heading** (`blocks/heading.liquid`)
- **Settings**:
  - `text`: Text
  - `tag`: Select (`h2`, `h3`, `h4`)
  - `display_size`: Select (`h2`, `h3`, `body`)
  - `text_align`: Select (`inherit`, `left`, `center`, `right`)
  - `font_weight`: Select (`normal`, `medium`, `bold`)
  - `uppercase` / `italic`: Checkbox

#### **Jumbo Text** (`blocks/jumbo-text.liquid`)
*Massive typographic element.*
- **Settings**:
  - `text`: Textarea
  - `display_size`: Select (`display`, `h1`)
  - `custom_color`: Color

#### **Media** (`blocks/media.liquid`)
- **Settings**:
  - `image` / `image_mobile`: Image Picker
  - `video_url`: Text
  - `aspect_ratio`: Select (`auto`, `square`, `video`, `portrait`, `landscape`)
  - `object_fit`: Select (`cover`, `contain`)
  - `border_radius`: Range (`0`-`100`px)

#### **Text** (`blocks/text.liquid`)
- **Settings**:
  - `content`: Textarea
  - `display_size`: Select (`body`, `caption`)
  - `text_align`: Select (`inherit`, `left`, `center`, `right`)

### B. Scoped / Structural Blocks

#### **_Announcement** (`blocks/_announcement.liquid`)
- **Context**: `announcement-bar`
- **Settings**: `text`, `link`, `color_scheme`.

#### **_Column** (`blocks/_column.liquid`)
- **Context**: `grid`
- **Settings**: `width` (`auto`, `full`, `half`, `third`, `two_thirds`, `quarter`).
- **Contains**: `@theme`.

#### **_Header-*** Blocks
- **Context**: `header` (All are `static: true`)
- **`_header-logo`**: `logo` (Image), `width` (Range).
- **`_header-menu`**: `menu` (LinkList), `show_promo`, `promo_image`, `promo_heading`.
- **`_header-actions`**: `show_search`, `show_cart`, `btn_label`, `btn_link`.

#### **_Marquee** (`blocks/_marquee.liquid`)
- **Context**: `hero` (Unique block version of the marquee section)
- **Settings**: `pin_bottom` (Bool), `text_list`, `speed`, `direction`.

#### **_Slide** (`blocks/_slide.liquid`)
- **Context**: `slideshow`
- **Settings**: `image`, `video_url`, `overlay_color`, `content_align`.
- **Contains**: `@theme`.

---

## 5. Snippets Reference
Atomic rendering units. Arguments are passed as variables.

| Snippet | Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **button** | `label` | String | - | Button text |
| | `url` | URL | - | HREF |
| | `style` | String | `primary` | `primary`, `outline`, `link` |
| | `width` | String | `auto` | `auto`, `full` |
| | `class_props` | String | - | Additional classes |
| **header-drawer** | `menu` | LinkList | - | Navigation to render |
| **icon** | `name` | String | - | Icon name (see list below) |
| | `class` | String | `w-6 h-6` | Tailwind classes |
| | **Available Icons**: | | | `chevron-left/right/up/down`, `arrow-left...`, `star`, `bag`, `search`, `user`, `menu`, `close`, `instagram`, `facebook`, `tiktok`, `twitter`, `yelp`, `linkedin`, `youtube`, `credit-card`, `vegan`, `vegan request`, `vegetarian`, `gluten-free`, `gluten-free request`, `dairy-free`, `nut-free`, `spicy` |
| **media** | `src` | Image | - | Image object or URL |
| | `src_mobile` | Image | - | Mobile Specific Image |
| | `video` | URL | - | MP4 URL |
| | `fit` | String | `cover` | `cover`, `contain` |
| | `animate` | Bool | `false` | Enable Ken Burns |
| | `animate_hover` | Bool | `false` | Zoom on Hover |
| | `loading` | String | `lazy` | `eager` or `lazy` |
| | `controls` | Bool | `false` | Show video controls |
| | `autoplay` | Bool | `false` | Autoplay video |
| **spacer** | `height` | Number | `20` | Desktop Height (px) |
| | `mobile_height` | Number | - | Mobile Height (px) |
| **social-links** | `class` | String | - | Container classes |
| **typography** | `text` | String | - | Content |
| | `tag` | String | `p` | HTML Tag (`h1`, `p`, `span`) |
| | `display_size` | String | `body` | `display`, `h1`... `caption` |
| | `family` | String | - | `heading`, `body` |
| | `weight` | String | - | Font weight suffix (`bold`, `medium`) |
| | `color` | String | `text-body` | Text color class |
