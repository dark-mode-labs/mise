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

All sections support `blocks` and `presets`. See specific block allowances below.

| Section | Setting | Type | Options / Range | Default | Condition |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Announcement Bar** | `width_scheme` | `select` | `full` | `full` | |
| | `autoplay` | `checkbox` | - | `true` | |
| | `autoplay_speed` | `range` | `3`-`10` | `5` | |
| | `show_arrows` | `checkbox` | - | `true` | |
| | `show_close` | `checkbox` | - | `false` | |
| | `color_scheme` | `color_scheme` | - | `default` | |
| **Background** | `image` | `image_picker` | - | - | |
| | `bg_color` | `color` | - | `#ffffff` | |
| | `overlay` | `range` | `0`-`90` | `0` | |
| **Divider** | `width_scheme` | `select` | `full` | `full` | |
| | `show_line` | `checkbox` | - | `true` | |
| | `show_icon` | `checkbox` | - | `true` | |
| | `icon_select` | `select` | `star`, `chevron-down`, `menu` | `star` | |
| | `height` | `range` | `0`-`600` (px) | `32` | |
| | `color_scheme` | `color_scheme` | - | `default` | |
| **Footer** | `width_scheme` | `select` | `standard` | `standard` | |
| | `padding_vertical` | `select` | `none`, `xs`...`xl`, `custom` | `sm` | |
| | `padding_vertical_custom` | `range` | `0`-`200` (px) | `80` | `padding_vertical == custom` |
| | `padding_horizontal` | `select` | `none`, `xs`...`xl`, `custom` | `xs` | |
| | `padding_horizontal_custom` | `range` | `0`-`200` (px) | `0` | `padding_horizontal == custom` |
| | `show_policy` | `checkbox` | - | `true` | |
| | `show_payment` | `checkbox` | - | `true` | |
| | `color_scheme` | `color_scheme` | - | `default` | |
| **Grid** | `enable_gradient` | `checkbox` | - | `false` | |
| | `overlay_color` | `color` | - | - | |
| | `overlay_opacity` | `range` | `0`-`100` | `40` | |
| | `bg_image` | `image_picker` | - | - | |
| | `justify_content` | `select` | `start`, `center`, `end`, `between` | `center` | |
| | `width_scheme` | `select` | `standard` | `standard` | |
| | `columns_desktop` | `range` | `2`-`4` | `3` | |
| | `columns_mobile` | `range` | `1`-`2` | `1` | |
| | `height` | `select` | `auto`, `sm`...`xl`, `custom` | `auto` | |
| | `height_custom` | `range` | `200`-`1000` (px) | `400` | `height == custom` |
| | `enable_cards_global` | `checkbox` | - | `false` | |
| | `card_padding` | `select` | `none`, `xs`...`lg`, `custom` | `none` | |
| | `card_padding_custom` | `range` | `0`-`100` | `24` | `card_padding == custom` |
| | `card_shadow_global` | `checkbox` | - | `false` | `enable_cards_global == true` |
| | `padding_vertical`... | (See Footer) | | | |
| **Header** | `width_scheme` | `select` | `standard` | `standard` | |
| | `desktop_layout` | `select` | `logo_center`, `logo_left` | `logo_center` | |
| | `nav_alignment` | `select` | `left`, `center`, `right` | `left` | `desktop_layout == logo_left` |
| | `padding_vertical`... | (See Footer) | | | |
| | `sticky_behavior` | `select` | `none`, `always`, `on_scroll_up` | `always` | |
| | `enable_transparent` | `checkbox` | - | `true` | |
| | `color_scheme` | `color_scheme` | - | `default` | |
| **Hero** | `width_scheme` | `select` | `standard` | `standard` | |
| | `layout_mode` | `select` | `overlay`, `split_left`, `split_right` | `overlay` | |
| | `height` | `select` | `auto`, `sm`...`xl`, `custom` | `auto` | |
| | `bg_image` / `_2` | `image_picker` | - | - | |
| | `mobile_image` / `_2` | `image_picker` | - | - | |
| | `video_url` / `_2` | `text` | MP4 URL | - | |
| | `show_placeholder` | `checkbox` | - | `true` | No images |
| | `enable_gradient` | `checkbox` | - | `false` | `layout_mode == overlay` |
| | `overlay_color` | `color` | - | - | `layout_mode == overlay` |
| | `overlay_opacity` | `range` | `0`-`100` | `40` | `layout_mode == overlay` |
| | `content_align` | `select` | `left`, `center`, `right` | `center` | |
| | `text_align` | `select` | `left`, `center`, `right` | `center` | |
| | `vertical_align` | `select` | `top`, `middle`, `bottom` | `middle` | |
| | `enable_animation` | `checkbox` | - | `true` | |
| | `enable_zoom` | `checkbox` | - | `false` | |
| **Marquee** | `width_scheme` | `select` | `full` | `full` | |
| | `text_list` | `text` | CSV string | - | |
| | `text_size` | `select` | `small`, `medium`, `large`, `xl`, `display` | `small` | |
| | `uppercase` | `checkbox` | - | `true` | |
| | `speed` | `range` | `5`-`60` | `20` | |
| | `direction` | `select` | `left`, `right` | `left` | |
| | `color_scheme` | `color_scheme` | - | `default` | |
| | `padding_vertical`... | (See Footer) | | | |
| **Media w Content** | `width_scheme` | `select` | `standard` | `standard` | |
| | `height` | `select` | `auto`...`custom` | `auto` | |
| | `desktop_layout` | `select` | `image_left`, `image_right` | `image_left` | |
| | `mobile_layout` | `select` | `image_first`, `text_first` | `image_first` | |
| | `content_align`... | (See Hero) | | | |
| | `show_shadow` | `checkbox` | - | `true` | |
| | `padding_vertical`... | (See Footer) | | | |
| | `image` etc. | (See Hero) | | | |
| **Menu List** | `menu` | `collection` | - | - | |
| | `display_scope` | `select` | `full_menu`, `category` | `full_menu` | |
| | `category` | `collection` | - | - | `display_scope == category` |
| | `enable_filtering` | `checkbox` | - | `true` | |
| | `show_nav` | `checkbox` | - | `true` | `display_scope == full` |
| | `nav_layout` | `select` | `vertical`, `horizontal` | `vertical` | `show_nav == true` |
| | `nav_sticky_offset` | `range` | `0`-`160` (px) | `80` | `nav == horizontal` |
| | `layout_style` | `select` | `list`, `card-standard`, `card-compact` | `list` | |
| | `aspect_ratio` | `select` | `square`, `landscape`, `portrait` | `landscape` | `layout != list` |
| | `column_preset` | `select` | `1:1:1`, `1:2:2`, `1:2:3` | `1:2:3` | |
| | `grid_gap` | `select` | `tight`, `normal`, `relaxed`, `loose` | `normal` | |
| **Slideshow** | `width_scheme` | `select` | `standard` | `standard` | |
| | `height` | `select` | `sm`...`xl`, `custom` | `sm` | |
| | `slide_gap` | `range` | `0`-`40` (px) | `0` | |
| | `slide_width` | `range` | `80`-`100` (%) | `100` | |
| | `show_arrows` | `checkbox` | - | `true` | |
| | `show_dots` | `checkbox` | - | `true` | |
| | `autoplay` | `checkbox` | - | `false` | |
| | `infinite_scroll` | `checkbox` | - | `true` | |

---

## 4. Blocks Reference (ICD)

### Generic Blocks (Available in `@theme` slots)

#### **Badge Pill** (`blocks/badge.liquid`)
| Setting | Type | Options / Range | Default | Condition |
| :--- | :--- | :--- | :--- | :--- |
| `text` | `text` | - | `100% Grass-Fed...` | |
| `bg_color` | `color` | - | `#06d6a0` | |
| `text_color` | `color` | - | `#ffffff` | |

#### **Button** (`blocks/button.liquid`)
| Setting | Type | Options / Range | Default | Condition |
| :--- | :--- | :--- | :--- | :--- |
| `label` | `text` | - | `Book Now` | |
| `link` | `url` | - | - | |
| `style` | `select` | `primary`, `outline`, `link` | `primary` | |
| `width` | `select` | `auto`, `full` | `auto` | |
| `inherit_style` | `checkbox` | - | `true` | |
| `custom_bg` | `color` | - | `#000000` | `inherit_style != true` |
| `custom_text` | `color` | - | `#ffffff` | `inherit_style != true` |
| `border_radius_custom` | `range` | `0` - `80` px | `4` | `inherit_style != true` |

#### **Group** (`blocks/group.liquid`)
| Setting | Type | Options / Range | Default | Condition |
| :--- | :--- | :--- | :--- | :--- |
| `direction` | `select` | `column`, `row` | `column` | |
| `content_align` | `select` | `left`, `center`, `right`, `between`, `stretch` | `left` | |
| `vertical_align` | `select` | `top`, `middle`, `bottom`, `between`, `stretch` | `top` | |
| `text_align` | `select` | `left`, `center`, `right` | `left` | |
| `wrap_content` | `checkbox` | - | `false` | |
| `width` | `select` | `full`, `fit` | `full` | |
| `height` | `select` | `auto`, `full` | `auto` | |
| `position` | `select` | `relative`, `absolute` | `relative` | |
| `inset` | `select` | `top-left`, `top-right`, `bottom-left`, `bottom-right`, `cover` | `top-left` | `position == 'absolute'` |
| `padding_vertical` | `select` | `none`, `xs`, `sm`, `md`, `lg`, `xl`, `custom` | `md` | |
| `padding_vertical_custom` | `range` | `0` - `128` px | `0` | `padding_vertical == 'custom'` |
| `padding_horizontal` | `select` | `none`, `xs`, `sm`, `md`, `lg`, `xl`, `custom` | `md` | |
| `padding_horizontal_custom` | `range` | `0` - `128` px | `0` | `padding_horizontal == 'custom'` |
| `gap` | `select` | `none`, `xs`, `sm`, `md`, `lg`, `xl`, `custom` | `md` | |
| `gap_custom` | `range` | `0` - `100` px | `16` | `gap == 'custom'` |
| `inherit_styles` | `checkbox` | - | `true` | |
| `color_scheme` | `color_scheme` | - | `default` | `inherit_styles == false` |
| `bg_color` | `color` | - | - | `inherit_styles == false` |
| `shadow` | `checkbox` | - | `false` | |
| `enable_glass` | `checkbox` | - | `false` | |
| `overflow_hidden` | `checkbox` | - | `false` | |
| `border_radius` | `range` | `0` - `60` px | `settings.corner_radius` | `inherit_styles == false` |
| `opacity` | `range` | `0` - `100` % | `100` | |

#### **Logo Icon** (`blocks/logo.liquid`)
| Setting | Type | Options / Range | Default | Condition |
| :--- | :--- | :--- | :--- | :--- |
| `image` | `image_picker` | - | - | |
| `width` | `range` | `50` - `300` px | `150` | |

#### **Media (Image/Video)** (`blocks/media.liquid`)
| Setting | Type | Options / Range | Default | Condition |
| :--- | :--- | :--- | :--- | :--- |
| `image` | `image_picker` | - | - | |
| `image_mobile` | `image_picker` | - | - | |
| `video_url` | `text` | MP4 URL | - | |
| `show_controls` | `checkbox` | - | `false` | |
| `autoplay` | `checkbox` | - | `false` | |
| `height` | `select` | `auto`, `sm`, `md`, `lg`, `xl`, `custom` | `auto` | |
| `aspect_ratio` | `select` | `auto`, `square`, `video`, `portrait`, `landscape` | `auto` | |
| `object_fit` | `select` | `cover`, `contain` | `cover` | |
| `enable_hover` | `checkbox` | - | `false` | |
| `inherit_styles` | `checkbox` | - | `true` | |
| `color_scheme` | `color_scheme` | - | `default` | `inherit_styles != true` |
| `border_radius` | `range` | `0` - `100` px | `settings.corner_radius` | `inherit_styles != true` |
| `show_shadow` | `checkbox` | - | `false` | `inherit_styles != true` |

#### **Scroll Indicator** (`blocks/scroll-indicator.liquid`)
| Setting | Type | Options / Range | Default | Condition |
| :--- | :--- | :--- | :--- | :--- |
| `bottom_offset` | `range` | `0` - `120` px | `32` | |
| `label` | `text` | - | `Scroll` | |
| `inherit_color` | `checkbox` | - | `true` | |
| `custom_color` | `color` | - | `#ffffff` | `inherit_color != true` |

#### **Spacer** (`blocks/spacer.liquid`)
| Setting | Type | Options / Range | Default | Condition |
| :--- | :--- | :--- | :--- | :--- |
| `height` | `range` | `10` - `150` px | `40` | |
| `hide_mobile` | `checkbox` | - | `false` | |

#### **Text** (`blocks/text.liquid`)
| Setting | Type | Options / Range | Default | Condition |
| :--- | :--- | :--- | :--- | :--- |
| `content` | `textarea` | - | `Locally sourced ingredients.` | |
| `tag` | `select` | `h1`...`h6`, `p`, `div`, `span` | `div` | |
| `display_size` | `select` | `display`, `h1`-`h6`, `body`, `caption` | `body` | |
| `text_align` | `select` | `inherit`, `left`, `center`, `right` | `inherit` | |
| `font_weight` | `select` | `normal`, `medium`, `bold` | `normal` | |
| `italic` | `checkbox` | - | `false` | |
| `text_transform` | `select` | `none`, `uppercase`, `capitalize`, `lowercase` | `none` | |
| `text_wrap` | `select` | `wrap`, `nowrap`, `balance` | `wrap` | |
| `overflow_behavior` | `select` | `visible`, `hidden`, `ellipsis` | `visible` | |
| `inherit_color_scheme` | `checkbox` | - | `true` | |
| `custom_color` | `color` | - | `#ffffff` | `inherit_color_scheme != true` |

### Scoped / Structural Blocks

#### **Message** (`blocks/_announcement.liquid`)
*Scope: Announcement Bar*
| Setting | Type | Options / Range | Default | Condition |
| :--- | :--- | :--- | :--- | :--- |
| `text` | `text` | - | `Welcome...` | |
| `link` | `url` | - | - | |
| `inherit_color_scheme` | `checkbox` | - | `true` | |
| `color_scheme` | `color_scheme` | - | `default` | `inherit_color_scheme != true` |

#### **Column** (`blocks/_column.liquid`)
*Scope: Grid Section*
| Setting | Type | Options / Range | Default | Condition |
| :--- | :--- | :--- | :--- | :--- |
| `width` | `select` | `auto`, `full`, `half`, `third`, `two_thirds`, `quarter` | `auto` | |

#### **Footer Brand & Socials** (`blocks/_footer-brand.liquid`)
*Scope: Footer*
| Setting | Type | Options / Range | Default | Condition |
| :--- | :--- | :--- | :--- | :--- |
| `logo` | `image_picker` | - | - | `shop.logo_src == blank` |
| `text` | `textarea` | - | `Fine dining...` | |
| `show_socials` | `checkbox` | - | `true` | |

#### **Footer Nav Group** (`blocks/_footer-nav.liquid`)
*Scope: Footer*
| Setting | Type | Options / Range | Default | Condition |
| :--- | :--- | :--- | :--- | :--- |
| `heading` | `text` | - | `Quick Links` | |
| `menu` | `link_list` | - | `footer` | |

#### **Footer Newsletter** (`blocks/_footer-newsletter.liquid`)
*Scope: Footer*
| Setting | Type | Options / Range | Default | Condition |
| :--- | :--- | :--- | :--- | :--- |
| `heading` | `text` | - | `Join the Club` | |
| `text` | `text` | - | `Exclusive events...` | |
| `email_placeholder` | `text` | - | `Email Address` | |

#### **Header Actions** (`blocks/_header-actions.liquid`)
*Scope: Header*
| Setting | Type | Options / Range | Default | Condition |
| :--- | :--- | :--- | :--- | :--- |
| `show_search` | `checkbox` | - | `true` | |
| `show_cart` | `checkbox` | - | `true` | |
| `btn_label` | `text` | - | `Book Table` | |
| `btn_link` | `url` | - | - | |

#### **Header Logo** (`blocks/_header-logo.liquid`)
*Scope: Header*
| Setting | Type | Options / Range | Default | Condition |
| :--- | :--- | :--- | :--- | :--- |
| `logo` | `image_picker` | - | - | `shop.logo_src == blank` |
| `width` | `range` | `50` - `400` px | `120` | |

#### **Header Nav** (`blocks/_header-menu.liquid`)
*Scope: Header*
| Setting | Type | Options / Range | Default | Condition |
| :--- | :--- | :--- | :--- | :--- |
| `menu` | `link_list` | - | `main-menu` | |
| `show_promo` | `checkbox` | - | `false` | |
| `promo_image` | `image_picker` | - | - | `show_promo == true` |
| `promo_heading` | `text` | - | `Featured` | `show_promo == true` |
| `promo_text` | `text` | - | `Check out our...` | `show_promo == true` |

#### **Scrolling Marquee** (`blocks/_marquee.liquid`)
*Scope: Marquee Section*
| Setting | Type | Options / Range | Default | Condition |
| :--- | :--- | :--- | :--- | :--- |
| `pin_bottom` | `checkbox` | - | `false` | |
| `opacity` | `range` | `0` - `100` | `95` | |
| `text_list` | `text` | - | `Fresh Pasta...` | |
| `direction` | `select` | `left`, `right` | `left` | |
| `text_size` | `select` | `small`, `medium`, `large`, `xl`, `display` | `small` | |
| `uppercase` | `checkbox` | - | `true` | |
| `speed` | `range` | `5` - `30` | `15` | |
| `inherit_scheme` | `checkbox` | - | `true` | |
| `color_scheme` | `color_scheme` | - | `default` | `inherit_scheme != true` |

#### **Slide** (`blocks/_slide.liquid`)
*Scope: Slideshow Section*
| Setting | Type | Options / Range | Default | Condition |
| :--- | :--- | :--- | :--- | :--- |
| `image` | `image_picker` | - | - | |
| `image_mobile` | `image_picker` | - | - | |
| `video_url` | `text` | MP4 | - | |
| `show_placeholder` | `checkbox` | - | `true` | |
| `enable_zoom` | `checkbox` | - | `false` | |
| `enable_gradient` | `checkbox` | - | `true` | |
| `overlay_color` | `color` | - | `#000000` | |
| `overlay_opacity` | `range` | `0` - `100` | `40` | |
| `content_align` | `select` | `left`, `center`, `right` | `center` | |
| `text_align` | `select` | `left`, `center`, `right` | `center` | |
| `vertical_align` | `select` | `top`, `middle`, `bottom` | `middle` | |
| `inherit_color_scheme` | `checkbox` | - | `true` | |
| `color_scheme` | `color_scheme` | - | `default` | `inherit_color_scheme != true` |

---

## 5. Snippets Reference
Atomic rendering units.

| Snippet | Args | Description |
| :--- | :--- | :--- |
| **button** | `label`, `url`, `style`, `width`, `class_props` | Standard button |
| **header-drawer** | `menu` | Mobile side-menu |
| **icon** | `name`, `class` | Icons: `chevron-*`, `star`, `bag`, `search`, `menu`, `close`, social brands, dietary tags. |
| **marquee** | `items`, `speed`, `direction`, `size_class`, `uppercase` | Scrolling text |
| **media** | `src`, `src_mobile`, `video`, `fit`, `ratio`, `load`, `placeholder`, `animate`, `animate_hover`, `controls`, `autoplay` | Unified Media renderer |
| **menu-*** | `category`, `all_categories`, `depth`, `nav_layout`... | Recursive menu components |
| **spacer** | `height` | Vertical space |
| **social-links** | - | Renders icons from settings |
| **typography** | `text`, `tag`, `display_size`, `family`, `weight`, `color`, `class` | Text renderer |
