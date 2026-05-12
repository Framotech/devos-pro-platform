# Git Workflow

## Long-Lived Branches

- `main`: production-ready code. Pushes deploy to production.
- `development`: integration branch for active work. Pushes deploy to staging.
- `staging`: release-candidate branch for manual QA and pre-production checks.

## Short-Lived Branches

- `feature/<scope>`: new platform work, refactors, CMS improvements, UI changes, and media-system features.
- `hotfix/<scope>`: urgent production fixes branched from `main`.

## Promotion Flow

1. Create feature branches from `development`.
2. Open pull requests back into `development`.
3. CI runs lint, type-check, unit tests, and build validation.
4. Merge to `development` deploys the staging environment.
5. Promote stable changes into `main` for production deployment.

## Commit Rules

Commits are checked with Conventional Commits through commitlint.

Examples:

- `feat: add media upload abstraction`
- `fix: repair academy video playback`
- `chore: update ci pipeline`
