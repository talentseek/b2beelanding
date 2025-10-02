# Cal.com Integration Setup

This guide explains how to set up Cal.com webhooks to automatically track bookings in your B2Bee database.

## 1. Create Your Cal.com Event Type

1. Go to https://cal.com and sign in
2. Create an event type (e.g., "B2Bee Demo Call - 30 min")
3. Note your booking link (e.g., `https://cal.com/your-username/30min`)

## 2. Add Cal.com Link to Environment Variables

Add this to your Vercel environment variables:

```bash
NEXT_PUBLIC_CALCOM_LINK="https://cal.com/your-username/30min"
```

## 3. Set Up Webhook in Cal.com

1. In Cal.com, go to **Settings** → **Developer** → **Webhooks**
2. Click **+ New Webhook**
3. Configure:
   - **Subscriber URL**: `https://your-domain.vercel.app/api/webhooks/cal`
   - **Event Triggers**: Select:
     - ✅ Booking Created
     - ✅ Booking Cancelled
     - ✅ Booking Rescheduled
   - **Secret**: Generate a random string (see below)

### Generate Webhook Secret

Run this command to generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use this online: https://www.uuidgenerator.net/

## 4. Add Webhook Secret to Environment Variables

Add to Vercel environment variables:

```bash
CALCOM_WEBHOOK_SECRET="your-generated-secret-here"
```

## 5. Update Webhook Handler (Optional - Enhanced Security)

The webhook handler at `/api/webhooks/cal` currently accepts all webhooks. To add signature verification:

1. Cal.com sends a signature in the `x-cal-signature-256` header
2. You can verify it matches your secret to ensure authenticity

## 6. How It Works

### Lead Capture Flow:

1. User fills out "Book a Demo" form → Lead saved to database
2. Lead ID returned to frontend
3. Cal.com booking page opens with pre-filled data (name, email, notes)
4. User books a time slot in Cal.com

### Webhook Flow (Automatic):

1. User books/cancels/reschedules in Cal.com
2. Cal.com sends webhook to `/api/webhooks/cal`
3. Our system:
   - Finds the booking by `providerId` (Cal.com UID)
   - Updates status: `CONFIRMED`, `CANCELLED`, or `RESCHEDULED`
   - Updates start/end times

### Manual Booking Sync (Alternative):

If you prefer to manually track bookings without webhooks, you can call:

```bash
POST /api/booking
{
  "leadId": "lead_id_from_database",
  "providerId": "cal_com_booking_uid",
  "startTime": "2025-10-03T10:00:00Z",
  "endTime": "2025-10-03T10:30:00Z",
  "beeSlug": "social-bee"
}
```

## 7. View Leads and Bookings

### In Prisma Studio:
```bash
pnpm db:studio
```

### In Admin Panel:
Go to your deployed site at `/admin` (requires authentication)

## 8. Testing

### Test Database Connection:
```
GET https://your-domain.vercel.app/api/test-db
```

### Test Lead Creation:
```bash
curl -X POST https://your-domain.vercel.app/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "company": "Test Company",
    "beeSlug": "social-bee"
  }'
```

### Test Webhook (Local):
```bash
curl -X POST http://localhost:3000/api/webhooks/cal \
  -H "Content-Type: application/json" \
  -d '{
    "triggerEvent": "BOOKING_CREATED",
    "payload": {
      "uid": "test_booking_123",
      "startTime": "2025-10-03T10:00:00Z",
      "endTime": "2025-10-03T10:30:00Z"
    }
  }'
```

## Environment Variables Summary

Required for full functionality:

```bash
# Database (required)
DATABASE_URL="postgresql://..."

# Authentication (required for admin)
AUTH_SECRET="..."
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"

# Cal.com (required for booking flow)
NEXT_PUBLIC_CALCOM_LINK="https://cal.com/your-username/30min"
CALCOM_WEBHOOK_SECRET="your-webhook-secret"

# Email notifications (optional)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"
RESEND_NOTIFY_EMAIL="admin@yourdomain.com"
```

## Troubleshooting

### Leads not saving on Vercel:
1. Check database connection: Visit `/api/test-db`
2. Check Vercel logs: `vercel logs`
3. Verify `DATABASE_URL` environment variable is set
4. Ensure Prisma Client is generated (check `postinstall` script ran)

### Webhooks not working:
1. Verify webhook URL is correct in Cal.com settings
2. Check webhook secret matches
3. Test webhook manually with curl
4. Check Vercel function logs for errors

### Lead drawer not opening Cal.com:
1. Verify `NEXT_PUBLIC_CALCOM_LINK` is set in Vercel
2. Check browser console for errors
3. Ensure lead was saved successfully (check response)

