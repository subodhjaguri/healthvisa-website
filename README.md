# HealthiFam admin website (`healthvisa-website`)

Next.js website with two parts:

- **Admin website** (`/admin`): where HealthiFam staff confirm appointments, approve
  memberships, manage doctors, labs and content, and watch for new activity.
- **Public pages:** privacy policy (`/privacy-policy`), terms (`/terms-and-conditions`),
  refund policy (`/refund-policy`), and how to request account deletion
  (`/delete-account`, the page linked from Google Play). `/` shows a static landing page
  from `public/landing/`.

It is hosted on Vercel at **https://healthifam.vercel.app** (admin at `/admin`). The
marketing site at `www.healthifam.in` is separate and not part of this repository.

- **Staff instructions:** [docs/ADMIN-GUIDE.md](docs/ADMIN-GUIDE.md).
- **System documentation** (architecture, data model, feature flows, operations): the
  `healthvisa-api` repository under `docs/`.

## Tech stack

Next.js 12, React 18, TypeScript, Ant Design 4, Tailwind CSS, react-query, Zustand.

## Prerequisites

Node.js 24.x (the version set on Vercel) and npm. The repository has both `package-lock.json`
and `yarn.lock`; use npm.

## Setup and running

```bash
npm install
npm run dev          # http://localhost:3001
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server on port 3001 |
| `npm run build` | Production build (what Vercel runs) |
| `npm start` | Serve the production build on port 3001 |
| `npm run check-types` | TypeScript check |
| `npm run check-lint` / `npm run check-format` | ESLint / Prettier |

## Configuration

The site reads **no environment variables**. Its settings are constants in
`src/utils/common.ts`:

```ts
const API_TARGET = 'aws' as 'local' | 'aws';
```

| Value | API used |
|---|---|
| `'aws'` | The production API |
| `'local'` | A local API at `http://127.0.0.1:3100` |

**`API_TARGET` must be `'aws'` in anything you commit or deploy.** When using a local API,
point it at the test database (see "Test and production databases" in the API's
`docs/OPERATIONS.md`).

## Logins and roles

- Staff sign in at `/admin` with an email and password (`POST /admin/login`). Accounts are
  created by a developer with the API's `scripts/seed-admin.js`. There is no sign-up page.
- **There is one role.** Every admin can see and change everything.
- The session token is kept in the browser's `localStorage` and lasts 12 hours. After that,
  or if the account is removed or switched off, staff are returned to the login page.

## Deployment

The Vercel project is connected to this repository. Every push to `master` is built
(`next build`) and published to production. There is no `vercel.json`; Vercel's Next.js
defaults are used, with Node.js 24.x set in the project settings.

1. Make sure `API_TARGET` is `'aws'`.
2. Run `npm run build` locally to check it builds.
3. Push to `master`, then check the deployment in the Vercel dashboard and open `/admin`.
4. To undo a release, promote an earlier deployment in Vercel or revert the commit.

## Project layout

```
pages/                 routes: /admin/* pages and the public pages
src/modules/admin/     admin page components (lists, forms) by area
src/models/            API calls and react-query hooks by area
src/components/        layout, sidebar (Drawer), header with notification bell, shared UI
src/hooks/             useNotificationWatcher: polls for new bookings and requests
src/utils/             API_TARGET, HTTP client, appointment status rules
public/                static files, landing page, notification sound
```
