import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ExternalLink, Eye, Pencil, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export default async function ABMPagesAdminPage() {
  const abmPages = await db.aBMPage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ABM Pages</h1>
          <p className="text-muted-foreground mt-1">
            Manage personalized landing pages for prospects
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/abm-pages/new">
            <Plus className="w-4 h-4 mr-2" />
            New ABM Page
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {abmPages.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              No ABM pages created yet. Create your first personalized landing page!
            </p>
            <Button asChild>
              <Link href="/admin/abm-pages/new">
                <Plus className="w-4 h-4 mr-2" />
                Create First ABM Page
              </Link>
            </Button>
          </Card>
        ) : (
          abmPages.map((page) => {
            const mockLeads = page.mockLeads as Array<{ name: string; company: string; title: string }> || [];
            const mockCompanies = page.mockCompanies as string[] || [];
            const benefitPoints = page.benefitPoints as string[] || [];
            
            return (
              <Card key={page.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold">
                        {page.firstName} {page.lastName}
                      </h3>
                      <Badge variant={page.isActive ? 'default' : 'secondary'}>
                        {page.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Company:</span>{' '}
                        <span className="font-medium">{page.company}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Title:</span>{' '}
                        <span className="font-medium">{page.title || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Target Market:</span>{' '}
                        <span className="font-medium">{page.targetMarket}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Location:</span>{' '}
                        <span className="font-medium">{page.targetLocation}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-muted-foreground">LinkedIn:</span>{' '}
                        <a
                          href={page.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          {page.linkedinUrl}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div>{mockCompanies.length} companies</div>
                      <div>{mockLeads.length} leads</div>
                      <div>{benefitPoints.length} benefits</div>
                    </div>

                    <div className="pt-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        /bee/sales-bee/{page.linkedinIdentifier}
                      </code>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/bee/sales-bee/${page.linkedinIdentifier}`} target="_blank">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/abm-pages/${page.id}`}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

