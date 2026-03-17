# Withlove, Jesse

Production-ready full-stack ecommerce for personalised greeting cards. Fully manageable from the admin panel.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite (dev) / PostgreSQL (production) + Prisma
- **Auth:** NextAuth (credentials)
- **Uploads:** Local `public/uploads` (swap for S3/Cloudinary in production)

## Setup

### 1. Prerequisites

- Node.js 18+

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

```bash
cp .env.example .env
```

Required:

- `DATABASE_URL` – SQLite: `file:./dev.db` (default) or PostgreSQL for production
- `NEXTAUTH_URL` – e.g. `http://localhost:3000`
- `NEXTAUTH_SECRET` – `openssl rand -base64 32`

Optional (seed): `ADMIN_EMAIL`, `ADMIN_PASSWORD`

### 4. Database

```bash
npm run db:push
npm run db:seed
```

After pulling schema changes (e.g. new `NewsletterSignup` model), run `npm run db:push` again so the database matches the schema.

### 5. Run

```bash
npm run dev
```

- **Storefront:** http://localhost:3000
- **Admin:** http://localhost:3000/admin (`admin@withlovejesse.com` / `ChangeMe123!`)

### Quick reference (live site)

On Vercel (or your production URL), use the same paths:

- **Site:** `https://your-domain.vercel.app`
- **Admin:** `https://your-domain.vercel.app/admin`
- **Login:** same as above (from seed or your `ADMIN_EMAIL` / `ADMIN_PASSWORD` in env). Get the exact production URL from Vercel → Project → Settings → Domains.

## Admin (fully functional)

- **Dashboard** – Overview and quick actions
- **Products** – CRUD, image upload, SEO, personalisation
- **Categories** – CRUD, active toggle
- **Seasonal Campaigns** – CRUD, banner image, dates
- **Promotions** – CRUD, discount codes, banners
- **Content Blocks** – Hero, delivery/returns pages, site copy
- **FAQ** – CRUD
- **Navigation** – Header/footer links
- **Site Settings** – Contact, shipping, announcement
- **Orders** – List and detail view
- **Media** – Upload PNG, JPG, PDF (product images, banners)

## Uploads

- **Local:** Files are stored in `public/uploads/`. Max 10MB.
- **Production (Vercel):** The app uses **Vercel Blob** so you can upload images from your computer in the admin. Max 4MB per file on the live site. To enable it:
  1. In the Vercel project, go to **Storage** → **Create Database** → **Blob**.
  2. Create a Blob store (name it e.g. `withlovejesse-uploads`) and set access to **Public**.
  3. The `BLOB_READ_WRITE_TOKEN` env var is added automatically. Redeploy so the API can upload.

## Deployment

1. **Database:** Use PostgreSQL (Supabase, Neon, Vercel Postgres). Update `DATABASE_URL`.
2. **Auth:** Set strong `NEXTAUTH_SECRET`.
3. **Payments:** Add Stripe and wire checkout.
4. **Uploads:** Configure cloud storage; update `/api/admin/media/upload`.

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start dev server         |
| `npm run build`| Build for production     |
| `npm run start`| Start production server  |
| `npm run db:push` | Push schema to DB    |
| `npm run db:seed` | Seed demo data       |
| `npm run db:studio` | Prisma Studio       |

## Known npm warnings

When you run `npm install` (locally or on Vercel), you may see deprecation warnings for some transitive dependencies. The project uses Next.js 15 and ESLint 9; any remaining warnings come from transitive deps and do **not** affect install, build, or runtime. You can ignore them.
