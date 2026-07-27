# HomePal Design System Report

This report documents the Design Foundation for the **HomePal** design system, extracted from the "Design System" page of the Figma file.

---

## 1. Brand Colors

The HomePal brand color palette is designed to feel warm, calm, and organized, tailored for household and kitchen management.

| Token Name            | HEX       | RGB                  | Usage                                                                                        |
| :-------------------- | :-------- | :------------------- | :------------------------------------------------------------------------------------------- |
| **Primary**           | `#356859` | `rgb(53, 104, 89)`   | Main brand color for primary actions, active navigation states, and key highlights.          |
| **Primary Pressed**   | `#2A5347` | `rgb(42, 83, 71)`    | Active/pressed state interaction color for primary elements.                                 |
| **Primary Container** | `#DCEEE8` | `rgb(220, 238, 232)` | Background color for highlighted blocks, cards, or positive badges.                          |
| **Accent**            | `#D99A3D` | `rgb(217, 154, 61)`  | Secondary brand color for highlighting specific accent details (e.g. ratings, status icons). |
| **Accent Container**  | `#F7E7CA` | `rgb(247, 231, 202)` | Background color for warning states or accent containers.                                    |
| **Secondary**         | _N/A_     | _N/A_                | _The system utilizes the Accent palette in place of a dedicated secondary color._            |
| **Success**           | `#43A66F` | `rgb(67, 166, 111)`  | Success notifications, valid inputs, or positive progress tracking.                          |
| **Warning**           | `#E6A33A` | `rgb(230, 163, 58)`  | Warnings, pending statuses, or medium-priority alerts.                                       |
| **Error**             | `#D9534F` | `rgb(217, 83, 79)`   | Error states, alerts, destructive buttons, or over-budget states.                            |
| **Info**              | `#4F8EF7` | `rgb(79, 142, 247)`  | General information blocks, guides, and tips.                                                |

---

## 2. Surface Colors

These colors define the container backgrounds, dividers, and card backdrops that structure the layout hierarchy.

| Token Name          | HEX       | RGB                  | Usage                                                                     |
| :------------------ | :-------- | :------------------- | :------------------------------------------------------------------------ |
| **Background**      | `#FAF8F3` | `rgb(250, 248, 243)` | The primary application background color (warm, soft off-white).          |
| **Surface**         | `#FFFFFF` | `rgb(255, 255, 255)` | Main card backgrounds, modal containers, and text fields.                 |
| **Surface Variant** | `#F4F2EE` | `rgb(244, 242, 238)` | Secondary card backgrounds or nested neutral container shading.           |
| **Border**          | `#E4E0DA` | `rgb(228, 224, 218)` | Outlines for text fields, outline buttons, and card borders.              |
| **Divider**         | `#E4E0DA` | `rgb(228, 224, 218)` | Separators between sections and list row borders.                         |
| **Overlay**         | _N/A_     | _N/A_                | _Typically uses a semi-transparent dark grey/neutral overlay for modals._ |

---

## 3. Text Colors

Text color tokens enforce correct contrast and readability hierarchy across headers and body copy.

| Token Name         | HEX       | RGB                  | Usage                                                                         |
| :----------------- | :-------- | :------------------- | :---------------------------------------------------------------------------- |
| **Text Primary**   | `#2D2A26` | `rgb(45, 42, 38)`    | High contrast color for headings, titles, and main body text.                 |
| **Text Secondary** | `#6D6862` | `rgb(109, 104, 98)`  | Medium contrast color for subtitles, labels, helper text, and secondary copy. |
| **Text Disabled**  | `#A8A29B` | `rgb(168, 162, 155)` | Low contrast color for disabled states, placeholders, and inactive labels.    |
| **Text Inverse**   | `#FFFFFF` | `rgb(255, 255, 255)` | White text used on dark backgrounds, primary buttons, or headers.             |
| **Text on Accent** | `#2D2A26` | `rgb(45, 42, 38)`    | High contrast dark text used on top of accent-colored containers.             |

---

## 4. Typography

The design system uses a single font family (**Cairo**) with a clean, modern, and highly legible type scale suited for both English and Arabic (RTL) text.

| Type Style Name | Font Family | Size (px) | Weight         | Line Height (px) | Letter Spacing | Text Transform |
| :-------------- | :---------- | :-------- | :------------- | :--------------- | :------------- | :------------- |
| **Display**     | Cairo       | 40px      | Bold (700)     | 48px             | 0px            | None           |
| **H1**          | Cairo       | 32px      | Bold (700)     | 40px             | 0px            | None           |
| **H2**          | Cairo       | 28px      | Bold (700)     | 36px             | 0px            | None           |
| **H3**          | Cairo       | 22px      | SemiBold (600) | 30px             | 0px            | None           |
| **Body Large**  | Cairo       | 18px      | Medium (500)   | 28px             | 0px            | None           |
| **Body**        | Cairo       | 16px      | Regular (400)  | 24px             | 0px            | None           |
| **Body Small**  | Cairo       | 14px      | Regular (400)  | 20px             | 0px            | None           |
| **Caption**     | Cairo       | 12px      | Regular (400)  | 18px             | 0px            | None           |
| **Label**       | Cairo       | 13px      | SemiBold (600) | 18px             | 0px            | None           |

---

## 5. Spacing Scale

The layout and positioning spacing is based on an **8px base unit**, providing consistent pacing, rhythm, and alignment across elements.

| Token        | Size | Visual Value | Usage                                                                 |
| :----------- | :--- | :----------- | :-------------------------------------------------------------------- |
| `spacing/4`  | 4px  | `4`          | Small gaps, tight element grouping, micro-paddings.                   |
| `spacing/8`  | 8px  | `8`          | Small card spacing, inline icon gaps, component-level padding.        |
| `spacing/16` | 16px | `16`         | Standard screen margins, vertical section spacing, container padding. |
| `spacing/24` | 24px | `24`         | Major section gaps, larger container spacing.                         |
| `spacing/32` | 32px | `32`         | Large layout margins and section blocks.                              |
| `spacing/48` | 48px | `48`         | Main structural dividers, massive gaps.                               |
| `spacing/64` | 64px | `64`         | Header heights, major block alignment spacing.                        |

---

## 6. Border Radius

Border radius tokens structure the visual personality, creating a rounded, friendly, and calm layout.

| Token      | Value    | Applied To                                                                      |
| :--------- | :------- | :------------------------------------------------------------------------------ |
| **Small**  | `8px`    | Small components, buttons (small), input fields, tags/chips, checkboxes/radios. |
| **Medium** | `16px`   | Standard cards, quantity steppers, item row containers.                         |
| **Large**  | `24px`   | Large cards, dialogs, bottom sheets, modals.                                    |
| **Full**   | `9999px` | Fully rounded elements: pills, switches, active indicator capsules.             |

---

## 7. Shadows / Elevation

Elevation is used strategically to establish depth and separate interactive overlay components.

| Elevation Level | Token Name                    | Definition (Effect Value)                                                                  | Typical Components                                                |
| :-------------- | :---------------------------- | :----------------------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| **Low**         | `shadow-low` / `tabShadow`    | `DROP_SHADOW (0, 4px, 4px, 0) #00000040` (and variants)                                    | Default resting cards, navigation tabs, and list rows.            |
| **Medium**      | `shadow-medium` / `barShadow` | `DROP_SHADOW (0, 4px, 16px, 0) #0000001A`                                                  | Raised active buttons, floating action buttons, and active chips. |
| **High**        | `shadow-high` / `navShadow`   | `DROP_SHADOW (0, 4px, 6px, -4px) #2D2A2624`, `DROP_SHADOW (0, 10px, 15px, -3px) #2D2A2624` | Modals, bottom sheets, dropdown menus, and main navigation bars.  |

---

## 8. Components

The component library uses the tokens defined in the foundation, featuring responsive mobile layouts and supporting RTL (Arabic) natively.

### Button

- **Variants**: Primary, Secondary, Tertiary, Text, Destructive.
- **Sizes**:
  - _Small_: Height 44px (Targeted at smaller screens or secondary actions).
  - _Medium_: Height 48px (Standard buttons).
  - _Large_: Height 56px (Hero/primary page actions).
- **States**: Default, Hover, Pressed, Disabled, Loading.
- **Radius**: Small (8px) or Full (pill-shaped depending on implementation).
- **Typography**: Cairo SemiBold (e.g. `typography/label` size 13 or button text matching).

### Text Field (Input & Text Area)

- **Variants**: Default, Focus, Error, Disabled. (Optional "AI" variant for Text Area).
- **Structure**: Includes top label, input field container (56px height, 8px radius, border color `#E4E0DA`), optional leading icon, and bottom helper text / error indicator.
- **Typography**: Input text: Cairo Regular 16px (`typography/body`), Label/Helper: Cairo Regular 14px (`typography/bodySmall`).

### Checkbox & Radio

- **States**: Checked, Unchecked, Indeterminate (Checkbox only). Each state has an active and disabled variant.
- **Size**: 20px x 20px.
- **Colors**: Active borders/fills use Brand Primary (`#356859`), disabled uses neutral text disabled (`#A8A29B`).

### Switch

- **States**: On/Off, Active/Disabled.
- **Size**: 44px width x 24px height.
- **Radius**: Full (pill).
- **Colors**: Track uses Primary (`#356859`) when On and Surface Variant (`#F4F2EE`) when Off. Thumb uses Surface (`#FFFFFF`).

### Chip

- **States**: Selected (Yes/No).
- **Colors**: Selected uses Accent Container (`#F7E7CA`) or Primary Container (`#DCEEE8`). Unselected uses Surface Variant (`#F4F2EE`).
- **Radius**: Full / pill-shaped (9999px).

### Bottom Navigation (NavBar)

- **RTL Support**: Native RTL Layout version included.
- **Height**: 74px (or 93px for RTL layout bounds).
- **Active Indicator**: Uses a pill shape (`radius/full`) background on the active tab icon.
- **Typography**: Labels use Cairo 12px Regular (`typography/caption`).

### App Bar (AppBar)

- **Height**: 64px (or 67px RTL variant).
- **Structure**: Back action button (leading), Section title and subtitles (center-left), and up to 2 action buttons (trailing).
- **Typography**: Title uses H2/H3, subtitles use Caption or Body Small.

### Cards (Pantry Item & Meal Cards)

- **Pantry Item Card**: 158px x 144px grid card with top icon badge (e.g., "Fresh", "Expired" labels), title, and subtitle. Uses 16px border-radius.
- **Meal Recommendation Card**: Rest resting card with AI Pick badge, thumbnail header, meal details (time, portions, cost), and primary "View recipe" action button.

### Bottom Sheet & Modals

- **Use Case**: Used for filter menus or contextual selection options that slide up from the bottom (large radius 24px).
- **Snackbar**: Confirmation banner at the bottom of the screen (56px height) with text and primary text button ("Undo").
