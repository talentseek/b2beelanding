'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Plus, Pencil, Trash2 } from 'lucide-react';

type MarinaPage = {
  id: string;
  linkedinIdentifier: string;
  linkedinUrl: string;
  firstName: string;
  lastName: string;
  title: string | null;
  company: string;
  heroMessage: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function ABMMarinasPagesAdmin() {
  const [pages, setPages] = useState<MarinaPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/abm-marinas');
      const data = await res.json();
      setPages(data.pages || []);
    } catch (error) {
      console.error('Failed to fetch marina pages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this marina ABM page?')) return;

    try {
      const res = await fetch(`/api/abm-marinas/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPages(); // Refresh list
      } else {
        alert('Failed to delete page');
      }
    } catch (error) {
      console.error('Failed to delete page:', error);
      alert('Failed to delete page');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading marina ABM pages...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">⚓ Marina ABM Pages</h1>
          <p className="text-muted-foreground">
            Manage personalized landing pages for marina prospects
          </p>
        </div>
        <Button asChild className="bg-[oklch(0.65_0.22_45)] hover:bg-[oklch(0.60_0.22_45)]">
          <Link href="/admin/abm-marinas/new">
            <Plus className="w-4 h-4 mr-2" />
            Create New Marina Page
          </Link>
        </Button>
      </div>

      {pages.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <p className="mb-4">No marina ABM pages yet.</p>
              <Button asChild variant="outline">
                <Link href="/admin/abm-marinas/new">Create your first marina page</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pages.map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {page.firstName} {page.lastName}
                      {!page.isActive && <Badge variant="secondary">Inactive</Badge>}
                    </CardTitle>
                    <CardDescription>
                      {page.title && `${page.title} • `}
                      {page.company}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/bee/smart-marina/${page.linkedinIdentifier}`} target="_blank">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Page
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/abm-marinas/${page.id}`}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(page.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">URL:</span>{' '}
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      /bee/smart-marina/{page.linkedinIdentifier}
                    </code>
                  </div>
                  <div>
                    <span className="font-medium">LinkedIn:</span>{' '}
                    <a
                      href={page.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {page.linkedinUrl}
                    </a>
                  </div>
                  {page.heroMessage && (
                    <div>
                      <span className="font-medium">Custom Hero:</span> {page.heroMessage}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 10;

