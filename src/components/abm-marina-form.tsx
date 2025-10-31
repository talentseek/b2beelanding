'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type MarinaPageData = {
  id?: string;
  linkedinIdentifier: string;
  linkedinUrl: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  heroMessage: string;
  isActive: boolean;
};

type ABMMarinaFormProps = {
  initialData?: MarinaPageData;
  isEdit?: boolean;
};

export function ABMMarinaForm({ initialData, isEdit = false }: ABMMarinaFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<MarinaPageData>(
    initialData || {
      linkedinIdentifier: '',
      linkedinUrl: '',
      firstName: '',
      lastName: '',
      title: '',
      company: '',
      heroMessage: '',
      isActive: true,
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = isEdit ? `/api/abm-marinas/${initialData?.id}` : '/api/abm-marinas';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/abm-marinas');
        router.refresh();
      } else {
        const error = await res.json();
        alert(`Failed to ${isEdit ? 'update' : 'create'} page: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoFill = () => {
    // Extract identifier from LinkedIn URL
    const urlMatch = formData.linkedinUrl.match(/linkedin\.com\/in\/([^/]+)/);
    if (urlMatch) {
      setFormData({ ...formData, linkedinIdentifier: urlMatch[1] });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Details about the marina prospect</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title/Role</Label>
            <Input
              id="title"
              placeholder="e.g., Marina Director, Harbour Master"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Marina Name *</Label>
            <Input
              id="company"
              placeholder="e.g., Solent Harbour Marina"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL *</Label>
            <Input
              id="linkedinUrl"
              type="url"
              placeholder="https://www.linkedin.com/in/..."
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              required
            />
            <Button type="button" variant="outline" size="sm" onClick={handleAutoFill}>
              Auto-fill Identifier
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinIdentifier">LinkedIn Identifier *</Label>
            <Input
              id="linkedinIdentifier"
              placeholder="e.g., john-smith-marina-director"
              value={formData.linkedinIdentifier}
              onChange={(e) => setFormData({ ...formData, linkedinIdentifier: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              Will be used as: /bee/smart-marina/{formData.linkedinIdentifier || '...'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customization (Optional)</CardTitle>
          <CardDescription>Personalize the landing page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroMessage">Custom Hero Message</Label>
            <Textarea
              id="heroMessage"
              placeholder="Leave empty to use default: Hi {firstName} 👋 Imagine {company} running smoother than ever..."
              value={formData.heroMessage}
              onChange={(e) => setFormData({ ...formData, heroMessage: e.target.value })}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Custom hero message. Leave empty to use the default template.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="isActive">Active</Label>
            {!formData.isActive && <Badge variant="secondary">Page will not be visible</Badge>}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[oklch(0.65_0.22_45)] hover:bg-[oklch(0.60_0.22_45)]"
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Marina Page' : 'Create Marina Page'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/abm-marinas')}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

