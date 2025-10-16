'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Building2,
  MessageSquare,
  Rocket,
  TrendingUp,
  CheckCircle2,
  Linkedin,
  Mail,
  Phone,
  BarChart3,
  Calendar,
  Target,
} from 'lucide-react';

// Generic hardcoded data
const DEMO_DATA = {
  firstName: 'there',
  company: 'your business',
  targetMarket: 'Small Business Owners, Consultants and Freelancers',
  targetLocation: 'United Kingdom',
  companies: [
    'Acme Consulting Ltd',
    'Prime Solutions Group',
    'Summit Business Partners',
    'Vertex Enterprises',
  ],
  leads: [
    { name: 'Sarah Johnson', company: 'Acme Consulting Ltd', title: 'Managing Director' },
    { name: 'James Mitchell', company: 'Prime Solutions Group', title: 'CEO' },
    { name: 'Emma Wilson', company: 'Summit Business Partners', title: 'Operations Director' },
    { name: 'David Brown', company: 'Vertex Enterprises', title: 'Business Development Manager' },
    { name: 'Rachel Thompson', company: 'Nexus Professional Services', title: 'Head of Sales' },
    { name: 'Michael Roberts', company: 'Apex Strategy Group', title: 'Partner' },
  ],
  analytics: {
    replies: 47,
    meetings: 12,
    openRate: 68,
    replyRate: 23,
  },
  benefits: [
    'Automate your outreach 24/7',
    'Target ideal prospects perfectly',
    'Personalized multichannel sequences',
    'Fill your pipeline on autopilot',
  ],
};

export default function DemoPage() {
  const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK || 'https://cal.com/b2bee';

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="B2Bee" className="h-10 w-auto" />
          </div>
          <Button asChild className="bg-[oklch(0.65_0.22_45)] hover:bg-[oklch(0.60_0.22_45)]">
            <a href={calLink} target="_blank" rel="noopener noreferrer">
              Book Your Demo
            </a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection calLink={calLink} />

      {/* Step 1: Create Campaign with AI */}
      <CreateCampaignSection />

      {/* Step 2: Finding Companies */}
      <FindingCompaniesSection />

      {/* Step 3: Finding Leads */}
      <FindingLeadsSection />

      {/* Step 4: Building Sequences */}
      <BuildingSequencesSection />

      {/* Step 5: Launch Campaign */}
      <LaunchCampaignSection />

      {/* Step 6: Analytics Dashboard */}
      <AnalyticsSection />

      {/* Final CTA */}
      <FinalCTASection calLink={calLink} />

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logofooter.png" alt="B2Bee" className="h-10 w-auto" />
          </div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} B2Bee.ai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Hero Section Component
function HeroSection({ calLink }: { calLink: string }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-900/10 min-h-screen flex items-center justify-center px-4">
      {/* Floating Bees Background */}
      <FloatingBees />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <div className="inline-block">
            <Badge className="text-lg px-4 py-2 mb-4 bg-[oklch(0.65_0.22_45)] hover:bg-[oklch(0.60_0.22_45)]">
              Sales Bee Demo
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Fill Your Pipeline
            <br />
            While You Sleep 🐝
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Watch how Sales Bee can automate your outreach and book meetings on autopilot
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {DEMO_DATA.benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md"
              >
                <CheckCircle2 className="w-5 h-5 text-[oklch(0.65_0.22_45)]" />
                <span className="font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-8"
          >
            <Button size="lg" className="text-lg px-8 py-6 bg-[oklch(0.65_0.22_45)] hover:bg-[oklch(0.60_0.22_45)]" asChild>
              <a href="#step1">See Sales Bee in Action ↓</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Step 1: Create Campaign with AI
function CreateCampaignSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [typedText, setTypedText] = useState('');
  const fullText = `${DEMO_DATA.targetMarket} in ${DEMO_DATA.targetLocation}`;

  useEffect(() => {
    if (!isInView) {
      setTypedText('');
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setTimeout(() => {
          setTypedText('');
          currentIndex = 0;
        }, 2000);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isInView, fullText]);

  return (
    <section
      id="step1"
      ref={ref}
      className="min-h-screen flex items-center justify-center px-4 py-20"
    >
      <div className="max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-[oklch(0.65_0.22_45)]/20 flex items-center justify-center">
              <span className="text-xl font-bold text-[oklch(0.65_0.22_45)]">1</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Create Your Campaign with AI</h2>
          <p className="text-xl text-muted-foreground">
            Just tell Sales Bee who you want to reach
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-[oklch(0.65_0.22_45)]" />
                <h3 className="text-xl font-semibold">Campaign Creator AI</h3>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Who do you want to target?
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={typedText}
                    readOnly
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-[oklch(0.65_0.22_45)] rounded-lg text-lg font-mono"
                    placeholder="e.g. Small Business Owners in London..."
                  />
                  {typedText && typedText.length < fullText.length && (
                    <motion.div
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[oklch(0.65_0.22_45)]"
                    />
                  )}
                </div>
              </div>

              {typedText.length === fullText.length && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-[oklch(0.65_0.22_45)]"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Perfect! AI is analyzing your target market...</span>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

// Step 2: Finding Companies
function FindingCompaniesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [visibleCompanies, setVisibleCompanies] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isInView) {
      setVisibleCompanies(0);
      setIsAnimating(false);
      return;
    }

    if (isAnimating) return;

    setIsAnimating(true);
    let currentCount = 0;

    // Small delay before starting
    setTimeout(() => {
      const interval = setInterval(() => {
        if (currentCount < DEMO_DATA.companies.length) {
          currentCount++;
          setVisibleCompanies(currentCount);
        } else {
          clearInterval(interval);
          // Reset after showing all
          setTimeout(() => {
            setVisibleCompanies(0);
            setIsAnimating(false);
          }, 2500);
        }
      }, 400);
    }, 300);
  }, [isInView, isAnimating]);

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-start justify-center px-4 pt-32 pb-20 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-900/10"
    >
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-[oklch(0.65_0.22_45)]/20 flex items-center justify-center">
              <span className="text-xl font-bold text-[oklch(0.65_0.22_45)]">2</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-3">Finding Companies</h2>
          <p className="text-lg text-muted-foreground">
            AI is scanning databases to find your ideal prospects
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {DEMO_DATA.companies.slice(0, visibleCompanies).map((company, index) => (
            <motion.div
              key={`${company}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-5 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[oklch(0.65_0.22_45)]/20 to-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-[oklch(0.65_0.22_45)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">{company}</h3>
                    <p className="text-xs text-muted-foreground">Active company</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {visibleCompanies > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Found {visibleCompanies} of {DEMO_DATA.companies.length} companies
            </Badge>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Step 3: Finding Leads
function FindingLeadsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [visibleLeads, setVisibleLeads] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setVisibleLeads(0);
      return;
    }

    const interval = setInterval(() => {
      setVisibleLeads((prev) => {
        if (prev < DEMO_DATA.leads.length) {
          return prev + 1;
        } else {
          setTimeout(() => setVisibleLeads(0), 2000);
          return prev;
        }
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-start justify-center px-4 pt-32 pb-20"
    >
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-[oklch(0.65_0.22_45)]/20 flex items-center justify-center">
              <span className="text-xl font-bold text-[oklch(0.65_0.22_45)]">3</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-3">Finding Decision Makers</h2>
          <p className="text-lg text-muted-foreground">
            Identifying the right people at each company
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-3 max-w-3xl mx-auto">
          {DEMO_DATA.leads.slice(0, visibleLeads).map((lead, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-950/20 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[oklch(0.65_0.22_45)] to-amber-500 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                    {lead.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-base truncate">{lead.name}</h3>
                      <Linkedin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{lead.title}</p>
                    <p className="text-xs font-medium truncate">{lead.company}</p>
                  </div>
                  <Target className="w-4 h-4 text-[oklch(0.65_0.22_45)] flex-shrink-0" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {visibleLeads > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Found {visibleLeads} qualified leads
            </Badge>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Step 4: Building Sequences
function BuildingSequencesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [activeStep, setActiveStep] = useState(0);

  const sequence = [
    { icon: Linkedin, label: 'LinkedIn Connection Request', color: 'blue', delay: '+0 days' },
    { icon: Linkedin, label: 'LinkedIn Initial Message', color: 'blue', delay: '+2 days' },
    { icon: Mail, label: 'Follow-up Email', color: 'green', delay: '+5 days' },
    { icon: Linkedin, label: 'Reminder LinkedIn Message', color: 'blue', delay: '+7 days' },
    { icon: Phone, label: 'WhatsApp Message', color: 'green', delay: '+10 days' },
  ];

  useEffect(() => {
    if (!isInView) {
      setActiveStep(0);
      return;
    }

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < sequence.length) {
          return prev + 1;
        } else {
          setTimeout(() => setActiveStep(0), 2000);
          return prev;
        }
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isInView, sequence.length]);

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-start justify-center px-4 pt-32 pb-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-900/10"
    >
      <div className="max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-[oklch(0.65_0.22_45)]/20 flex items-center justify-center">
              <span className="text-xl font-bold text-[oklch(0.65_0.22_45)]">4</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-3">
            Building Multichannel Sequences
          </h2>
          <p className="text-lg text-muted-foreground">
            Sales Bee creates personalized messages for each prospect
          </p>
        </motion.div>

        <Card className="p-6 bg-white dark:bg-gray-800 shadow-2xl">
          <div className="space-y-4">
            {sequence.map((step, index) => {
              const Icon = step.icon;
              const isActive = index < activeStep;
              const isCurrent = index === activeStep - 1;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.3, x: -20 }}
                  animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.3, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isCurrent
                        ? 'bg-[oklch(0.65_0.22_45)]/10 border-2 border-[oklch(0.65_0.22_45)]'
                        : 'bg-gray-50 dark:bg-gray-900'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.color === 'blue'
                          ? 'bg-blue-100 dark:bg-blue-900'
                          : 'bg-green-100 dark:bg-green-900'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          step.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base truncate">{step.label}</h3>
                      <p className="text-xs text-muted-foreground">{step.delay}</p>
                    </div>
                    {isActive && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />}
                    {isCurrent && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <MessageSquare className="w-5 h-5 text-[oklch(0.65_0.22_45)]" />
                      </motion.div>
                    )}
                  </div>
                  {index < sequence.length - 1 && (
                    <div className="w-0.5 h-4 bg-gray-200 dark:bg-gray-700 ml-5 my-1" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {activeStep === sequence.length && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
            >
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium text-sm">Sequence ready! AI has personalized all messages.</span>
              </div>
            </motion.div>
          )}
        </Card>
      </div>
    </section>
  );
}

// Step 5: Launch Campaign
function LaunchCampaignSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    if (!isInView) {
      setLaunched(false);
      return;
    }

    const timer = setTimeout(() => {
      setLaunched(true);
      setTimeout(() => setLaunched(false), 3000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isInView]);

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center px-4 py-20"
    >
      <div className="max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-[oklch(0.65_0.22_45)]/20 flex items-center justify-center">
              <span className="text-xl font-bold text-[oklch(0.65_0.22_45)]">5</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Launch?</h2>
          <p className="text-xl text-muted-foreground">
            Sales Bee will now work 24/7 to fill your pipeline
          </p>
        </motion.div>

        <div className="flex flex-col items-center justify-center">
          <motion.div
            animate={launched ? { scale: [1, 0.95, 1.1, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Button
              size="lg"
              className="text-2xl px-12 py-8 h-auto rounded-2xl shadow-2xl bg-[oklch(0.65_0.22_45)] hover:bg-[oklch(0.60_0.22_45)]"
              disabled={launched}
            >
              {launched ? (
                <>
                  <CheckCircle2 className="w-8 h-8 mr-3" />
                  Campaign Launched!
                </>
              ) : (
                <>
                  <Rocket className="w-8 h-8 mr-3" />
                  Launch Campaign
                </>
              )}
            </Button>
          </motion.div>

          {launched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-medium text-green-700 dark:text-green-400">
                  Sales Bee is now working for you!
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

// Step 6: Analytics Dashboard
function AnalyticsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [counts, setCounts] = useState({ replies: 0, meetings: 0, openRate: 0, replyRate: 0 });

  useEffect(() => {
    if (!isInView) {
      setCounts({ replies: 0, meetings: 0, openRate: 0, replyRate: 0 });
      return;
    }

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setCounts({
        replies: Math.floor(DEMO_DATA.analytics.replies * progress),
        meetings: Math.floor(DEMO_DATA.analytics.meetings * progress),
        openRate: Math.floor(DEMO_DATA.analytics.openRate * progress),
        replyRate: Math.floor(DEMO_DATA.analytics.replyRate * progress),
      });

      if (step >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setCounts({ replies: 0, meetings: 0, openRate: 0, replyRate: 0 });
        }, 2000);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isInView]);

  const stats = [
    { label: 'Replies', value: counts.replies, icon: MessageSquare, suffix: '' },
    { label: 'Meetings Booked', value: counts.meetings, icon: Calendar, suffix: '' },
    { label: 'Open Rate', value: counts.openRate, icon: BarChart3, suffix: '%' },
    { label: 'Reply Rate', value: counts.replyRate, icon: TrendingUp, suffix: '%' },
  ];

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-900/10"
    >
      <div className="max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-[oklch(0.65_0.22_45)]/20 flex items-center justify-center">
              <span className="text-xl font-bold text-[oklch(0.65_0.22_45)]">6</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Watch Your Results Grow</h2>
          <p className="text-xl text-muted-foreground">
            Real results from Sales Bee campaigns in the first 30 days
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[oklch(0.65_0.22_45)]/20 to-green-500/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[oklch(0.65_0.22_45)]" />
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-[oklch(0.65_0.22_45)] mb-2">
                    {stat.value}
                    {stat.suffix}
                  </div>
                  <div className="text-lg text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Final CTA Section
function FinalCTASection({ calLink }: { calLink: string }) {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-950/20 dark:to-amber-900/10">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Fill Your Pipeline?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Book a 30-minute demo and we&apos;ll show you exactly how Sales Bee can transform your
            outreach.
            <br />
            <span className="font-semibold text-[oklch(0.65_0.22_45)]">
              No commitment. No pressure. Just results.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 shadow-xl bg-[oklch(0.65_0.22_45)] hover:bg-[oklch(0.60_0.22_45)]"
              asChild
            >
              <a href={calLink} target="_blank" rel="noopener noreferrer">
                <Calendar className="w-5 h-5 mr-2" />
                Book Your Demo Now
              </a>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>30-minute call</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>Personalized to your business</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>No sales pressure</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Floating Bees Component
function FloatingBees() {
  const bees = [
    { size: 60, delay: 0, duration: 15, startX: -10, endX: 110, startY: 10, midY: 40, endY: 15 },
    { size: 80, delay: 2, duration: 18, startX: 110, endX: -10, startY: 60, midY: 30, endY: 70 },
    { size: 70, delay: 4, duration: 16, startX: -10, endX: 110, startY: 80, midY: 50, endY: 85 },
    { size: 50, delay: 6, duration: 20, startX: 110, endX: -10, startY: 25, midY: 65, endY: 30 },
    { size: 90, delay: 8, duration: 17, startX: -10, endX: 110, startY: 45, midY: 75, endY: 50 },
  ];

  return (
    <>
      {bees.map((bee, index) => {
        const isLeftToRight = bee.startX < bee.endX;
        return (
          <motion.div
            key={index}
            initial={{ x: `${bee.startX}vw`, y: `${bee.startY}vh`, opacity: 0 }}
            animate={{
              x: [`${bee.startX}vw`, `50vw`, `${bee.endX}vw`],
              y: [`${bee.startY}vh`, `${bee.midY}vh`, `${bee.endY}vh`],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: bee.duration,
              delay: bee.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute pointer-events-none"
            style={{
              width: bee.size,
              height: bee.size,
              transform: isLeftToRight ? 'none' : 'scaleX(-1)',
            }}
          >
            <img src="/salesbee.png" alt="" className="w-full h-full object-contain" />
          </motion.div>
        );
      })}
    </>
  );
}

