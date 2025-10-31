import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { SmartMarinaPageClient } from '@/components/smart-marina-page-client';

export async function generateMetadata({
  params,
}: {
  params: { identifier: string };
}) {
  const page = await prisma.aBMMarinasPage.findUnique({
    where: { linkedinIdentifier: params.identifier },
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
  params: { identifier: string };
}) {
  const page = await prisma.aBMMarinasPage.findUnique({
    where: { linkedinIdentifier: params.identifier },
  });

  if (!page || !page.isActive) {
    notFound();
  }

  return <SmartMarinaPageClient page={page} />;
}

export const dynamic = 'force-dynamic';

