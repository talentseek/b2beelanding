# B2Bee Landing Page 🐝

A high-converting landing page for B2Bee.ai - an AI automation agency that creates "Bees" (automation bundles) to help small businesses with various tasks.

## Features

- 🎨 Modern, responsive landing page with animated hero section
- 🐝 Dynamic Bees (product) showcase with testimonials
- 📝 Lead capture with Cal.com integration for demo bookings
- 👨‍💼 Admin dashboard for managing bees, leads, and testimonials
- 🔒 Better Auth authentication for admin area (simple email/password)
- 💾 PostgreSQL database with Prisma ORM
- 📧 Email notifications via Resend
- 🎭 Beautiful UI with shadcn/ui components
- ⚡ Built with Next.js 15 (App Router) and TypeScript

## Tech Stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** Better Auth (email/password)
- **Email:** Resend
- **Scheduling:** Cal.com
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (or npm/yarn)
- PostgreSQL database
- Cal.com account
- Resend account (optional, for email notifications)

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/b2beelanding?schema=public"

# Cal.com Integration
NEXT_PUBLIC_CALCOM_LINK="https://cal.com/your-username"

# Resend Email (Optional)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="hello@b2bee.ai"
RESEND_NOTIFY_EMAIL="team@b2bee.ai"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Installation

1. **Install dependencies:**
```bash
pnpm install
```

2. **Setup the database:**
```bash
# Push schema to database
pnpm db:push

# Seed with initial data (bees and testimonials)
pnpm db:seed
```

3. **Run the development server:**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

### Database Management

```bash
# Push schema changes to database
pnpm db:push

# Seed database with sample data
pnpm db:seed

# Open Prisma Studio (database GUI)
pnpm db:studio
```

## Project Structure

```
src/
├── app/
│   ├── admin/              # Admin dashboard pages
│   ├── api/                # API routes (leads, bees, bookings, webhooks)
│   ├── bee/[slug]/         # Bee detail pages
│   ├── layout.tsx          # Root layout with Clerk provider
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── hero-section.tsx    # Hero section with animation
│   ├── bees-grid.tsx       # Bees showcase grid
│   ├── testimonials-section.tsx
│   └── lead-capture-drawer.tsx
├── lib/
│   ├── db.ts               # Prisma client singleton
│   └── utils.ts            # Utility functions
└── middleware.ts           # Clerk auth middleware

prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Database seed script
```

## Key Routes

### Public Routes
- `/` - Landing page
- `/bee/[slug]` - Individual bee detail pages (e.g., `/bee/social-bee`)

### Admin Routes (Protected)
- `/admin` - Dashboard with stats, recent leads, and bookings
- `/admin/bees` - Manage bee products
- `/admin/testimonials` - Manage customer testimonials

### API Routes
- `POST /api/lead` - Create new lead
- `GET /api/bees` - Get all active bees
- `POST /api/booking` - Create booking
- `POST /api/webhooks/cal` - Cal.com webhook handler

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add all environment variables
4. Deploy!

Make sure to:
- Set up your PostgreSQL database (e.g., Vercel Postgres, Supabase, or Railway)
- Run migrations and seed: `pnpm db:push && pnpm db:seed`
- Update Cal.com links
- Set up Resend for production emails
- Create admin user via seed script or manually

### Post-Deployment

After deployment, run the seed script to populate initial data:

```bash
pnpm db:seed
```

Or manually add bees and testimonials through the admin dashboard.

## Customization

### Brand Colors

The primary brand color is `#205b41` (dark green) as specified in the PRD. Update in:
- Button components: `bg-[#205b41] hover:bg-[#1a4a35]`
- Tailwind config for more extensive theming

### Content

Update the copy in:
- `src/app/page.tsx` - Hero and CTA text
- `prisma/seed.ts` - Default bees and testimonials
- Admin dashboard - Add/edit bees and testimonials

## License

© 2025 B2Bee.ai. All rights reserved.
