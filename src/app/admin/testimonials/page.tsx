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
import { Button } from '@/components/ui/button';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 10;

export default async function TestimonialsPage() {
  const testimonials = await db.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
    include: { bee: true },
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Manage Testimonials</h1>
          <p className="text-muted-foreground">
            Customer reviews and social proof
          </p>
        </div>
        <Button>
          Add New Testimonial
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Testimonials</CardTitle>
        </CardHeader>
        <CardContent>
          {testimonials.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Role/Company</TableHead>
                  <TableHead>Quote</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Bee</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell className="font-medium">
                      {testimonial.author}
                    </TableCell>
                    <TableCell>
                      {[testimonial.role, testimonial.company]
                        .filter(Boolean)
                        .join(' at ')}
                    </TableCell>
                    <TableCell className="max-w-md truncate">
                      {testimonial.quote}
                    </TableCell>
                    <TableCell>
                      {testimonial.rating ? (
                        <div className="flex gap-1">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <span key={i}>⭐</span>
                          ))}
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{testimonial.bee?.name || 'General'}</TableCell>
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
              <p className="text-muted-foreground mb-4">
                No testimonials added yet
              </p>
              <Button>
                Add Your First Testimonial
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

