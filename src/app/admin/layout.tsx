'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from '@/lib/auth-client';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut();
    router.push('/sign-in');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-20 items-center px-4">
          <div className="flex items-center gap-6 mr-8">
            <Link href="/admin" className="flex items-center gap-3">
              <img src="/logo.png" alt="B2Bee Admin" className="h-12 w-auto" />
              <span className="font-bold text-xl">Admin</span>
            </Link>
          </div>
          <nav className="flex gap-6 flex-1">
            <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/bees" className="text-sm font-medium hover:text-primary transition-colors">
              Bees
            </Link>
            <Link
              href="/admin/testimonials"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="/admin/abm-pages"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              ABM Pages
            </Link>
            <Link
              href="/admin/abm-marinas"
              className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
            >
              ⚓ ABM Marinas
            </Link>
            <Link
              href="/admin/boat-fund"
              className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
            >
              ⛵ Boat Fund
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {session?.user?.email && (
              <span className="text-sm text-muted-foreground">
                {session.user.email}
              </span>
            )}
            <Link href="/">
              <Button variant="outline">View Site</Button>
            </Link>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

