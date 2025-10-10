# ABM (Account-Based Marketing) Pages

## Overview

The ABM pages are highly personalized landing pages for Sales Bee that are tailored to specific prospects. They showcase an animated demonstration of how Sales Bee works, with personalization throughout based on the prospect's information.

## Features

### 1. **Personalized Hero Section**
- Greets the prospect by first name
- Mentions their company name
- Shows custom benefit points
- Floating Sales Bee animations in the background

### 2. **Interactive Journey (6 Steps)**
Each step auto-plays when scrolled into view and loops continuously:

1. **Create Campaign with AI** - Typing animation showing target market input
2. **Finding Companies** - Companies appear one by one with checkmarks
3. **Finding Leads** - Lead cards with avatars, titles, and LinkedIn indicators
4. **Building Sequences** - Multichannel sequence timeline (LinkedIn, Email, WhatsApp)
5. **Launch Campaign** - Interactive launch button with success animation
6. **Analytics Dashboard** - Counting numbers showing results (replies, meetings, rates)

### 3. **Personalized Final CTA**
- References prospect's name and company again
- Links directly to Cal.com booking page
- Shows key benefits (15-min call, personalized, no pressure)

## URL Structure

```
/bee/sales-bee/{linkedinIdentifier}
```

### Examples:
- **Daniel Beer**: `http://localhost:3000/bee/sales-bee/dbeer`
  - LinkedIn: https://www.linkedin.com/in/dbeer/
  - Company: The Store Room
  - Target: Plumbers, Electricians and Carpenters in Solihull

- **Michael Beckett**: `http://localhost:3000/bee/sales-bee/mjcbeckett`
  - LinkedIn: https://www.linkedin.com/in/mjcbeckett/
  - Company: B2Bee
  - Target: Small Business Owners and Entrepreneurs

## Database Structure

The `ABMPage` model contains:

```typescript
{
  linkedinIdentifier  // URL slug (e.g., "dbeer")
  linkedinUrl         // Full LinkedIn URL
  firstName           // Prospect's first name
  lastName            // Prospect's last name
  title               // Job title
  company             // Company name
  targetMarket        // Who they want to target
  targetLocation      // Where they want to target
  mockCompanies       // Array of company names for demo
  mockLeads           // Array of lead objects {name, company, title}
  mockAnalytics       // {replies, meetings, openRate, replyRate}
  heroMessage         // Optional custom hero message (null uses default)
  benefitPoints       // Array of benefit strings
  isActive            // Show/hide the page
}
```

## How to Add a New ABM Page

### Option 1: Via Prisma Studio (Easiest)

1. Run: `npx prisma studio`
2. Navigate to the `ABMPage` model
3. Click "Add record"
4. Fill in all fields:
   - `linkedinIdentifier`: The unique slug for the URL (e.g., "jsmith")
   - `linkedinUrl`: Full LinkedIn URL
   - `firstName`, `lastName`, `title`, `company`: Personal info
   - `targetMarket`: e.g., "Accountants and Bookkeepers"
   - `targetLocation`: e.g., "Manchester, UK"
   - `mockCompanies`: JSON array of company names
     ```json
     ["Smith Accounting", "Jones & Co", "Premier Books", "Elite Accounting Ltd", "ProBooks Solutions", "Midlands Financial Services"]
     ```
   - `mockLeads`: JSON array of lead objects
     ```json
     [
       {"name": "John Smith", "company": "Smith Accounting", "title": "Managing Partner"},
       {"name": "Jane Doe", "company": "Jones & Co", "title": "Owner"},
       {"name": "Bob Wilson", "company": "Premier Books", "title": "Director"}
     ]
     ```
   - `mockAnalytics`: JSON object with stats
     ```json
     {"replies": 52, "meetings": 15, "openRate": 71, "replyRate": 28}
     ```
   - `benefitPoints`: JSON array of benefits
     ```json
     ["Save 20 hours per week", "Fill your pipeline faster", "Book more meetings", "Scale without hiring"]
     ```
   - `isActive`: true

5. Save the record
6. Access at: `http://localhost:3000/bee/sales-bee/{linkedinIdentifier}`

### Option 2: Via Seed File (For Multiple Pages)

Add to `prisma/seed.ts`:

```typescript
const newPage = await prisma.aBMPage.upsert({
  where: { linkedinIdentifier: 'jsmith' },
  update: { /* your data */ },
  create: {
    linkedinIdentifier: 'jsmith',
    linkedinUrl: 'https://www.linkedin.com/in/jsmith/',
    firstName: 'John',
    lastName: 'Smith',
    title: 'CEO',
    company: 'Acme Corp',
    targetMarket: 'Software Engineers',
    targetLocation: 'London, UK',
    mockCompanies: [
      'Tech Solutions Ltd',
      'Digital Innovations',
      'Code Factory',
    ],
    mockLeads: [
      {
        name: 'Alice Johnson',
        company: 'Tech Solutions Ltd',
        title: 'Senior Developer',
      },
    ],
    mockAnalytics: {
      replies: 45,
      meetings: 11,
      openRate: 65,
      replyRate: 22,
    },
    benefitPoints: [
      'Hire faster',
      'Find pre-vetted candidates',
      'Save on recruitment costs',
    ],
    isActive: true,
  },
});
```

Then run: `npx tsx prisma/seed.ts`

## SEO & Indexing

ABM pages are intentionally **not indexed** by search engines (`robots: noindex`). This is because:
- They contain personalized content
- They're meant for specific prospects only
- You don't want competitors finding them

## Integration with Outreach App

Your Sales Bee outreach app should:

1. Generate the LinkedIn identifier from the prospect's LinkedIn URL
2. Create an ABM page record via API or directly in the database
3. Include the ABM page URL in outreach messages
4. Track visits/conversions

Example URL generation:
```
https://www.linkedin.com/in/dbeer/ 
→ Extract: "dbeer"
→ Generate: https://www.b2bee.ai/bee/sales-bee/dbeer
```

## Customization

### Animations
All animations are in `src/components/abm-page-client.tsx` and use:
- **Framer Motion** for animations
- **IntersectionObserver** (`useInView`) for scroll-triggered animations
- **useEffect** loops for continuous animations

### Timing
Adjust animation timing by modifying:
- `interval` timing in `useEffect` hooks (e.g., `300ms` for companies appearing)
- `duration` in Framer Motion transitions
- Delay values between animation steps

### Styling
The page uses:
- Gradient backgrounds for each section
- Orange primary color (consistent with brand)
- shadcn/ui components (Button, Card, Badge)
- Lucide icons

## Testing

Test a page locally:
```bash
# Visit in browser
http://localhost:3000/bee/sales-bee/dbeer

# Or use curl
curl -I http://localhost:3000/bee/sales-bee/dbeer
# Should return: HTTP/1.1 200 OK
```

## Production Deployment

1. Ensure `NEXT_PUBLIC_CALCOM_LINK` is set in Vercel
2. Push changes to GitHub
3. Vercel will auto-deploy
4. Add ABM pages via Prisma Studio connected to production DB
5. Share URLs with prospects

## Future Enhancements

Potential additions:
- Admin UI for creating ABM pages
- A/B testing different messages
- Video recording instead of animations
- Analytics tracking (page views, time on page, CTA clicks)
- Dynamic content based on LinkedIn data
- Slack notifications when prospect visits

