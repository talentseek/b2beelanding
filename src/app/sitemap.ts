import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

// Make sitemap dynamic to avoid database connection at build time
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://b2bee.ai';

  try {
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
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return a basic sitemap if database is unavailable
    return [
      {
        url: siteUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      // Fallback bee pages (from your default bees)
      {
        url: `${siteUrl}/bee/social-bee`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${siteUrl}/bee/sales-bee`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${siteUrl}/bee/bespoke-bee`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
    ];
  }
}

