import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { BeeDetailClient } from '@/components/bee-detail-client';
import { Metadata } from 'next';

interface BeeDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BeeDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const bee = await db.bee.findUnique({
    where: { slug },
  });

  if (!bee || !bee.isActive) {
    return {
      title: 'Bee Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://b2bee.ai';
  const title = `${bee.name} - ${bee.tagline || 'AI Automation'} | B2Bee`;
  const description = bee.description || `Discover ${bee.name} - your AI-powered automation solution that works 24/7.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/bee/${slug}`,
      type: 'website',
      images: [
        {
          url: bee.icon?.startsWith('/') ? `${siteUrl}${bee.icon}` : `${siteUrl}/logo.png`,
          width: 1200,
          height: 630,
          alt: bee.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [bee.icon?.startsWith('/') ? `${siteUrl}${bee.icon}` : `${siteUrl}/logo.png`],
    },
    alternates: {
      canonical: `${siteUrl}/bee/${slug}`,
    },
  };
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

