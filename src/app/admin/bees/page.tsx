import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 10;

export default async function BeesPage() {
  const bees = await db.bee.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { leads: true, testimonials: true, bookings: true },
      },
    },
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Manage Bees</h1>
          <p className="text-muted-foreground">Configure your AI automation products</p>
        </div>
        <Button>Add New Bee</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bees</CardTitle>
        </CardHeader>
        <CardContent>
          {bees.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Price/Month</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bees.map((bee) => (
                  <TableRow key={bee.id}>
                    <TableCell className="text-2xl">{bee.icon || '🐝'}</TableCell>
                    <TableCell className="font-medium">{bee.name}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {bee.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      {bee.priceMonthly ? `£${bee.priceMonthly}` : 'Custom'}
                    </TableCell>
                    <TableCell>{bee._count.leads}</TableCell>
                    <TableCell>{bee._count.bookings}</TableCell>
                    <TableCell>
                      <Badge variant={bee.isActive ? 'default' : 'secondary'}>
                        {bee.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No bees configured yet</p>
              <Button>
                Create Your First Bee
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

