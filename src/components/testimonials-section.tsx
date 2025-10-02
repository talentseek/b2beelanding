'use client';

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface Testimonial {
  id: string;
  author: string;
  role?: string;
  company?: string;
  quote: string;
  rating?: number;
  avatarUrl?: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials.length) return null;

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">What Our Clients Say</h2>
          <p className="text-xl text-muted-foreground">
            Join hundreds of businesses already buzzing with success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="h-full rounded-2xl">
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
                  <p className="text-muted-foreground italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="pt-4 border-t">
                    <p className="font-semibold">{testimonial.author}</p>
                    {testimonial.role && (
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    )}
                    {testimonial.company && (
                      <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

