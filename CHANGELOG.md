# Changelog

All notable changes to Festivio are documented in this file.

This project follows Semantic Versioning. Releases, tags and GitHub Releases are created by semantic-release from the `master` branch.

## [Unreleased]

### Added

- Production-ready Docker environments for the React frontend and Express backend.
- MongoDB and Mailpit services for reproducible local development.
- Health and readiness endpoints, graceful shutdown and request correlation IDs.
- Role-based authorization for admins, organizer admins, organizers and participants.
- CodeQL, Dependabot, container publishing and release automation workflows.
- Synthetic local demo data seeding without tracked production-like fixtures.

### Changed

- Refresh sessions now use an HttpOnly cookie while access tokens remain in browser memory only.
- Frontend navigation, landing page and role-aware workspaces were rebuilt for Festivio.
- Runtime environment files are no longer committed; documented `.env.example` files are used instead.
- Production frontend delivery uses unprivileged Nginx with same-origin API proxying.

### Security

- Public registration can no longer self-assign privileged roles.
- Password reset tokens are random, hashed at rest, expiring and single-use.
- Uploads are limited to JPEG, PNG and WebP images with a 5 MiB cap.
- API and authentication rate limiting is enabled.
- State-changing API calls are protected by a signed double-submit CSRF token in addition to SameSite cookies and explicit CORS origins.
- Legacy user/event/task fixtures containing production-like account data were removed.

## Versioning and releases

The repository is bootstrapped at version `1.0.0`. Once changes reach `master`, semantic-release analyses Conventional Commit history, updates the shared package versions and `CHANGELOG.md`, creates the `vX.Y.Z` tag and publishes the GitHub Release. Publishing the GitHub Release triggers the GHCR image workflow.
