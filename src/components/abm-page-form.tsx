'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface ABMPageFormProps {
  abmPage?: {
    id: string;
    linkedinIdentifier: string;
    linkedinUrl: string;
    firstName: string;
    lastName: string;
    title: string | null;
    company: string;
    targetMarket: string;
    targetLocation: string;
    mockCompanies: unknown;
    mockLeads: unknown;
    mockAnalytics: unknown;
    heroMessage: string | null;
    benefitPoints: unknown;
    isActive: boolean;
  };
}

export function ABMPageForm({ abmPage }: ABMPageFormProps) {
  const router = useRouter();
  const isEditing = !!abmPage;

  const [formData, setFormData] = useState({
    linkedinIdentifier: abmPage?.linkedinIdentifier || '',
    linkedinUrl: abmPage?.linkedinUrl || '',
    firstName: abmPage?.firstName || '',
    lastName: abmPage?.lastName || '',
    title: abmPage?.title || '',
    company: abmPage?.company || '',
    targetMarket: abmPage?.targetMarket || '',
    targetLocation: abmPage?.targetLocation || '',
    mockCompanies: JSON.stringify(abmPage?.mockCompanies || [], null, 2),
    mockLeads: JSON.stringify(abmPage?.mockLeads || [], null, 2),
    mockAnalytics: JSON.stringify(
      abmPage?.mockAnalytics || { replies: 0, meetings: 0, openRate: 0, replyRate: 0 },
      null,
      2
    ),
    heroMessage: abmPage?.heroMessage || '',
    benefitPoints: JSON.stringify(abmPage?.benefitPoints || [], null, 2),
    isActive: abmPage?.isActive ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate JSON fields
      const mockCompanies = JSON.parse(formData.mockCompanies);
      const mockLeads = JSON.parse(formData.mockLeads);
      const mockAnalytics = JSON.parse(formData.mockAnalytics);
      const benefitPoints = JSON.parse(formData.benefitPoints);

      const payload = {
        linkedinIdentifier: formData.linkedinIdentifier,
        linkedinUrl: formData.linkedinUrl,
        firstName: formData.firstName,
        lastName: formData.lastName,
        title: formData.title || null,
        company: formData.company,
        targetMarket: formData.targetMarket,
        targetLocation: formData.targetLocation,
        mockCompanies,
        mockLeads,
        mockAnalytics,
        heroMessage: formData.heroMessage || null,
        benefitPoints,
        isActive: formData.isActive,
      };

      const url = isEditing ? `/api/abm-pages/${abmPage.id}` : '/api/abm-pages';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save ABM page');
      }

      router.push('/admin/abm-pages');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing) return;
    if (!confirm('Are you sure you want to delete this ABM page?')) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/abm-pages/${abmPage.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete ABM page');
      }

      router.push('/admin/abm-pages');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
      setIsSubmitting(false);
    }
  };

  const generateIdentifier = () => {
    if (formData.linkedinUrl) {
      const match = formData.linkedinUrl.match(/linkedin\.com\/in\/([^/]+)/);
      if (match) {
        setFormData({ ...formData, linkedinIdentifier: match[1] });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/admin/abm-pages">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to ABM Pages
          </Link>
        </Button>
        <div className="flex gap-2">
          {isEditing && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save ABM Page'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Card className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., CEO, Director"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL *</Label>
              <div className="flex gap-2">
                <Input
                  id="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://www.linkedin.com/in/example/"
                  required
                />
                <Button type="button" variant="outline" onClick={generateIdentifier}>
                  Auto-fill Identifier
                </Button>
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="linkedinIdentifier">LinkedIn Identifier (URL slug) *</Label>
              <Input
                id="linkedinIdentifier"
                value={formData.linkedinIdentifier}
                onChange={(e) => setFormData({ ...formData, linkedinIdentifier: e.target.value })}
                placeholder="e.g., jsmith"
                required
                disabled={isEditing}
              />
              <p className="text-xs text-muted-foreground">
                Will be used as: /bee/sales-bee/{formData.linkedinIdentifier || 'identifier'}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Target Market</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetMarket">Target Market *</Label>
              <Input
                id="targetMarket"
                value={formData.targetMarket}
                onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                placeholder="e.g., Plumbers, Electricians and Carpenters"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetLocation">Target Location *</Label>
              <Input
                id="targetLocation"
                value={formData.targetLocation}
                onChange={(e) => setFormData({ ...formData, targetLocation: e.target.value })}
                placeholder="e.g., London, United Kingdom"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Simulation Data (JSON)</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mockCompanies">Mock Companies (Array of strings)</Label>
              <Textarea
                id="mockCompanies"
                value={formData.mockCompanies}
                onChange={(e) => setFormData({ ...formData, mockCompanies: e.target.value })}
                rows={6}
                className="font-mono text-sm"
                placeholder='["Company 1", "Company 2", "Company 3"]'
              />
              <p className="text-xs text-muted-foreground">
                JSON array of company names that will appear in the simulation
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mockLeads">
                Mock Leads (Array of objects with name, company, title)
              </Label>
              <Textarea
                id="mockLeads"
                value={formData.mockLeads}
                onChange={(e) => setFormData({ ...formData, mockLeads: e.target.value })}
                rows={10}
                className="font-mono text-sm"
                placeholder='[{"name": "John Smith", "company": "Company 1", "title": "CEO"}]'
              />
              <p className="text-xs text-muted-foreground">
                JSON array of lead objects with name, company, and title fields
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mockAnalytics">
                Mock Analytics (Object with replies, meetings, openRate, replyRate)
              </Label>
              <Textarea
                id="mockAnalytics"
                value={formData.mockAnalytics}
                onChange={(e) => setFormData({ ...formData, mockAnalytics: e.target.value })}
                rows={6}
                className="font-mono text-sm"
                placeholder='{"replies": 47, "meetings": 12, "openRate": 68, "replyRate": 24}'
              />
              <p className="text-xs text-muted-foreground">
                JSON object with numeric values for the analytics dashboard
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefitPoints">Benefit Points (Array of strings)</Label>
              <Textarea
                id="benefitPoints"
                value={formData.benefitPoints}
                onChange={(e) => setFormData({ ...formData, benefitPoints: e.target.value })}
                rows={6}
                className="font-mono text-sm"
                placeholder='["Benefit 1", "Benefit 2", "Benefit 3"]'
              />
              <p className="text-xs text-muted-foreground">
                JSON array of benefit strings that appear in the hero section
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Customization (Optional)</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroMessage">Custom Hero Message</Label>
              <Textarea
                id="heroMessage"
                value={formData.heroMessage}
                onChange={(e) => setFormData({ ...formData, heroMessage: e.target.value })}
                rows={3}
                placeholder="Leave empty to use default: Hi {firstName} 👋 Imagine filling {company}'s pipeline..."
              />
              <p className="text-xs text-muted-foreground">
                Custom hero message. Leave empty to use the default template.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Active (visible to prospects)</Label>
            </div>
          </div>
        </div>
      </Card>
    </form>
  );
}

