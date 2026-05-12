import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isApiRoute = createRouteMatcher(['/api(.*)']);
const isPublicApiWriteRoute = createRouteMatcher([
  '/api/contact(.*)',
  '/api/testimonials',
  '/api/lab(.*)',
]);
const isPublicRoute = createRouteMatcher([
  '/',
  '/projects(.*)',
  '/blog(.*)',
  '/academy(.*)',
  '/contact(.*)',
  '/admin/sign-in(.*)',
  '/api/contact(.*)',
  '/api/lab(.*)',
  '/api/projects(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isApiRoute(req) && req.method !== 'GET' && !isPublicApiWriteRoute(req)) {
    await auth.protect();
    return;
  }

  if (!isPublicRoute(req) && isAdminRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
