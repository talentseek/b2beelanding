'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Anchor,
  CreditCard,
  MessageSquare,
  Wrench,
  Share2,
  CloudRain,
  Check,
  Sparkles,
  TrendingUp,
  Users,
  DollarSign,
  Bell,
} from 'lucide-react';

type MarinaPageData = {
  id: string;
  firstName: string;
  lastName: string;
  title: string | null;
  company: string;
  heroMessage: string | null;
};

type SmartMarinaPageClientProps = {
  page: MarinaPageData;
};

const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK || 'https://cal.com/b2bee';

export function SmartMarinaPageClient({ page }: SmartMarinaPageClientProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Auto-advance through steps
  useEffect(() => {
    const steps = [
      { duration: 4000 }, // Hero
      { duration: 4000 }, // Platform Overview
      { duration: 6000 }, // Berth Management
      { duration: 5000 }, // Billing
      { duration: 5000 }, // Communication
      { duration: 7000 }, // Marketing
      { duration: 4000 }, // Weather
      { duration: 5000 }, // Results
    ];

    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, steps[currentStep].duration);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const heroMessage =
    page.heroMessage ||
    `Hi ${page.firstName} 👋 Imagine ${page.company} running smoother than ever with complete automation`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-blue-950/20 dark:via-cyan-900/10 dark:to-blue-900/20">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl"
        >
          <Badge className="mb-6 text-base px-6 py-2 bg-blue-600 hover:bg-blue-700">
            ⚓ Smart Marina Platform
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {heroMessage}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12">
            Watch how we automate berth management, billing, marketing, and operations—all in one platform
          </p>
        </motion.div>
      </section>

      {/* Platform Overview */}
      {currentStep >= 1 && (
        <section className="min-h-screen flex flex-col items-start justify-center px-4 pt-32">
          <div className="max-w-5xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">The Operating System for Modern Marinas</h2>
              <p className="text-lg text-muted-foreground">
                7 powerful modules working together seamlessly
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.15 } },
              }}
            >
              {[
                { icon: Anchor, title: 'Berth Management', color: 'text-blue-600' },
                { icon: CreditCard, title: 'Automated Billing', color: 'text-green-600' },
                { icon: MessageSquare, title: 'Communication Hub', color: 'text-purple-600' },
                { icon: Wrench, title: 'Maintenance', color: 'text-orange-600' },
                { icon: Share2, title: 'Marketing & Social', color: 'text-pink-600' },
                { icon: CloudRain, title: 'Weather Alerts', color: 'text-cyan-600' },
                { icon: Users, title: 'Customer Portal', color: 'text-indigo-600' },
                { icon: TrendingUp, title: 'Analytics', color: 'text-emerald-600' },
              ].map((module, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <module.icon className={`w-10 h-10 mb-3 ${module.color}`} />
                    <h3 className="font-semibold">{module.title}</h3>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Berth Management */}
      {currentStep >= 2 && (
        <section className="min-h-screen flex flex-col items-start justify-center px-4 pt-32">
          <div className="max-w-4xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <h2 className="text-4xl font-bold mb-3">Live Berth Management</h2>
              <p className="text-lg text-muted-foreground">
                Visual map with drag-and-drop allocation
              </p>
            </motion.div>

            <Card className="p-8 bg-white dark:bg-gray-800">
              <div className="grid grid-cols-6 gap-3">
                {Array.from({ length: 24 }).map((_, i) => {
                  const status = i % 5 === 0 ? 'vacant' : i % 3 === 0 ? 'arriving' : 'occupied';
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                      className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xs font-medium ${
                        status === 'vacant'
                          ? 'bg-green-100 border-green-400 text-green-700'
                          : status === 'arriving'
                          ? 'bg-yellow-100 border-yellow-400 text-yellow-700'
                          : 'bg-blue-100 border-blue-400 text-blue-700'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex gap-6 mt-6 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded"></div>
                  <span>Occupied (15)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded"></div>
                  <span>Vacant (5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span>Arriving (4)</span>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Billing Automation */}
      {currentStep >= 3 && (
        <section className="min-h-screen flex flex-col items-start justify-center px-4 pt-32">
          <div className="max-w-4xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <h2 className="text-4xl font-bold mb-3">Automated Billing & Payments</h2>
              <p className="text-lg text-muted-foreground">
                Never chase payments again—fully automated
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6">
                  <DollarSign className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-bold text-xl mb-2">Recurring Billing</h3>
                  <ul className="space-y-2 text-sm">
                    {['Monthly berth fees', 'Utility charges', 'Service fees', 'Late payment reminders'].map(
                      (item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + i * 0.15 }}
                          className="flex items-center gap-2"
                        >
                          <Check className="w-4 h-4 text-green-600" />
                          {item}
                        </motion.li>
                      )
                    )}
                  </ul>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6">
                  <CreditCard className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-bold text-xl mb-2">Payment Processing</h3>
                  <ul className="space-y-2 text-sm">
                    {[
                      'Stripe & PayPal integration',
                      'Instant payment confirmation',
                      'Digital receipts',
                      'Revenue tracking',
                    ].map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 + i * 0.15 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="w-4 h-4 text-blue-600" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Communication Hub */}
      {currentStep >= 4 && (
        <section className="min-h-screen flex flex-col items-start justify-center px-4 pt-32">
          <div className="max-w-4xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <h2 className="text-4xl font-bold mb-3">Unified Communication Hub</h2>
              <p className="text-lg text-muted-foreground">
                SMS, email, and push notifications from one dashboard
              </p>
            </motion.div>

            <Card className="p-6 bg-white dark:bg-gray-800">
              <AnimatePresence mode="wait">
                {[
                  {
                    type: 'SMS',
                    message: 'Your berth A12 is ready for arrival tomorrow at 10am',
                    time: '2 min ago',
                  },
                  {
                    type: 'Email',
                    message: 'Monthly invoice for March - £450 due in 7 days',
                    time: '1 hour ago',
                  },
                  {
                    type: 'Push',
                    message: 'Weather alert: Strong winds expected this evening',
                    time: '3 hours ago',
                  },
                ].map((notification, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.5 }}
                    className="p-4 border rounded-lg mb-3 flex items-start gap-3"
                  >
                    <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{notification.type}</Badge>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className="text-sm">{notification.message}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Card>
          </div>
        </section>
      )}

      {/* Marketing & Social Media */}
      {currentStep >= 5 && (
        <section className="min-h-screen flex flex-col items-start justify-center px-4 pt-32">
          <div className="max-w-5xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <h2 className="text-4xl font-bold mb-3">Marketing & Social Media Automation</h2>
              <p className="text-lg text-muted-foreground">
                AI-powered content creation and scheduling for {page.company}
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* AI Generator */}
              <Card className="p-6 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-lg">AI Content Generator</h3>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border"
                >
                  <p className="text-sm mb-2 text-muted-foreground">Generated post:</p>
                  <p className="text-sm mb-3">
                    🌊 Beautiful sunset at {page.company} tonight! Our berth holders enjoy premium
                    facilities and stunning views. Book your spot today. ⚓✨
                  </p>
                  <div className="flex gap-2">
                    <Badge>Instagram</Badge>
                    <Badge>Facebook</Badge>
                    <Badge>LinkedIn</Badge>
                  </div>
                </motion.div>
              </Card>

              {/* Scheduling Calendar */}
              <Card className="p-6 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-lg">Content Calendar</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { day: 'Monday', time: '9:00 AM', platform: 'Instagram', status: 'scheduled' },
                    { day: 'Wednesday', time: '2:00 PM', platform: 'Facebook', status: 'scheduled' },
                    { day: 'Friday', time: '11:00 AM', platform: 'LinkedIn', status: 'scheduled' },
                  ].map((post, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.2 }}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">{post.day}</p>
                          <p className="text-xs text-muted-foreground">{post.time}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{post.platform}</Badge>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Weather Alerts */}
      {currentStep >= 6 && (
        <section className="min-h-screen flex flex-col items-start justify-center px-4 pt-32">
          <div className="max-w-4xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <h2 className="text-4xl font-bold mb-3">Real-Time Weather & Tide Alerts</h2>
              <p className="text-lg text-muted-foreground">
                Keep your berth holders informed and safe
              </p>
            </motion.div>

            <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <CloudRain className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Weather Alert Active</h3>
                <p className="text-lg mb-4">Strong winds expected: 25-30 knots from SW</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold">18°C</p>
                    <p className="text-sm opacity-90">Temperature</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">25kt</p>
                    <p className="text-sm opacity-90">Wind Speed</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">5.2m</p>
                    <p className="text-sm opacity-90">Tide Height</p>
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 p-3 bg-white/20 rounded"
                >
                  <p className="text-sm">✓ All berth holders notified via SMS and app</p>
                </motion.div>
              </motion.div>
            </Card>
          </div>
        </section>
      )}

      {/* Results Dashboard */}
      {currentStep >= 7 && (
        <section className="min-h-screen flex flex-col items-start justify-center px-4 pt-32">
          <div className="max-w-4xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <h2 className="text-4xl font-bold mb-3">Transform {page.company}</h2>
              <p className="text-lg text-muted-foreground">
                Expected impact in the first 90 days
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: 'Time Saved', value: '40+ hrs/week', icon: TrendingUp, color: 'text-green-600' },
                { title: 'Occupancy Rate', value: '+25%', icon: Anchor, color: 'text-blue-600' },
                { title: 'Revenue Growth', value: '+£18k/month', icon: DollarSign, color: 'text-emerald-600' },
                {
                  title: 'Customer Satisfaction',
                  value: '4.8★',
                  icon: Users,
                  color: 'text-yellow-600',
                },
              ].map((metric, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                >
                  <Card className="p-6">
                    <metric.icon className={`w-8 h-8 mb-2 ${metric.color}`} />
                    <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
                    <p className="text-3xl font-bold">{metric.value}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to modernize {page.company}, {page.firstName}?
            </h2>
            <p className="text-muted-foreground mb-6">
              Book a 30-minute demo to see the Smart Marina platform in action
            </p>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
              asChild
            >
              <a href={calLink} target="_blank" rel="noopener noreferrer">
                <Calendar className="w-5 h-5 mr-2" />
                Book Your 30-Min Demo
              </a>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <img src="/logofooter.png" alt="B2Bee" className="h-8 w-auto" />
          </div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} B2Bee.ai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

