# Resend Email Automation Setup Guide

Your Resend email automation system is now live! Here's what it does and how to configure it.

## 📧 Email Flows

### 1. **Reminder Email** (After 10 Minutes)
**Trigger:** Lead is created but hasn't booked a demo within 10 minutes

**What happens:**
- Cron job runs every 5 minutes
- Finds leads with status 'NEW' created >10 mins ago
- Sends a friendly reminder email with:
  - Personalized greeting
  - Benefits of booking a demo
  - Pre-filled Cal.com booking link (includes their name, email, company)
  - B2Bee branding and bee emojis 🐝
- Marks lead as reminded (won't send again)

**Example:** User fills out form at 3:00 PM → Reminder sent at 3:10 PM if no booking

### 2. **Welcome/Confirmation Email** (Immediate)
**Trigger:** User books a demo through Cal.com

**What happens:**
- Cal.com webhook fires
- Creates booking in database
- Immediately sends confirmation email with:
  - Booking date/time (formatted nicely)
  - Bee product name
  - What to expect in the demo
  - How to prepare
  - Reschedule information
- Beautiful HTML template with B2Bee branding

**Example:** User books demo at 3:05 PM → Confirmation sent at 3:05 PM

---

## 🔧 Environment Variables Setup

### Required Variables (Add to Vercel):

```bash
# Resend API Key (already have this)
RESEND_API_KEY="re_2zFuPFLK_NWr7gHTvRwZTf1AAxggs2T59"

# From Email Address (your verified domain)
RESEND_FROM_EMAIL="noreply@notifications.b2bee.ai"

# Cron Secret (for security - generate a random one)
CRON_SECRET="b2bee_cron_$(openssl rand -hex 32)"
```

### How to Add in Vercel:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add each variable above
3. Apply to **Production** (and optionally Preview/Development)
4. Redeploy or wait for next deploy

---

## ✅ Verify Email Domain in Resend

Before emails will send, you need to verify your domain:

1. Go to https://resend.com/domains
2. Click **+ Add Domain**
3. Enter: `notifications.b2bee.ai`
4. Follow DNS setup instructions:
   - Add the provided TXT, MX, and CNAME records to your DNS
   - Wait for verification (usually 5-10 minutes)
5. Once verified, emails will start sending!

**DNS Records to Add:**
Check Resend dashboard for exact values, but typically:
- TXT record for domain verification
- MX records for receiving bounces
- CNAME for DKIM authentication

---

## 🧪 Testing

### Test Reminder Email (Locally):
```bash
# Create a test lead via API
curl -X POST http://localhost:3000/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "your-test-email@example.com",
    "beeSlug": "social-bee"
  }'

# Wait 10 minutes, or manually trigger the cron:
curl http://localhost:3000/api/cron/send-reminders
```

### Test Confirmation Email:
1. Fill out "Book a Demo" form on your site
2. Complete the booking in Cal.com
3. Check your email inbox - should receive confirmation

### Check Vercel Logs:
Look for these log messages:
```
[Email] ✅ Reminder email sent to user@example.com
[Email] ✅ Booking confirmation sent to user@example.com
[Cron] Send-reminders job completed: { total: 3, sent: 3, failed: 0 }
```

---

## 📊 How the Cron Job Works

**Schedule:** Every 5 minutes  
**Configuration:** `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

**What it does each run:**
1. Finds leads created >10 mins ago with status 'NEW' and no reminder sent
2. Processes max 50 leads per run (to avoid timeouts)
3. For each lead:
   - Sends reminder email
   - Marks `reminderSentAt` with current timestamp
4. Logs results

**Monitoring:**
- Go to Vercel → Logs → Filter by "Cron"
- See how many reminders are sent
- Check for any errors

---

## 🎨 Email Templates

Both emails use beautiful HTML templates with:
- ✅ B2Bee logo and branding
- ✅ Orange color scheme (matching your site)
- ✅ Bee emojis 🐝
- ✅ Responsive design (looks great on mobile)
- ✅ Clear call-to-action buttons

Templates are in: `src/lib/emails.ts`

**Customization:**
You can edit the templates to change:
- Copy/messaging
- Styling/colors
- Email structure
- Subject lines

---

## 🔐 Security

**Cron Endpoint Protection:**
The cron endpoint (`/api/cron/send-reminders`) is protected by:
- Authorization header check
- Requires `CRON_SECRET` in Bearer token
- Only Vercel Cron can call it (when deployed)

**Email Best Practices:**
- ✅ Unsubscribe links (can add if needed)
- ✅ Real sender address (not no-reply ideal, but okay)
- ✅ Proper SPF/DKIM setup via Resend
- ✅ Only sends to users who opted in (form submission)

---

## 📈 Monitoring & Metrics

### In Resend Dashboard:
- View email delivery stats
- See bounce rates
- Check open rates (if tracking enabled)
- Review spam reports

### In Your Database:
Query leads with reminders sent:
```sql
SELECT * FROM "Lead" WHERE "reminderSentAt" IS NOT NULL;
```

### In Vercel Logs:
Filter by:
- `[Email]` - See all email sending attempts
- `[Cron]` - See cron job execution
- Search for email addresses to trace specific users

---

## 🐛 Troubleshooting

### Emails Not Sending:
1. **Check domain verification** in Resend
2. **Verify API key** is correct in Vercel
3. **Check Vercel logs** for errors
4. **Test Resend directly** using their dashboard

### Reminder Not Sent:
1. Check if lead was created >10 mins ago
2. Verify lead has status 'NEW' (not 'BOOKED')
3. Check if `reminderSentAt` is null
4. Look for cron job logs in Vercel

### Wrong Email Content:
1. Edit templates in `src/lib/emails.ts`
2. Commit and push changes
3. Vercel will auto-deploy

### Cron Not Running:
1. Verify `vercel.json` exists in repo
2. Check Vercel → Cron Jobs section
3. Cron only works in Production (not Preview)

---

## 🎯 Next Steps (Optional)

### Add More Email Types:
- Follow-up after demo is completed
- Thank you email after booking
- Monthly newsletter
- Product updates

### Track Email Performance:
- Enable Resend tracking
- Add UTM parameters to links
- Monitor click-through rates

### Personalization:
- Include more lead details in emails
- Reference specific bees they're interested in
- Add social proof/testimonials

### A/B Testing:
- Test different subject lines
- Try different send timings
- Experiment with email copy

---

## 📞 Support

**Resend:** https://resend.com/docs  
**Vercel Cron:** https://vercel.com/docs/cron-jobs

Need help? Check Vercel logs for detailed error messages!

