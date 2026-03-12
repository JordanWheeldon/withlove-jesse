# Deploy Withlove, Jesse

## Step 1 — Create GitHub repo

1. Go to [github.com/new](https://github.com/new)
2. Name: `withlove-jesse` (or your choice)
3. Leave it **empty** (no README, no .gitignore)
4. Create repository

## Step 2 — Push to GitHub

Run these in the project folder:

```bash
git remote add origin https://github.com/YOUR_USERNAME/withlove-jesse.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 3 — Database (required for Vercel)

SQLite does not work on Vercel. Use a hosted database:

### Option A — Vercel Postgres (simplest)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Create a new project (or do this later in Step 4)
3. In the project → Storage → Create Database → **Postgres**
4. Connect the database; Vercel adds `POSTGRES_PRISMA_URL` (or similar) to env

### Option B — Neon (free tier)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a project and copy the connection string
3. Use it as `DATABASE_URL` in Vercel env

### Update Prisma for PostgreSQL

In `prisma/schema.prisma`, change:

```prisma
datasource db {
  provider = "postgresql"   // was "sqlite"
  url      = env("DATABASE_URL")
}
```

Then run locally:

```bash
npm run db:push
npm run db:seed
```

## Step 4 — Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your `withlove-jesse` repo
3. Add environment variables:
   - `DATABASE_URL` — your PostgreSQL connection string
   - `NEXTAUTH_URL` — your live URL, e.g. `https://withlove-jesse.vercel.app`
   - `NEXTAUTH_SECRET` — run `openssl rand -base64 32` to generate one
   - `ADMIN_EMAIL` — e.g. `admin@withlovejesse.com`
   - `ADMIN_PASSWORD` — a strong password

4. Deploy

Vercel will assign a URL like `https://withlove-jesse.vercel.app` or `https://withlove-jesse-xyz.vercel.app`.

## Step 5 — Post-deploy

1. Run the seed on production (one-time):
   - Use Vercel Postgres / Neon dashboard to run SQL, or
   - Run `npm run db:seed` locally with `DATABASE_URL` pointing at your production DB

2. Uploads: `public/uploads` won’t persist on Vercel. For production, switch to S3, Cloudinary, or Vercel Blob for media storage.
