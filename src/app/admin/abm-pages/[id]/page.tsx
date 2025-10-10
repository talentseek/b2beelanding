import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { ABMPageForm } from '@/components/abm-page-form';

interface EditABMPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditABMPagePage({ params }: EditABMPageProps) {
  const { id } = await params;

  const abmPage = await db.aBMPage.findUnique({
    where: { id },
  });

  if (!abmPage) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Edit ABM Page: {abmPage.firstName} {abmPage.lastName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Update the personalized landing page for this prospect
        </p>
      </div>

      <ABMPageForm abmPage={abmPage} />
    </div>
  );
}

