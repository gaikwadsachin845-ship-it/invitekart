# InviteKart — production foundation

This is the next-stage Next.js application scaffold for the InviteKart brand.

## Included
- Next.js App Router + TypeScript storefront
- Responsive landing page and occasion browsing
- Six language selector with starter localized homepage copy
- Live invitation preview and client-side PNG export
- Prisma/PostgreSQL data model for templates, invitations and admin users
- Public template listing API
- Invitation save and share-ID retrieval API
- Seed data for initial sample templates

## Run locally
1. Install Node.js 20+ and PostgreSQL.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` and secrets.
3. Run `npm install`
4. Run `npx prisma generate`
5. Run `npx prisma migrate dev --name init`
6. Run `npm run db:seed`
7. Run `npm run dev` and open http://localhost:3000

## Production blockers to complete before launch
This scaffold is not yet safe to deploy as a public production service. In particular:
- Add authentication and role-based authorization to `/admin` and all admin mutation endpoints.
- Add CSRF/rate limiting, request size limits, abuse protection and security headers.
- Add managed object storage and signed uploads for template artwork/user images.
- Build full Fabric.js canvas interactions (drag, resize, rotate, layers, image uploads).
- Implement full invitation translation/catalogue and test regional-script font embedding in PNG/PDF.
- Add consent/privacy policy, retention/deletion flows, backups, monitoring and accessibility tests.
- Configure a production database, domain, HTTPS, email, analytics and ad network approval.

## Important notes
- Free model: templates/downloads are free in this scaffold; no ad network is wired yet.
- The current editor is a working starter, not the complete advanced editor requested.
- API input is validated, but public write endpoints need rate limits and abuse controls before launch.
- Do not publish admin access until authentication/authorization is implemented.
