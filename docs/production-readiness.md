# Production readiness

This document describes the production hardening applied to Festivio and the runtime expectations that go with it.

## Runtime configuration

Copy `backend/.env.example` to `backend/.env` and replace all placeholder values before starting the backend. Production startup fails fast when the MongoDB URI or JWT secrets are missing, when JWT secrets are too short, or when wildcard CORS is enabled.

The frontend defaults to same-origin API requests in the production container. For local `npm run dev`, copy `frontend/.env.example` to `frontend/.env` so the React development server calls the backend on port 5000.

Never commit `.env` files. Only `.env.example` files belong in Git.

## Health and lifecycle

The backend exposes:

- `GET /health` for liveness.
- `GET /ready` for readiness, including MongoDB connection state.

The Node process connects to MongoDB before listening for traffic and handles `SIGTERM` and `SIGINT` with a bounded graceful shutdown.

## Container model

The backend image runs as the non-root `node` user and includes a health check. Uploaded images are stored in the `backend_uploads` Docker volume.

The frontend is built as static assets and served by unprivileged Nginx on port 8080. Nginx proxies `/api/` and `/images/` to the backend, so the browser can use same-origin requests and the backend does not need a public host port in Compose.

Run the stack with:

```bash
cp backend/.env.example backend/.env
# edit backend/.env with real values
docker compose up --build -d
```

The application is then available on `http://localhost:3000` by default.

## CI gates

Pull requests to `develop` and `master` run three gates:

1. Backend lint, targeted Prettier verification and Jest tests.
2. Frontend Jest tests and production build.
3. Docker Compose validation plus backend and frontend image builds.

Dependabot is configured for backend npm, frontend npm, GitHub Actions and both Dockerfiles.

## Security changes

- CORS is restricted to configured origins instead of accepting every origin in production.
- JWT verification accepts only `HS256` and no longer logs decoded user data.
- Access and refresh tokens are no longer written to browser console logs.
- Request IDs are returned in `X-Request-Id` to correlate errors without logging request bodies.
- Common response hardening headers are applied by Express and Nginx.
- Uploads accept only JPEG, PNG and WebP images and are limited to 5 MiB.
- Swagger is disabled by default in production and can be explicitly enabled with `SWAGGER_ENABLED=true`.

## Remaining follow-up

The repository historically did not commit npm lockfiles. The root `.gitignore` no longer excludes lockfiles; generate and commit `package-lock.json` files for backend and frontend in a dedicated dependency-lock PR, then switch CI and Docker builds from `npm install` to `npm ci` for fully reproducible installs.
