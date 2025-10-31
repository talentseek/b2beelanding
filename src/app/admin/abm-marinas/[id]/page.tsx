'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ABMMarinaForm } from '@/components/abm-marina-form';
import { ArrowLeft } from 'lucide-react';

type MarinaPageData = {
  id: string;
  linkedinIdentifier: string;
  linkedinUrl: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  heroMessage: string;
  isActive: boolean;
};

export default function EditMarinaPageAdmin({ params }: { params: Promise<{ id: string }> }) {
  const [pageData, setPageData] = useState<MarinaPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageId, setPageId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setPageId(p.id));
  }, [params]);

  const fetchPage = useCallback(async () => {
    if (!pageId) return;
    
    try {
      const res = await fetch(`/api/abm-marinas/${pageId}`);
      const data = await res.json();
      setPageData(data.page);
    } catch (error) {
      console.error('Failed to fetch page:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Marina page not found</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/admin/abm-marinas">Back to Marina ABM Pages</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/abm-marinas">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marina ABM Pages
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Marina ABM Page</h1>
        <p className="text-muted-foreground">
          Update the landing page for {pageData.firstName} {pageData.lastName}
        </p>
      </div>

      <ABMMarinaForm initialData={pageData} isEdit />
    </div>
  );
}

export const dynamic = 'force-dynamic';

