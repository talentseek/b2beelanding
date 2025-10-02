'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface HeroSectionProps {
  onBookDemo: () => void;
}

export function HeroSection({ onBookDemo }: HeroSectionProps) {
  const [videoOpen, setVideoOpen] = useState(false);
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100/50 dark:from-amber-950/20 dark:via-background dark:to-amber-900/10" />
      
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

      <div className="relative max-w-5xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight flex items-center justify-center gap-4 flex-wrap">
            <span>Buzzing Into Business</span>
            <img src="/newbuzz.png" alt="Bee" className="w-24 h-24 md:w-32 md:h-32 inline-block object-contain" />
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            We help small businesses work smarter, faster, and at a fraction of the
            cost — with AI solutions that never stop buzzing.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            size="lg"
            className="text-lg px-8 py-6"
            onClick={onBookDemo}
          >
            Book a Demo
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8 py-6"
            onClick={() => setVideoOpen(true)}
          >
            <Play className="mr-2 h-5 w-5" />
            Watch Video
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-12 space-y-4"
        >
          <div className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">
            Our Bees Work 24/7
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base max-w-4xl mx-auto">
            {[
              'No days off',
              'No sick days',
              'No tea breaks',
              'No vape breaks',
              'No HR issues',
              'No recruitment fees',
            ].map((benefit, i) => (
              <motion.span
                key={benefit}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                className="px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-foreground font-medium"
              >
                {benefit}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Video Dialog */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-5xl w-full p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>B2Bee Video</DialogTitle>
            <DialogDescription>Watch our introduction video</DialogDescription>
          </DialogHeader>
          <div className="relative w-full aspect-video bg-black">
            <video
              className="w-full h-full"
              controls
              autoPlay
              src="/swarm.mp4"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

