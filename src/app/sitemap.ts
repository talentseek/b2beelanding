import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://b2bee.ai';

  // Fetch all active bees
  const bees = await db.bee.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const beePages = bees.map((bee) => ({
    url: `${siteUrl}/bee/${bee.slug}`,
    lastModified: bee.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...beePages,
  ];
}

