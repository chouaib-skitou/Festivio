# [1.3.0](https://github.com/chouaib-skitou/Festivio/compare/v1.2.0...v1.3.0) (2026-09-06)


### Bug Fixes

* **api:** avoid Mongo operators in event listing ([5d08999](https://github.com/chouaib-skitou/Festivio/commit/5d089996716eb60814da8a0d7804e02ccedebb5e))
* **api:** avoid Mongo operators in task listing ([26b4d0a](https://github.com/chouaib-skitou/Festivio/commit/26b4d0a0000eb2325ecb53d4bd07f58f44a621a7))
* **api:** avoid tainted query objects in task controller ([b120ce4](https://github.com/chouaib-skitou/Festivio/commit/b120ce4f0aefad91ffd853acc565fcce7f458d5e))
* **api:** configure trusted proxy depth ([15339c5](https://github.com/chouaib-skitou/Festivio/commit/15339c5001e456735f8d0a8ccea16fcd3a8520f6))
* **api:** expose event format fields ([2b51a9e](https://github.com/chouaib-skitou/Festivio/commit/2b51a9e88f6d334157a7c32f861878decb1d2838))
* **api:** harden search regex escaping ([9a48ea4](https://github.com/chouaib-skitou/Festivio/commit/9a48ea487b48d480db7680929539ff209628378d))
* **api:** keep sanitizeFilter enabled for event listings ([67c1e2d](https://github.com/chouaib-skitou/Festivio/commit/67c1e2d4df9c85b234a6b1efba6d5b12556861e7))
* **api:** keep sanitizeFilter enabled for task listings ([927b1bc](https://github.com/chouaib-skitou/Festivio/commit/927b1bcb81e50c63a04cc9b66aa89b0f2adbd95c))
* **api:** remove unused regex search helper ([e25a506](https://github.com/chouaib-skitou/Festivio/commit/e25a506001937018eb87ea74607f87732ce67a63))
* **api:** trust server-built event filters ([ce44f86](https://github.com/chouaib-skitou/Festivio/commit/ce44f8618d6f181245336ea8b73b311726941edc))
* **api:** trust server-built task filters ([235dce0](https://github.com/chouaib-skitou/Festivio/commit/235dce02bb444c361e3a8878732761dcbd0d02fa))
* **api:** use configured trust proxy setting ([fae7b60](https://github.com/chouaib-skitou/Festivio/commit/fae7b603c35f83aa0b1f60d8af98d1460f399655))
* **docker:** trust local frontend proxy ([ac74af0](https://github.com/chouaib-skitou/Festivio/commit/ac74af00195f140599e59d951169f0c9be0a66fb))
* **seed:** avoid logging demo password ([ed38319](https://github.com/chouaib-skitou/Festivio/commit/ed383191df6a22845d5e6504a54c164f88d561f2))
* **seed:** inline realistic demo dataset ([a39e5ff](https://github.com/chouaib-skitou/Festivio/commit/a39e5ff9cb00cbd6b6790b5594c093ae85ebcf89))
* **seed:** remove $in filters from demo seed ([2b665b1](https://github.com/chouaib-skitou/Festivio/commit/2b665b18e20cc2c2e1b070c9d95166046e1a741a))


### Features

* **api:** add paginated searchable events endpoint ([cc42755](https://github.com/chouaib-skitou/Festivio/commit/cc4275528441851d34a6d123bfb4290f55ec15fc))
* **api:** add paginated searchable tasks endpoint ([5c6f1d5](https://github.com/chouaib-skitou/Festivio/commit/5c6f1d52df87a4a0146478e3c4a1110b08eeb740))
* **api:** add pagination query helpers ([89cc263](https://github.com/chouaib-skitou/Festivio/commit/89cc2639eed652996aa8787075a6ed1b3f5a608e))
* **api:** add route-specific rate limiters ([9ae503e](https://github.com/chouaib-skitou/Festivio/commit/9ae503e0c4d0b5983c7bc8c750d94e66084da0f7))
* **api:** apply event route rate limits ([74d0c94](https://github.com/chouaib-skitou/Festivio/commit/74d0c94780ba9b9d86774d1f33de69df125afcb9))
* **api:** apply task route rate limits ([040701c](https://github.com/chouaib-skitou/Festivio/commit/040701c817ae2c3130ec5f24e9b7ab5fd425cd5f))
* **email:** add branded transactional templates ([bd0ee73](https://github.com/chouaib-skitou/Festivio/commit/bd0ee73043f69904806ea17b8655eba5736860e6))
* **email:** use branded auth email templates ([7d0c672](https://github.com/chouaib-skitou/Festivio/commit/7d0c67280fb3f8c89e216c19b3f3fbda8171d230))
* **frontend:** add server-driven event search and pagination ([c19b48b](https://github.com/chouaib-skitou/Festivio/commit/c19b48b730380d772c5df5c3e39e56241af0425e))
* **frontend:** add server-driven task search and pagination ([9d0da08](https://github.com/chouaib-skitou/Festivio/commit/9d0da087fba8a76dec1c0d843e815b241a824e6d))
* **frontend:** add shared data control styles ([0767aad](https://github.com/chouaib-skitou/Festivio/commit/0767aadf004650079401c8f4f64c4f703efb5310))
* **frontend:** load shared data control styles ([ebc7098](https://github.com/chouaib-skitou/Festivio/commit/ebc7098aed777cdd96726f25442f1f52c7ce04aa))
* **seed:** load complete realistic demo dataset ([e276b26](https://github.com/chouaib-skitou/Festivio/commit/e276b2653a0dc54cf159fbe7b1173af2de5f12aa))

# [1.2.0](https://github.com/chouaib-skitou/Festivio/compare/v1.1.0...v1.2.0) (2026-09-06)


### Bug Fixes

* **frontend:** restore mobile burger dropdown ([c78262a](https://github.com/chouaib-skitou/Festivio/commit/c78262acc0d33981594b77bd7a948820a93834f7))


### Features

* **frontend:** add Festivio favicon ([53d35b3](https://github.com/chouaib-skitou/Festivio/commit/53d35b34487532050b258c5edd433eb4b92c5409))

# [1.1.0](https://github.com/chouaib-skitou/Festivio/compare/v1.0.0...v1.1.0) (2026-09-06)


### Features

* **frontend:** add marketing navigation shell ([57893e3](https://github.com/chouaib-skitou/Festivio/commit/57893e3f7bdb403f94ca5782f7b8e97d15d6c22f))
* **frontend:** add shared brand component ([30d1018](https://github.com/chouaib-skitou/Festivio/commit/30d101877ef4f73e23ae4ef7b2d0b90af748520c))
* **frontend:** add shared design tokens ([8019f8e](https://github.com/chouaib-skitou/Festivio/commit/8019f8e0dcc61c66611bd6c98b14a8ca969ce7e8))
* **frontend:** add workspace navigation shell ([7dcb6b8](https://github.com/chouaib-skitou/Festivio/commit/7dcb6b821e3847227e3e38715b19d516e9c95137))
* **frontend:** redesign marketing landing experience ([d29a2c3](https://github.com/chouaib-skitou/Festivio/commit/d29a2c39d4e788e627db124c71a4f173f405c5ca))
* **frontend:** redesign workspace overview ([ad3c23a](https://github.com/chouaib-skitou/Festivio/commit/ad3c23a5ff5f477f47c5043b343345a4bc73a94d))

# 1.0.0 (2026-09-05)


### Bug Fixes

* align backend formatting gate with production files ([8f38493](https://github.com/chouaib-skitou/Festivio/commit/8f384938ef3fe8516eb124800b5f4d57f903ff38))
* align CI release checks with semantic-release ([6f1ae82](https://github.com/chouaib-skitou/Festivio/commit/6f1ae82adc0ec497091f120370978b1883508599))
* align release automation with semantic-release ([d843a4f](https://github.com/chouaib-skitou/Festivio/commit/d843a4fa76a7aa646db9b58a87cf2926bd34107c))
* align release automation with semantic-release ([a9da60f](https://github.com/chouaib-skitou/Festivio/commit/a9da60f68ff7de9634b075332c4edbfc9a0b1b19))
* align release automation with semantic-release ([4ec9e12](https://github.com/chouaib-skitou/Festivio/commit/4ec9e12ba06ef193475ef2fc4d1eb9fae1e53abf))
* align release automation with semantic-release ([132e961](https://github.com/chouaib-skitou/Festivio/commit/132e961119656be36c6bbb6a16c431d853f5189a))
* disable automated dependency PRs ([df7b5a1](https://github.com/chouaib-skitou/Festivio/commit/df7b5a11a5b7bf1f15deb514af06a519d721afc1))
* enable mongoose query sanitization ([fe06525](https://github.com/chouaib-skitou/Festivio/commit/fe065253a1760fbb3c318610944709527ce89fe7))
* harden csrf scanning and release metadata ([733204a](https://github.com/chouaib-skitou/Festivio/commit/733204adee49743db4df346e2ba14bff670e9ceb))
* harden master to develop sync workflow ([8457d8f](https://github.com/chouaib-skitou/Festivio/commit/8457d8fb3914687bab96bcd2e6b38d4b2f3f87d9))
* keep formatting gate scoped to normalized files ([72c4242](https://github.com/chouaib-skitou/Festivio/commit/72c42425dffa44e41fba75636cbbab0805dbde80))
* narrow backend formatting gate to normalized runtime files ([fe73dbb](https://github.com/chouaib-skitou/Festivio/commit/fe73dbbe9067509c7752a222e73f0a6b2f0bcfe5))
* publish Docker images from release workflow ([ccf82cc](https://github.com/chouaib-skitou/Festivio/commit/ccf82ccff339673b684b8a9972251056965b2104))
* rate limit session mutation endpoints ([6006a7c](https://github.com/chouaib-skitou/Festivio/commit/6006a7c3e44c6bd9f18f8d1793100468a4df8f54))
* remove release-please configuration ([acf2a1f](https://github.com/chouaib-skitou/Festivio/commit/acf2a1f703016259ff71770b392cb365954b36c8))
* remove release-please manifest ([9955828](https://github.com/chouaib-skitou/Festivio/commit/9955828115ed2868ed1a5a90d379f0e8562218b7))
* remove separate image publishing workflow ([4b517c0](https://github.com/chouaib-skitou/Festivio/commit/4b517c01e77f056d0fdb0280497c5035ab7f29b0))
* remove unsafe local upload fallback ([34d237f](https://github.com/chouaib-skitou/Festivio/commit/34d237fa6419bb9ca64a76892fe55ed2a75314a4))
* remove unused Tailwind animation plugin ([b3cc533](https://github.com/chouaib-skitou/Festivio/commit/b3cc533a55f0665952f6d103cd47cc4cddc51934))
* replace release-please with direct release workflow ([b59f82a](https://github.com/chouaib-skitou/Festivio/commit/b59f82aa76f062b6652b8bdc307a64b8538d31db))
* sanitize managed event query filters ([9fee763](https://github.com/chouaib-skitou/Festivio/commit/9fee763e18c4aea9218ee07bc0b82cfd357b3f0e))
* sanitize user identifiers and role filters ([0a71422](https://github.com/chouaib-skitou/Festivio/commit/0a7142281611b4349831ed2dc23a3b57381cb874))
* scope formatting gate to normalized runtime files ([3c40d86](https://github.com/chouaib-skitou/Festivio/commit/3c40d862f0c7a784e04b9339c1d7fe367fb1ad6b))
* sync master to develop without pull request ([5593a32](https://github.com/chouaib-skitou/Festivio/commit/5593a32857b698c323a3ba0a0651ad72cc4b2ee8))
* use literal equality for managed event lookup ([fd89c9b](https://github.com/chouaib-skitou/Festivio/commit/fd89c9ba5aec06bca0b8bccc8fdbb8238c12af7c))
* validate task identifiers before database queries ([bf4d313](https://github.com/chouaib-skitou/Festivio/commit/bf4d313d303cf8a22df5ed770c32d0299569aab5))


### Features

* add image upload functionality to events using Imgur; update event routes and controllers ([bcaa1ff](https://github.com/chouaib-skitou/Festivio/commit/bcaa1ffd2faef2b8d19140164b1dd9454c743b72))
* complete auth rbac and local runtime hardening ([05a5adc](https://github.com/chouaib-skitou/Festivio/commit/05a5adc299ef37acd2f09e84e8510d9c1c015278))
* harden application for production readiness ([5c72cb2](https://github.com/chouaib-skitou/Festivio/commit/5c72cb20fdfea568b46ae6e533c4b859a24c9d32))
* secure frontend sessions and redesign product experience ([3626cbf](https://github.com/chouaib-skitou/Festivio/commit/3626cbfd68f1324bbb7008f86921caecc686b68f))

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
