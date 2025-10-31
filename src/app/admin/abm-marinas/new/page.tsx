import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ABMMarinaForm } from '@/components/abm-marina-form';
import { ArrowLeft } from 'lucide-react';

export default function NewMarinaPageAdmin() {
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
        <h1 className="text-3xl font-bold mb-2">Create New Marina ABM Page</h1>
        <p className="text-muted-foreground">
          Create a personalized landing page for a new marina prospect
        </p>
      </div>

      <ABMMarinaForm />
    </div>
  );
}

