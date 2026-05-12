# Environment Configuration

This repository must adapt to the existing deployment environment. Do not modify, rename, regenerate, or commit real `.env` files.

Use `.env.example` as the public template for required variables. Real values belong in local `.env*` files, GitHub repository secrets, Vercel environment variables, or another approved secret manager.

## Current Integrations

- `MONGODB_URI`: used by `src/lib/db.ts` for MongoDB-backed CMS and API routes.
- Clerk variables: used by `@clerk/nextjs` provider and middleware for admin authentication.
- `RESEND_API_KEY`: reserved for email flows such as contact notifications.
- `NEXT_PUBLIC_APP_URL`: used by deployment and future absolute URL generation.
- Cloudinary variables: used by the protected upload endpoint for persistent production media.

## Cloud Media Uploads

The protected upload endpoint is `POST /api/media/upload`. It accepts multipart form data with:

- `file`: image or MP4 file.
- `namespace`: logical storage folder such as `projects`, `studio`, `blog`, `courses`, or `videos`.

Uploads are stored in Cloudinary under `devos-pro-platform/<namespace>`. The returned permanent `secure_url` is stored by admin forms and rendered by the frontend.

Required Cloudinary configuration:

- `CLOUDINARY_CLOUD_NAME`
- Either `CLOUDINARY_UPLOAD_PRESET` for unsigned uploads, or both `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` for signed server uploads.

## GitHub Secrets Required

- `MONGODB_URI`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `RESEND_API_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_STAGING_APP_URL`
- `NEXT_PUBLIC_PRODUCTION_APP_URL`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## GitHub Variables Optional

- `CLOUDINARY_UPLOAD_PRESET`
