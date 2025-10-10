import { ABMPageForm } from '@/components/abm-page-form';

export default function NewABMPagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New ABM Page</h1>
        <p className="text-muted-foreground mt-1">
          Create a personalized landing page for a new prospect
        </p>
      </div>

      <ABMPageForm />
    </div>
  );
}

