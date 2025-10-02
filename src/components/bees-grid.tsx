'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Bee {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description?: string;
  icon?: string;
  features?: string[];
  priceMonthly?: number;
}

interface BeesGridProps {
  bees: Bee[];
}

export function BeesGrid({ bees }: BeesGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-amber-50/30 dark:from-background dark:to-amber-950/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">Meet Your AI Bees</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect Bee to automate your business tasks and free up your time
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {bees.map((bee) => (
            <motion.div key={bee.id} variants={item}>
              <Card className="h-full hover:shadow-xl transition-shadow duration-300 rounded-2xl">
                <CardHeader>
                  <div className="w-48 h-48 mx-auto mb-6 flex items-center justify-center">
                    {bee.icon && bee.icon.startsWith('/') ? (
                      <img src={bee.icon} alt={bee.name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-8xl">{bee.icon || '🐝'}</div>
                    )}
                  </div>
                  <CardTitle className="text-2xl text-center">{bee.name}</CardTitle>
                  {bee.tagline && (
                    <CardDescription className="text-base">{bee.tagline}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {bee.description && (
                    <p className="text-muted-foreground">{bee.description}</p>
                  )}
                  
                  {bee.features && Array.isArray(bee.features) && bee.features.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Key Features:</p>
                      <ul className="space-y-1">
                        {bee.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start">
                            <span className="mr-2">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {bee.priceMonthly && (
                    <div className="pt-4">
                      <Badge variant="secondary" className="text-base px-3 py-1">
                        From £{bee.priceMonthly}/month
                      </Badge>
                    </div>
                  )}

                  <Link href={`/bee/${bee.slug}`} className="w-full">
                    <Button className="w-full mt-4">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

