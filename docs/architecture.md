# Architecture

Festivio is a React + Express + MongoDB application packaged as two production images.

## Request path

In production the browser talks only to the Nginx frontend origin. Nginx serves the React build and proxies `/api` and `/images` to the internal Express service. This keeps browser API requests same-origin and allows the refresh cookie to remain inaccessible to JavaScript.

## Backend lifecycle

`app.js` defines HTTP middleware, routes and health endpoints without starting listeners or establishing the database connection. `server.js` validates configuration, connects MongoDB, starts the HTTP server, configures timeouts and handles graceful shutdown.

## Local topology

`docker-compose.yml` includes frontend, backend, MongoDB and Mailpit. Health checks enforce startup ordering. The demo seed creates only synthetic identities and data.

## Production topology

`docker-compose.prod.yml` includes the deployable frontend/backend application tier. MongoDB and SMTP are treated as external production dependencies so operators can choose managed or independently administered services.
