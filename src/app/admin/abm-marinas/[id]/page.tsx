'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ABMMarinaForm } from '@/components/abm-marina-form';
import { ArrowLeft } from 'lucide-react';

export default function EditMarinaPageAdmin({ params }: { params: { id: string } }) {
  const [pageData, setPageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPage();
  }, []);

  const fetchPage = async () => {
    try {
      const res = await fetch(`/api/abm-marinas/${params.id}`);
      const data = await res.json();
      setPageData(data.page);
    } catch (error) {
      console.error('Failed to fetch page:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

