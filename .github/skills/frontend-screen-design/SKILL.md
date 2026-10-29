---
name: frontend-screen-design
description: Create new React/Vite screens that match the repository's visual language, responsive behavior, component patterns, personas, and CSS Module conventions.
---

# Frontend screen design

Use this skill whenever adding or substantially changing a page, feature screen,
administrative view, form, catalog, detail view, or reusable visual component.
The goal is to extend the existing Nail Design interface without introducing a
second visual system.

## Required workflow

1. Identify the persona and route before writing UI:
   - Public/client routes do not use `/admin`.
   - Administrative routes always use `/admin`.
   - Add or update the mapping in `src/app/routes.jsx`.
   - Update Navbar, MobileSidebar, buttons, back links, and redirects that point
     to the route.
2. Inspect the closest existing page and shared components before creating new
   markup. Prefer composition over a new one-off pattern.
3. Create the page component under `src/pages/` and its CSS Module beside it.
   Place reusable interactions under `src/features/`, reusable domain data under
   `src/entities/`, and reusable visual primitives under `src/shared/ui/`.
4. Keep loading, error, empty, success, and disabled states explicit for screens
   that communicate with the API.
5. Add or update a colocated Vitest test for route/persona behavior or API
   behavior when the screen introduces either.
6. Validate with `npm test`, `npm run lint`, and `npm run build`.

## Visual language

### Typography

- Use `"Prata", serif` for `h1`-`h6` and display headings.
- Use `"Roboto", sans-serif` for body text, labels, controls, navigation, and
  buttons.
- Headings normally use `font-weight: 400`, tight letter spacing, and a line
  height around `1.2` to `1.3`.
- Eyebrows are uppercase, small, medium/bold, and letter-spaced:
  approximately `9px` to `10px` with `0.16em` to `0.2em`.
- Secondary copy uses `var(--color-text-secondary)` and line height around
  `1.6` to `1.7`.

### Theme tokens

Use the existing CSS variables instead of hardcoded colors:

- `--color-background-primary`: page/header background.
- `--color-surface`: cards, panels, selected areas, and empty states.
- `--color-text-primary`: main text.
- `--color-text-secondary`: supporting text.
- `--color-action-primary`: primary actions, active links, accents.
- `--color-action-primary-hover`: hover state for primary actions.
- `--color-text-on-action`: text placed over primary actions.
- `--color-accent`: focus rings and decorative emphasis.
- `--color-border`: soft borders and separators.
- `--color-control-border`: input and control borders.

The global stylesheet defines light and dark values through
`[data-theme="dark"]`. New components must remain readable in both themes and
must not rely on a fixed light-only color.

### Layout and spacing

- Use a centered fluid container with `width: min(...)` rather than fixed page
  widths. Existing page containers commonly use `1200px`, `1160px`, `1120px`,
  `1080px`, `960px`, or `680px` depending on content density.
- Mobile pages commonly use horizontal gutters of `22px` or `32px` to `44px`.
- Desktop pages commonly use `36px` or `64px` gutters.
- Use CSS Grid for page composition, card collections, forms, and two-column
  desktop layouts. Use Flexbox for inline alignment and action rows.
- Prefer `gap` for spacing instead of child-specific margins.
- Use `min-height: 65vh` for compact form/panel pages when the page should fill
  the viewport below the global chrome.
- Use `var(--color-border)` separators instead of decorative heavy borders.

### Responsive behavior

Follow the established breakpoints:

- Base styles target small screens first.
- `@media (max-width: 360px)` handles narrow phones.
- `@media (max-width: 767px)` handles mobile navigation and stacked layouts.
- `@media (min-width: 768px)` expands containers, spacing, grids, and typography.
- `@media (min-width: 1024px)` may increase catalog columns to four.

Typical catalog behavior is two columns on mobile, three columns from `768px`,
and four columns from `1024px`. Forms generally remain centered at `680px`.
Desktop detail and booking screens use balanced grid columns; mobile stacks them.

## Component conventions

Use existing components before adding alternatives:

- `ButtonAction` for primary actions. It supports `href`, `type`, `disabled`,
  icons, and `iconPosition="left"`.
- `ButtonBack` for secondary back navigation.
- `Input` for labeled inputs and adornments.
- `ServiceCard` for service/catalog cards. Supply real `name`, `description`,
  image, and route values.
- `Navbar`, `MobileSidebar`, and `Footer` are rendered by `App.jsx`; pages
  should not render duplicate global chrome.

Shared controls use visible `:focus-visible` outlines based on
`--color-action-primary` or `--color-accent`. Preserve keyboard focus behavior
when creating new controls. Icon-only controls need an accessible label, while
decorative icons use `aria-hidden="true"`.

## Page patterns

### Catalog pages

Use an intro block with a small eyebrow, Prata title, supporting description,
`ServiceCatalogFilter`, and a responsive `ProductModal` grid. Public cards link
to `/servicos/:id`; administrative cards link to `/admin/servicos/:id`.

### Forms

Use a centered content column, `ButtonBack` first, a Prata page title, and a
vertical grid of `Input`/textarea fields. Primary submit actions span the form
width when appropriate. Show feedback with `role="alert"` and loading progress
with `role="status"`. File uploads should provide a preview, validate MIME type
and size, and keep the input keyboard-accessible.

### Empty and status states

Use a surface panel, dashed border where appropriate, muted secondary text, and
an explicit action when recovery or navigation is available. Do not silently
replace API failures with successful-looking empty data.

### Administrative persona

Administrative screens use the `/admin` route family and the admin Navbar/
MobileSidebar links. Preserve admin-specific wording and actions. For example,
an admin service detail screen edits a service; it must not expose the client
booking action.

## API and data boundaries

Pages and features must call domain services from
`src/shared/api/services/`, not Axios directly. Use the generic client in
`src/shared/api/apiClient.js` and keep paths in `src/shared/api/endpoints.js`.
Configure paths through the variables in `.env.example`.

For service screens, preserve:

- `POST /services` with multipart field `service` (JSON) and optional `foto`.
- `GET` and `PUT /services/{id}`.
- `DELETE /services/{id}/deactivate` for deactivation.
- `GET /services` (catálogo público) and `GET /services/admin` (gestão).

For dashboard screens:

- Use `GET /dashboard/summary` with required query params `startDate` and
  `endDate`.

Normalize API errors through the shared client and surface the resulting
message in the page state.

## Verification checklist

- Route is registered in `src/app/routes.jsx`.
- Persona-specific links use the correct `/admin` prefix.
- Navbar, sidebar, logo, back links, and redirects preserve the persona.
- Page uses CSS Modules and existing theme tokens.
- Layout works at 360px, 767px, 768px, and 1024px boundaries.
- Keyboard focus and accessible labels are present.
- Loading, error, empty, and success states are explicit.
- Relevant Vitest tests are updated.
- `npm test`, `npm run lint`, and `npm run build` pass.
