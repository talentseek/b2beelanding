'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface LeadCaptureDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBeeSlug?: string;
}

export function LeadCaptureDrawer({
  open,
  onOpenChange,
  selectedBeeSlug,
}: LeadCaptureDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          beeSlug: selectedBeeSlug,
          utmSource: new URLSearchParams(window.location.search).get('utm_source'),
          utmMedium: new URLSearchParams(window.location.search).get('utm_medium'),
          utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign'),
          referrer: document.referrer || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit');
      }

      const data = await response.json();

      // Open Cal.com with prefilled data
      const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK || 'https://cal.com';
      const calUrl = new URL(calLink);
      calUrl.searchParams.set('name', data.calPrefill.name);
      calUrl.searchParams.set('email', data.calPrefill.email);
      if (data.calPrefill.notes) {
        calUrl.searchParams.set('notes', data.calPrefill.notes);
      }

      window.open(calUrl.toString(), '_blank');

      // Reset form and close drawer
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        notes: '',
      });
      setError(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting lead:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto flex flex-col p-6 sm:p-8">
        <SheetHeader className="text-left space-y-3">
          <SheetTitle className="text-2xl font-bold">Book Your Free Demo</SheetTitle>
          <SheetDescription className="text-base">
            Fill in your details and we&apos;ll get you set up with a demo call
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-8 flex-1">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">First Name *</Label>
              <Input
                id="firstName"
                required
                className="h-11"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">Last Name *</Label>
              <Input
                id="lastName"
                required
                className="h-11"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              className="h-11"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-medium">Company</Label>
            <Input
              id="company"
              className="h-11"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">Tell us about your needs</Label>
            <Textarea
              id="notes"
              rows={4}
              className="resize-none"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="What would you like to automate?"
            />
          </div>

          <div className="flex flex-col gap-4 pt-6 border-t">
            <div className="text-xs text-muted-foreground leading-relaxed">
              By submitting this form, you consent to us contacting you about B2Bee services.
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Book Your Free Demo'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

