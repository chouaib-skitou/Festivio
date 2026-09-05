# Security model

## Sessions

Festivio uses a split-token browser session. Access tokens are short-lived and held in frontend memory only. Refresh tokens are signed separately, stored in an `HttpOnly` cookie, rotated on refresh and cleared on logout/password reset.

## Public registration

Only `ROLE_PARTICIPANT` and `ROLE_ORGANIZER` can be requested publicly. `ROLE_ADMIN` and `ROLE_ORGANIZER_ADMIN` must be assigned by trusted administration paths or local demo seeding.

## Authorization

Backend authorization is authoritative. UI visibility is convenience only.

- Admin: platform-wide event/task management.
- Organizer admin: manages events it owns and tasks under those events.
- Organizer: reads assigned tasks and may change only their status.
- Participant: reads events and manages only its own participation.

## Password recovery

Reset requests return a generic response to avoid account enumeration. The emailed token is generated with cryptographic randomness; only its SHA-256 hash is stored. Reset records expire automatically and are single-use.

## HTTP and input controls

Festivio applies explicit CORS origins, credentials-aware CORS, request IDs, common security response headers, API/auth rate limits, JSON body limits and image upload type/size constraints.

## Secrets

Never commit `.env` files, production database exports, tokens or credentials. CI rejects tracked runtime `.env` files and the removed legacy database fixtures.
