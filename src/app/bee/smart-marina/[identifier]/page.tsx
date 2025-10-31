import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { SmartMarinaPageClient } from '@/components/smart-marina-page-client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ identifier: string }>;
}) {
  const { identifier } = await params;
  const page = await db.aBMMarinasPage.findUnique({
    where: { linkedinIdentifier: identifier },
  });

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: `Smart Marina Platform for ${page.company} | B2Bee`,
    description: `Hi ${page.firstName}, see how ${page.company} can automate berth management, billing, marketing, and more with our Smart Marina platform.`,
  };
}

export default async function SmartMarinaABMPage({
  params,
}: {
  params: Promise<{ identifier: string }>;
}) {
  const { identifier } = await params;
  const page = await db.aBMMarinasPage.findUnique({
    where: { linkedinIdentifier: identifier },
  });

  if (!page || !page.isActive) {
    notFound();
  }

  return <SmartMarinaPageClient page={page} />;
}

export const dynamic = 'force-dynamic';

