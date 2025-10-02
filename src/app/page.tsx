'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/hero-section';
import { BeesGrid } from '@/components/bees-grid';
import { TestimonialsSection } from '@/components/testimonials-section';
import { LeadCaptureDrawer } from '@/components/lead-capture-drawer';
import { Button } from '@/components/ui/button';

interface Bee {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description?: string;
  icon?: string;
  features?: string[];
  priceMonthly?: number;
  testimonials?: Testimonial[];
}

interface Testimonial {
  id: string;
  author: string;
  role?: string;
  company?: string;
  quote: string;
  rating?: number;
  avatarUrl?: string;
}

export default function Home() {
  const [bees, setBees] = useState<Bee[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBeeSlug, setSelectedBeeSlug] = useState<string | undefined>();

  useEffect(() => {
    // Fetch bees from API
    fetch('/api/bees')
      .then((res) => res.json())
      .then((data) => {
        setBees(data.bees || []);
        
        // Collect all testimonials from bees
        const allTestimonials = data.bees
          ?.flatMap((bee: Bee) => bee.testimonials || [])
          .slice(0, 6);
        setTestimonials(allTestimonials || []);
      })
      .catch((err) => {
        console.error('Failed to fetch bees:', err);
        // Set default bees if API fails
        setBees(getDefaultBees());
      });
  }, []);

  const handleBookDemo = (beeSlug?: string) => {
    setSelectedBeeSlug(beeSlug);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="B2Bee" className="h-14 w-auto" />
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#bees" className="text-sm font-medium hover:text-primary transition-colors">
              Our Bees
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </a>
            <a href="#bees" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </a>
          </nav>
          <Button
            onClick={() => handleBookDemo()}
          >
            Book a Demo
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection onBookDemo={() => handleBookDemo()} />

      {/* Bees Section */}
      <div id="bees">
        <BeesGrid bees={bees} />
      </div>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <div id="testimonials">
          <TestimonialsSection testimonials={testimonials} />
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-950/20 dark:to-amber-900/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Put Your Bees to Work?
          </h2>
          <p className="text-xl text-muted-foreground">
            Book a free demo and see how our AI Bees can transform your business
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6"
            onClick={() => handleBookDemo()}
          >
            Book Your Free Demo
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src="/logofooter.png" alt="B2Bee" className="h-12 w-auto" />
              </div>
              <p className="text-sm text-gray-400">
                AI automation for small businesses that works 24/7
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#bees" className="hover:text-white transition-colors">
                    Our Bees
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:text-white transition-colors">
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/about" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} B2Bee.ai. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Lead Capture Drawer */}
      <LeadCaptureDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        selectedBeeSlug={selectedBeeSlug}
      />
    </div>
  );
}

// Default bees if API fails or database is not seeded yet
function getDefaultBees(): Bee[] {
  return [
    {
      id: '1',
      slug: 'social-bee',
      name: 'Social Bee',
      tagline: 'Your 24/7 Social Media Manager',
      description: 'Automates social media posting, engagement, and content creation across all platforms.',
      icon: '/socialbee.png',
      features: [
        'Create engaging content',
        'Schedule posts automatically',
        'Engage with followers',
        'Track performance',
        'Multi-platform support',
      ],
      priceMonthly: 299,
    },
    {
      id: '2',
      slug: 'sales-bee',
      name: 'Sales Bee',
      tagline: 'Your AI Sales Team',
      description: 'Automates prospecting, personalized outreach, and meeting booking to fill your calendar.',
      icon: '/salesbee.png',
      features: [
        'Find ideal prospects',
        'Personalized multichannel outreach',
        'Follow-up sequences',
        'Book meetings automatically',
        'Track and optimize campaigns',
      ],
      priceMonthly: 499,
    },
    {
      id: '3',
      slug: 'bespoke-bee',
      name: 'Bespoke Bee',
      tagline: 'Custom AI Solutions',
      description: 'Tell us your unique workflow and we\'ll build a custom Bee tailored to your business needs.',
      icon: '/bespokebee.png',
      features: [
        'Fully customized automation',
        'Integrate with your tools',
        'Ongoing support and updates',
        'Dedicated success manager',
      ],
    },
  ];
}
