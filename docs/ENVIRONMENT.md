# Environment Configuration

This repository must adapt to the existing deployment environment. Do not modify, rename, regenerate, or commit real `.env` files.

Use `.env.example` as the public template for required variables. Real values belong in local `.env*` files, GitHub repository secrets, Vercel environment variables, or another approved secret manager.

## Current Integrations

- `MONGODB_URI`: used by `src/lib/db.ts` for MongoDB-backed CMS and API routes.
- Clerk variables: used by `@clerk/nextjs` provider and middleware for admin authentication.
- `RESEND_API_KEY`: reserved for email flows such as contact notifications.
- `NEXT_PUBLIC_APP_URL`: used by deployment and future absolute URL generation.
- Media variables: define the local-first upload abstraction for the planned media system without forcing a storage provider.

## GitHub Secrets Required

- `MONGODB_URI`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_STAGING_APP_URL`
- `NEXT_PUBLIC_PRODUCTION_APP_URL`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## GitHub Variables Optional

- `MEDIA_STORAGE_DRIVER`
- `MEDIA_UPLOAD_DIR`
- `NEXT_PUBLIC_MEDIA_BASE_URL`
