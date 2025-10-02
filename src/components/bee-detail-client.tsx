'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LeadCaptureDrawer } from '@/components/lead-capture-drawer';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Bee {
  id: string;
  slug: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  icon?: string | null;
  features?: unknown;
  priceMonthly?: number | null;
  testimonials: Testimonial[];
}

interface Testimonial {
  id: string;
  author: string;
  role?: string | null;
  company?: string | null;
  quote: string;
  rating?: number | null;
}

interface BeeDetailClientProps {
  bee: Bee;
}

export function BeeDetailClient({ bee }: BeeDetailClientProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const features = bee.features as string[] | null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-20 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="B2Bee" className="h-14 w-auto" />
          </Link>
          <Button onClick={() => setDrawerOpen(true)}>Book a Demo</Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-amber-50 via-white to-amber-100/50 dark:from-amber-950/20 dark:via-background dark:to-amber-900/10 overflow-hidden">
        {/* Animated bee elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Bee 1: Left to Right - Top (flipped to face right) */}
          <motion.div
            className="absolute text-8xl opacity-30"
            style={{ left: '-10%', top: '10%', transform: 'scaleX(-1)' }}
            animate={{
              left: ['0%', '100%'],
              top: ['10%', '15%', '10%'],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            🐝
          </motion.div>
          
          {/* Bee 2: Right to Left - Bottom (normal, faces left) */}
          <motion.div
            className="absolute text-7xl opacity-35"
            style={{ left: '100%', top: '70%' }}
            animate={{
              left: ['100%', '-10%'],
              top: ['70%', '65%', '70%'],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'linear',
              delay: 3,
            }}
          >
            🐝
          </motion.div>
          
          {/* Bee 3: Left to Right - Middle (flipped to face right) */}
          <motion.div
            className="absolute text-6xl opacity-25"
            style={{ left: '-10%', top: '40%', transform: 'scaleX(-1)' }}
            animate={{
              left: ['-10%', '110%'],
              top: ['40%', '45%', '40%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
              delay: 7,
            }}
          >
            🐝
          </motion.div>
          
          {/* Bee 4: Right to Left - Top-Middle (normal, faces left) */}
          <motion.div
            className="absolute text-7xl opacity-30"
            style={{ left: '110%', top: '25%' }}
            animate={{
              left: ['110%', '-10%'],
              top: ['25%', '30%', '25%'],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: 'linear',
              delay: 10,
            }}
          >
            🐝
          </motion.div>
          
          {/* Bee 5: Left to Right - Bottom-Middle (flipped to face right) */}
          <motion.div
            className="absolute text-6xl opacity-28"
            style={{ left: '-10%', top: '55%', transform: 'scaleX(-1)' }}
            animate={{
              left: ['-10%', '110%'],
              top: ['55%', '50%', '55%'],
            }}
            transition={{
              duration: 19,
              repeat: Infinity,
              ease: 'linear',
              delay: 14,
            }}
          >
            🐝
          </motion.div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="flex justify-center mb-8">
            {bee.icon && bee.icon.startsWith('/') ? (
              <img src={bee.icon} alt={bee.name} className="w-56 h-56 md:w-64 md:h-64 object-contain" />
            ) : (
              <div className="text-9xl">{bee.icon || '🐝'}</div>
            )}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">{bee.name}</h1>
          {bee.tagline && (
            <p className="text-2xl text-muted-foreground">{bee.tagline}</p>
          )}
          {bee.priceMonthly && (
            <div className="space-y-2">
              <Badge variant="secondary" className="text-xl px-6 py-2">
                From £{bee.priceMonthly}/month
              </Badge>
              <p className="text-sm text-muted-foreground">Set-up fees apply.</p>
            </div>
          )}
          <div className="pt-4">
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => setDrawerOpen(true)}
            >
              Book a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Description */}
      {bee.description && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-center leading-relaxed">{bee.description}</p>
          </div>
        </section>
      )}

      {/* Features */}
      {features && features.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">✓</span>
                      <p className="text-lg">{feature}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {bee.testimonials.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              What Our Customers Say
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bee.testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent className="pt-6 space-y-4">
                    {testimonial.rating && (
                      <div className="flex gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <span key={i} className="text-amber-500">
                            ⭐
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-muted-foreground italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="pt-4 border-t">
                      <p className="font-semibold">{testimonial.author}</p>
                      {testimonial.role && (
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      )}
                      {testimonial.company && (
                        <p className="text-sm text-muted-foreground">
                          {testimonial.company}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-950/20 dark:to-amber-900/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Get Started with {bee.name}?
          </h2>
          <p className="text-xl text-muted-foreground">
            Book a free demo and see how it can transform your business
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6"
            onClick={() => setDrawerOpen(true)}
          >
            Book Your Free Demo
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/" className="inline-flex items-center justify-center mb-4">
            <img src="/logofooter.png" alt="B2Bee" className="h-12 w-auto" />
          </Link>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} B2Bee.ai. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Lead Capture Drawer */}
      <LeadCaptureDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        selectedBeeSlug={bee.slug}
      />
    </div>
  );
}

