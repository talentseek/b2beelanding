# B2Bee Landing Page - Quick Setup Guide

This guide will help you get the B2Bee landing page up and running quickly.

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory with these required variables:

```bash
# Minimum required to start
DATABASE_URL="postgresql://user:password@localhost:5432/b2beelanding"
NEXT_PUBLIC_CALCOM_LINK="https://cal.com/your-username"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Setup Database
```bash
# Push Prisma schema to database
pnpm db:push

# Seed with sample data (3 bees + 6 testimonials)
pnpm db:seed
```

### 4. Start Development Server
```bash
pnpm dev
```

Visit http://localhost:3000 🎉

---

## 📋 Detailed Setup

### Prerequisites

1. **Node.js 20+** - [Download](https://nodejs.org/)
2. **pnpm** - Install with `npm install -g pnpm`
3. **PostgreSQL Database** - Local or hosted (Vercel, Supabase, Railway)

### Required Accounts

1. **Cal.com** (Meeting Scheduling)
   - Sign up at [cal.com](https://cal.com)
   - Get your booking link (e.g., `https://cal.com/yourusername`)
   - Add to `.env` as `NEXT_PUBLIC_CALCOM_LINK`

2. **Resend** (Email Notifications - Optional)
   - Sign up at [resend.com](https://resend.com)
   - Create an API key
   - Add to `.env`

### Database Setup Options

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL locally
brew install postgresql  # macOS
# or use official installer

# Start PostgreSQL
brew services start postgresql

# Create database
createdb b2beelanding

# Update .env
DATABASE_URL="postgresql://localhost:5432/b2beelanding"
```

#### Option B: Vercel Postgres (Recommended for deployment)
1. Create a Vercel Postgres database
2. Copy the connection string
3. Add to `.env`

#### Option C: Supabase
1. Create a new Supabase project
2. Go to Settings > Database
3. Copy the connection string (use "Connection Pooling" for production)
4. Add to `.env`

### Complete Environment Variables

```bash
# Database (Required)
DATABASE_URL="postgresql://user:password@localhost:5432/b2beelanding?schema=public"

# Cal.com Integration (Required)
NEXT_PUBLIC_CALCOM_LINK="https://cal.com/your-username"

# Resend Email (Optional but recommended)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="hello@b2bee.ai"
RESEND_NOTIFY_EMAIL="team@b2bee.ai"

# App Configuration (Required)
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # Update for production
```

---

## 🧪 Testing the Setup

After setup, test each feature:

### 1. Landing Page
- Visit http://localhost:3000
- Should see hero section with animated bees
- Check that bees grid displays 3 bees
- Verify testimonials appear

### 2. Lead Capture
- Click "Book a Demo" button
- Fill out the form
- Should open Cal.com in new tab with prefilled info
- Check admin dashboard for new lead

### 3. Admin Dashboard
- Visit http://localhost:3000/admin
- Should redirect to sign-in page
- Sign in with: `michael@costperdemo.com` / `e120fleB!`
- View dashboard with stats
- Check `/admin/bees` and `/admin/testimonials`

### 4. API Endpoints
Test API routes:
```bash
# Get bees
curl http://localhost:3000/api/bees

# Create lead
curl -X POST http://localhost:3000/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "company": "Test Co"
  }'
```

---

## 🎨 Customization

### Update Brand Colors
The primary color is `#205b41`. To change:
1. Update in `src/app/globals.css` (CSS variables)
2. Update Button components: `bg-[#205b41]` to your color
3. Update in Tailwind config if needed

### Modify Content
1. **Hero Text**: Edit `src/components/hero-section.tsx`
2. **Bees**: Run `pnpm db:studio` and edit in Prisma Studio
3. **Testimonials**: Edit via admin dashboard or Prisma Studio
4. **Footer Links**: Edit `src/app/page.tsx`

### Add New Bees
Via Admin Dashboard:
1. Go to `/admin/bees`
2. Click "Add New Bee" (functionality needs to be implemented)

Via Prisma Studio:
```bash
pnpm db:studio
```
Then add/edit bees directly in the UI.

Via Code:
Update `prisma/seed.ts` and run `pnpm db:seed`

---

## 🚨 Troubleshooting

### Database Connection Issues
```bash
# Test database connection
pnpm prisma db push
```
If fails, check:
- Database URL is correct
- Database server is running
- Firewall allows connection

### Authentication Issues
- Admin credentials: `michael@costperdemo.com` / `e120fleB!`
- Make sure you ran `pnpm db:seed` to create the admin user
- Check database connection if sign-in fails

### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
```

### Cal.com Integration Not Working
- Verify `NEXT_PUBLIC_CALCOM_LINK` is correct
- Test link manually in browser
- Check browser console for errors

---

## 📦 Deployment

See [README.md](./README.md) for full deployment instructions.

Quick Vercel deployment:
```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Run database seed after first deployment
```

---

## 🆘 Need Help?

- Check [README.md](./README.md) for detailed documentation
- Review [PRD.md](./PRD.md) for project requirements
- Check [b2beelanding_prd.mdc](./b2beelanding_prd.mdc) for full PRD

---

## ✅ Post-Setup Checklist

- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Database created and migrated
- [ ] Sample data seeded
- [ ] Dev server running
- [ ] Landing page loads correctly
- [ ] Lead capture form works
- [ ] Admin dashboard accessible
- [ ] Clerk authentication working
- [ ] Cal.com integration tested

**You're ready to buzz! 🐝**

