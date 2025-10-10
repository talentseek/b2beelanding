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

interface ABMPageProps {
  abmPage: {
    id: string;
    linkedinIdentifier: string;
    linkedinUrl: string;
    firstName: string;
    lastName: string;
    title: string | null;
    company: string;
    targetMarket: string;
    targetLocation: string;
    mockCompanies: unknown;
    mockLeads: unknown;
    mockAnalytics: unknown;
    heroMessage: string | null;
    benefitPoints: unknown;
  };
}

export function ABMPageClient({ abmPage }: ABMPageProps) {
  // Parse JSON fields
  const companies = (abmPage.mockCompanies as string[]) || [];
  const leads = (abmPage.mockLeads as Array<{ name: string; company: string; title: string }>) || [];
  const analytics = (abmPage.mockAnalytics as { replies: number; meetings: number; openRate: number; replyRate: number }) || {};
  const benefits = (abmPage.benefitPoints as string[]) || [];
  const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK || 'https://cal.com/b2bee';

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="B2Bee" className="h-10 w-auto" />
          </div>
          <Button asChild>
            <a href={calLink} target="_blank" rel="noopener noreferrer">
              Book Your Demo
            </a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection abmPage={abmPage} benefits={benefits} calLink={calLink} />

      {/* Step 1: Create Campaign with AI */}
      <CreateCampaignSection
        firstName={abmPage.firstName}
        targetMarket={abmPage.targetMarket}
        targetLocation={abmPage.targetLocation}
      />

      {/* Step 2: Finding Companies */}
      <FindingCompaniesSection companies={companies} targetMarket={abmPage.targetMarket} />

      {/* Step 3: Finding Leads */}
      <FindingLeadsSection leads={leads} firstName={abmPage.firstName} />

      {/* Step 4: Building Sequences */}
      <BuildingSequencesSection firstName={abmPage.firstName} />

      {/* Step 5: Launch Campaign */}
      <LaunchCampaignSection firstName={abmPage.firstName} company={abmPage.company} />

      {/* Step 6: Analytics Dashboard */}
      <AnalyticsSection analytics={analytics} firstName={abmPage.firstName} />

      {/* Final CTA */}
      <FinalCTASection abmPage={abmPage} calLink={calLink} />

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
function HeroSection({
  abmPage,
  benefits,
  calLink,
}: {
  abmPage: ABMPageProps['abmPage'];
  benefits: string[];
  calLink: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-900/10 py-20 px-4">
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
            <Badge className="text-lg px-4 py-2 mb-4">
              Personalized for {abmPage.firstName} at {abmPage.company}
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            {abmPage.heroMessage || (
              <>
                Hi {abmPage.firstName} 👋
                <br />
                Imagine filling {abmPage.company}&apos;s pipeline
                <br />
                with {abmPage.targetMarket} - automatically.
              </>
            )}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Watch how Sales Bee can transform {abmPage.company}&apos;s outreach in the next 60 seconds
          </p>

          {benefits.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-8"
          >
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <a href="#demo">See Sales Bee in Action</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Step 1: Create Campaign with AI
function CreateCampaignSection({
  firstName,
  targetMarket,
  targetLocation,
}: {
  firstName: string;
  targetMarket: string;
  targetLocation: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [typedText, setTypedText] = useState('');
  const fullText = `${targetMarket} in ${targetLocation}`;

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
        // Reset for loop
        setTimeout(() => {
          setTypedText('');
          currentIndex = 0;
        }, 2000);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isInView, fullText]);

  return (
    <section id="demo" ref={ref} className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">1</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {firstName}, let&apos;s create your first campaign
          </h2>
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
                <Sparkles className="w-6 h-6 text-primary" />
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
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-primary rounded-lg text-lg font-mono"
                    placeholder="e.g. Plumbers in London..."
                  />
                  {typedText && typedText.length < fullText.length && (
                    <motion.div
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary"
                    />
                  )}
                </div>
              </div>

              {typedText.length === fullText.length && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-primary"
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
function FindingCompaniesSection({
  companies,
  targetMarket,
}: {
  companies: string[];
  targetMarket: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [visibleCompanies, setVisibleCompanies] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setVisibleCompanies(0);
      return;
    }

    const interval = setInterval(() => {
      setVisibleCompanies((prev) => {
        if (prev < companies.length) {
          return prev + 1;
        } else {
          // Reset for loop
          setTimeout(() => setVisibleCompanies(0), 2000);
          return prev;
        }
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isInView, companies.length]);

  return (
    <section ref={ref} className="py-20 px-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-900/10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">2</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Finding {targetMarket}</h2>
          <p className="text-xl text-muted-foreground">
            AI is scanning databases to find your ideal prospects
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {companies.slice(0, visibleCompanies).map((company, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-amber-500/20 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{company}</h3>
                    <p className="text-sm text-muted-foreground">Active company</p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
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
              Found {visibleCompanies} of {companies.length} companies
            </Badge>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Step 3: Finding Leads
function FindingLeadsSection({
  leads,
  firstName,
}: {
  leads: Array<{ name: string; company: string; title: string }>;
  firstName: string;
}) {
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
        if (prev < leads.length) {
          return prev + 1;
        } else {
          setTimeout(() => setVisibleLeads(0), 2000);
          return prev;
        }
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isInView, leads.length]);

  return (
    <section ref={ref} className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">3</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Finding decision makers for you, {firstName}
          </h2>
          <p className="text-xl text-muted-foreground">
            Identifying the right people at each company
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {leads.slice(0, visibleLeads).map((lead, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-950/20 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center text-white font-bold text-lg">
                    {lead.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{lead.name}</h3>
                      <Linkedin className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">{lead.title}</p>
                    <p className="text-sm font-medium">{lead.company}</p>
                  </div>
                  <Target className="w-5 h-5 text-primary" />
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
function BuildingSequencesSection({ firstName }: { firstName: string }) {
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
    <section ref={ref} className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-900/10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">4</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Building your multichannel sequence
          </h2>
          <p className="text-xl text-muted-foreground">
            {firstName}, Sales Bee creates personalized messages for each prospect
          </p>
        </motion.div>

        <Card className="p-8 bg-white dark:bg-gray-800 shadow-2xl">
          <div className="space-y-6">
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
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                      isCurrent ? 'bg-primary/10 border-2 border-primary' : 'bg-gray-50 dark:bg-gray-900'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        step.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-green-100 dark:bg-green-900'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          step.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{step.label}</h3>
                      <p className="text-sm text-muted-foreground">{step.delay}</p>
                    </div>
                    {isActive && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                    {isCurrent && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <MessageSquare className="w-6 h-6 text-primary" />
                      </motion.div>
                    )}
                  </div>
                  {index < sequence.length - 1 && (
                    <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-700 ml-6 my-1" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {activeStep === sequence.length && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
            >
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Sequence ready! AI has personalized all messages.</span>
              </div>
            </motion.div>
          )}
        </Card>
      </div>
    </section>
  );
}

// Step 5: Launch Campaign
function LaunchCampaignSection({ firstName, company }: { firstName: string; company: string }) {
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
      // Reset for loop
      setTimeout(() => setLaunched(false), 3000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isInView]);

  return (
    <section ref={ref} className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">5</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to launch, {firstName}?</h2>
          <p className="text-xl text-muted-foreground">
            Sales Bee will now work 24/7 to fill {company}&apos;s pipeline
          </p>
        </motion.div>

        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <motion.div
            animate={launched ? { scale: [1, 0.95, 1.1, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Button
              size="lg"
              className="text-2xl px-12 py-8 h-auto rounded-2xl shadow-2xl"
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
                  Sales Bee is now working for {company}
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
function AnalyticsSection({
  analytics,
  firstName,
}: {
  analytics: { replies: number; meetings: number; openRate: number; replyRate: number };
  firstName: string;
}) {
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
        replies: Math.floor(analytics.replies * progress),
        meetings: Math.floor(analytics.meetings * progress),
        openRate: Math.floor(analytics.openRate * progress),
        replyRate: Math.floor(analytics.replyRate * progress),
      });

      if (step >= steps) {
        clearInterval(timer);
        // Reset for loop
        setTimeout(() => {
          setCounts({ replies: 0, meetings: 0, openRate: 0, replyRate: 0 });
        }, 2000);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isInView, analytics]);

  const stats = [
    { label: 'Replies', value: counts.replies, icon: MessageSquare, suffix: '' },
    { label: 'Meetings Booked', value: counts.meetings, icon: Calendar, suffix: '' },
    { label: 'Open Rate', value: counts.openRate, icon: BarChart3, suffix: '%' },
    { label: 'Reply Rate', value: counts.replyRate, icon: TrendingUp, suffix: '%' },
  ];

  return (
    <section ref={ref} className="py-20 px-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-900/10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">6</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Here&apos;s what you could see, {firstName}
          </h2>
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
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-green-500/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
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
function FinalCTASection({ abmPage, calLink }: { abmPage: ABMPageProps['abmPage']; calLink: string }) {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-950/20 dark:to-amber-900/10">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to see this in action for {abmPage.company}, {abmPage.firstName}?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Book a 15-minute demo and we&apos;ll show you exactly how Sales Bee can transform your outreach.
            <br />
            <span className="font-semibold text-primary">No commitment. No pressure. Just results.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-6 shadow-xl" asChild>
              <a href={calLink} target="_blank" rel="noopener noreferrer">
                <Calendar className="w-5 h-5 mr-2" />
                Book Your Personal Demo
              </a>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>15-minute call</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>Personalized for {abmPage.company}</span>
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

// Floating Bees Component (reused from hero section)
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

