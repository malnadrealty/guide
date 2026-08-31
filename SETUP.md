# Malnad Realty Guide — Setup

## Prerequisites
- Node.js 18+
- PostgreSQL database

## Quick Start

### 1. Environment
```bash
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL and AUTH_SECRET
```

Generate AUTH_SECRET:
```bash
openssl rand -base64 32
```

### 2. Database
```bash
# Push schema to database
npm run db:push

# Seed with demo content and admin user
npm run db:seed
```

### 3. Run locally
```bash
npm run dev
```

Open http://localhost:3000

### 4. Admin CMS
Go to http://localhost:3000/admin

Login with:
- Email: admin@malnadrealty.com (or ADMIN_EMAIL from .env)
- Password: set in .env.local as ADMIN_PASSWORD

## Production Deployment

### Deploy to Vercel
1. Push to GitHub
2. Import in Vercel
3. Set environment variables:
   - `DATABASE_URL` — Postgres connection string
   - `AUTH_SECRET` — Random 32-char secret
   - `NEXTAUTH_URL` — https://guide.malnadrealty.com
4. Set custom domain: guide.malnadrealty.com

### Environment Variables Required
```
DATABASE_URL=postgresql://...
AUTH_SECRET=...
NEXTAUTH_URL=https://guide.malnadrealty.com
```

## File Structure
```
app/
  (public)/          Public website pages
  admin/             CMS (protected)
  api/               API routes
components/
  public/            Public-facing UI components  
  admin/             CMS components
  ui/                Shared components (Logo)
lib/
  db.ts              Prisma client
  auth.ts            NextAuth config
  utils.ts           Utility functions
prisma/
  schema.prisma      Database schema
scripts/
  seed.ts            Demo content seed
public/
  uploads/           Uploaded images
```
