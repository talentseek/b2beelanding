import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { ABMPageClient } from '@/components/abm-page-client';
import { Metadata } from 'next';

interface ABMPageProps {
  params: Promise<{
    identifier: string;
  }>;
}

export async function generateMetadata({
  params,
}: ABMPageProps): Promise<Metadata> {
  const { identifier } = await params;

  const abmPage = await db.aBMPage.findUnique({
    where: { linkedinIdentifier: identifier },
  });

  if (!abmPage || !abmPage.isActive) {
    return {
      title: 'Page Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://b2bee.ai';
  const title = `${abmPage.firstName}, See How Sales Bee Can Transform ${abmPage.company}`;
  const description = `Personalized demo for ${abmPage.firstName} ${abmPage.lastName} showing how Sales Bee automates outreach to ${abmPage.targetMarket}.`;

  return {
    title,
    description,
    robots: {
      index: false, // Don't index personalized ABM pages
      follow: false,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/bee/sales-bee/${identifier}`,
      type: 'website',
      images: [
        {
          url: `${siteUrl}/salesbee.png`,
          width: 1200,
          height: 630,
          alt: 'Sales Bee - AI Sales Automation',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/salesbee.png`],
    },
  };
}

export default async function ABMPage({ params }: ABMPageProps) {
  const { identifier } = await params;

  const abmPage = await db.aBMPage.findUnique({
    where: { linkedinIdentifier: identifier },
  });

  if (!abmPage || !abmPage.isActive) {
    notFound();
  }

  return <ABMPageClient abmPage={abmPage} />;
}

