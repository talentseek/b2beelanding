import { db } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Force dynamic rendering and revalidate every 10 seconds
export const dynamic = 'force-dynamic';
export const revalidate = 10;

export default async function AdminDashboard() {
  const [leads, bees, bookings] = await Promise.all([
    db.lead.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { bee: true },
    }),
    db.bee.findMany({
      include: {
        _count: {
          select: { leads: true, bookings: true },
        },
      },
    }),
    db.booking.findMany({
      where: {
        startTime: {
          gte: new Date(),
        },
      },
      take: 5,
      orderBy: { startTime: 'asc' },
      include: { lead: true, bee: true },
    }),
  ]);

  const stats = {
    totalLeads: await db.lead.count(),
    newLeads: await db.lead.count({ where: { status: 'NEW' } }),
    bookedLeads: await db.lead.count({ where: { status: 'BOOKED' } }),
    totalBees: bees.length,
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your bees, leads, and bookings
            <span className="text-xs ml-2">
              • Updated: {new Date().toLocaleTimeString()}
            </span>
          </p>
        </div>
        <form>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            🔄 Refresh
          </button>
        </form>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Booked Demos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bookedLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Bees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBees}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>Latest lead submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Bee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    {lead.firstName} {lead.lastName}
                  </TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.company || '-'}</TableCell>
                  <TableCell>{lead.bee?.name || '-'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        lead.status === 'NEW'
                          ? 'default'
                          : lead.status === 'BOOKED'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
          <CardDescription>Next scheduled demos</CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Bee</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.lead.firstName} {booking.lead.lastName}
                    </TableCell>
                    <TableCell>{booking.bee?.name || '-'}</TableCell>
                    <TableCell>
                      {booking.startTime
                        ? new Date(booking.startTime).toLocaleString()
                        : 'TBD'}
                    </TableCell>
                    <TableCell>
                      <Badge>{booking.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No upcoming bookings
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

