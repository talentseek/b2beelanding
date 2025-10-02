import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { BeeDetailClient } from '@/components/bee-detail-client';

interface BeeDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BeeDetailPage({ params }: BeeDetailPageProps) {
  const { slug } = await params;
  
  const bee = await db.bee.findUnique({
    where: { slug },
    include: {
      testimonials: {
        take: 6,
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!bee || !bee.isActive) {
    notFound();
  }

  return <BeeDetailClient bee={bee} />;
}

