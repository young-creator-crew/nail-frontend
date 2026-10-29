# Copilot instructions

## Project commands

Run commands from the repository root:

```bash
npm run dev
npm run build
npm run lint
npm test
```

Run one test file:

```bash
npx vitest run src/app/App.test.jsx
```

Run one test by name:

```bash
npx vitest run -t "keeps public and admin catalog routes separate"
```

## Architecture

This is a React application built with Vite and organized using Feature-Sliced Design:

- `src/app/` composes the application, global styles, and pathname-based routing.
- `src/pages/` contains route-level screens.
- `src/widgets/` contains shared page-level UI such as the navbar, mobile sidebar, and footer.
- `src/features/` contains reusable interactions such as catalog filtering and appointment booking.
- `src/entities/` contains domain data and models, including service data.
- `src/shared/` contains reusable UI and the Axios API layer.

Routing is intentionally lightweight and manual. `src/app/routes.jsx` maps
`window.location.pathname` to a page component and a persona role; `App.jsx`
uses that result to render the page with the matching navbar. Keep route changes
in `routes.jsx` and update all corresponding links and redirects.

There are two navigation personas:

- Public/client routes omit `/admin`, for example `/`, `/servicos`, `/perfil`,
  and `/agendamento`.
- Administrative routes always use `/admin`, including `/admin`, `/admin/agenda`,
  `/admin/servicos`, `/admin/perfil`, and `/admin/meus-servicos`.

The navbar and mobile sidebar derive their links from the role supplied by the
route resolver. Administrative catalog and profile pages receive `isAdmin`;
preserve that distinction when adding screens or links.

## API conventions

Use the generic client from `src/shared/api/apiClient.js` instead of importing
Axios directly in pages or feature components. It exposes `api.get`, `api.post`,
`api.put`, `api.patch`, and `api.delete`, returns response data, and normalizes
API errors.

Keep endpoint paths in `src/shared/api/endpoints.js`. Paths are configurable
through Vite environment variables documented in `.env.example`, including
`VITE_API_BASE_URL`, timeout, services, users, dashboard, registration,
and login paths. Domain-specific calls belong in
`src/shared/api/services/` (`serviceApi.js`, `authApi.js`, and `profileApi.js`).

Service creation and image updates use `FormData`; preserve the existing field
names and resource paths:

- `POST /services` with multipart field `service` (JSON) and optional `foto`
- `GET`/`PUT /services/{id}`
- `DELETE /services/{id}/deactivate`
- `GET /services/admin`

Dashboard endpoint:

- `GET /dashboard/summary` with required query params `startDate` and `endDate`

## Code conventions

Use JSX with CSS Modules for component styling. Reuse shared UI components
from `src/shared/ui/` rather than duplicating buttons, inputs, or back links.
Keep API loading, error, and empty states explicit in page components.

Route and API behavior is covered by Vitest tests colocated with the relevant
module. API tests mock the generic `api` object; route tests use
`getRoute()` to verify both the selected page and persona role. Update these
tests whenever routes, persona behavior, endpoint paths, or API contracts
change.

Oxlint uses the React and Oxc plugins configured in `.oxlintrc.json`; preserve
the rules for hooks and component exports.

For new screens or substantial visual changes, follow the
`.github/skills/frontend-screen-design/SKILL.md` skill. It captures the
repository's typography, color tokens, responsive breakpoints, persona routing,
shared component usage, and screen verification checklist.
