# InviteKart private template admin setup

The admin area uses three Vercel environment variables. Set all three for **Production, Preview and Development** in Vercel → Project → Settings → Environment Variables.

- `ADMIN_EMAIL`: the email address you will use to sign in.
- `ADMIN_PASSWORD`: choose a strong, unique password. Keep it private.
- `ADMIN_SESSION_SECRET`: a random secret of at least 32 characters. Generate one with a password manager or a secure random generator. Do not reuse your admin password.

After adding or changing these values, redeploy the Vercel project so the new environment variables are available.

Open `/admin/login` on your website and sign in with the email and password you configured. Once signed in, the Templates page shows a **Manage templates** link. Visitors do not see this link, and all template-management API requests independently verify the signed, HTTP-only admin session cookie.

You can upload PNG, JPG or WEBP template artwork up to 2 MB per image. Choose a category and either save as a draft or publish. Only published templates appear in the public gallery. Uploaded artwork is stored in the existing PostgreSQL Template record as a data URL.

Do not put these secrets in GitHub source files, commit them, or share them in chat. If you change the admin password or session secret in Vercel, redeploy.
