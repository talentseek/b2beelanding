'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  ThumbsUp,
  Image as ImageIcon,
} from 'lucide-react';

const DEMO_POSTS = [
  {
    content: "🎉 Exciting news! We're launching our new product line next week. Stay tuned for something special! #Innovation #Launch",
    image: true,
    platforms: ['Instagram', 'Facebook', 'Twitter'],
    time: '2:00 PM',
  },
  {
    content: "💡 Pro tip: Did you know 80% of businesses see better engagement with consistent posting? Let us help you stay consistent! #BusinessTips #SocialMedia",
    image: false,
    platforms: ['LinkedIn', 'Twitter'],
    time: '10:00 AM',
  },
  {
    content: "🌟 Customer love! \"This transformed how we manage social media\" - Sarah K. Thank you for the amazing feedback! #CustomerSuccess #Testimonial",
    image: true,
    platforms: ['Instagram', 'Facebook', 'LinkedIn'],
    time: '4:00 PM',
  },
];

export default function SocialBeeDemoPage() {
  const [step, setStep] = useState<'idle' | 'generating' | 'reviewing' | 'scheduling' | 'complete'>('idle');
  const [typedText, setTypedText] = useState('');
  const [approvedPosts, setApprovedPosts] = useState<number[]>([]);
  
  const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK || 'https://cal.com/b2bee';

  useEffect(() => {
    const runDemo = async () => {
      // Wait 1 second, then start generating
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('generating');

      // Type out the first post
      const content = DEMO_POSTS[0].content;
      for (let i = 0; i <= content.length; i++) {
        setTypedText(content.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 30));
      }

      // Wait a bit, then move to reviewing
      await new Promise(resolve => setTimeout(resolve, 500));
      setStep('reviewing');

      // Approve posts one by one
      for (let i = 0; i < DEMO_POSTS.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setApprovedPosts(prev => [...prev, i]);
      }

      // Move to scheduling
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('scheduling');

      // Complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep('complete');

      // Reset after showing complete state
      await new Promise(resolve => setTimeout(resolve, 3000));
      setStep('idle');
      setTypedText('');
      setApprovedPosts([]);
    };

    runDemo();
  }, []);

  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: string } = {
      Instagram: '📷',
      Facebook: '👍',
      Twitter: '🐦',
      LinkedIn: '💼',
    };
    return icons[platform] || '📱';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-900/10">
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

      {/* Single Page Demo */}
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="max-w-5xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-[oklch(0.65_0.22_45)] hover:bg-[oklch(0.60_0.22_45)]">
              Social Bee Demo
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your AI Social Media Manager
            </h1>
            <p className="text-lg text-muted-foreground">
              Watch Social Bee create, approve, and schedule posts automatically
            </p>
          </div>

          {/* Main Demo Area */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Side - AI Generation & Review */}
            <div className="space-y-4">
              {/* AI Generator Card */}
              <Card className="p-6 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[oklch(0.65_0.22_45)]/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[oklch(0.65_0.22_45)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Content Generator</h3>
                    <p className="text-xs text-muted-foreground">
                      {step === 'idle' && 'Analyzing your brand...'}
                      {step === 'generating' && 'Creating engaging posts...'}
                      {step === 'reviewing' && 'Posts ready for review!'}
                      {step === 'scheduling' && 'Scheduling approved posts...'}
                      {step === 'complete' && 'All done! Posts scheduled ✓'}
                    </p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {step === 'generating' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-[oklch(0.65_0.22_45)] min-h-[120px]">
                        <p className="text-sm whitespace-pre-wrap">{typedText}</p>
                        {typedText.length < DEMO_POSTS[0].content.length && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="inline-block w-0.5 h-4 bg-[oklch(0.65_0.22_45)] ml-1"
                          />
                        )}
                      </div>
                      {DEMO_POSTS[0].image && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <ImageIcon className="w-4 h-4" />
                          <span>Suggesting image...</span>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {(step === 'reviewing' || step === 'scheduling' || step === 'complete') && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      {DEMO_POSTS.map((post, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0.3, scale: 0.95 }}
                          animate={
                            approvedPosts.includes(index)
                              ? { opacity: 1, scale: 1 }
                              : { opacity: 0.3, scale: 0.95 }
                          }
                          className={`p-3 rounded-lg border ${
                            approvedPosts.includes(index)
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                              : 'bg-gray-50 dark:bg-gray-900 border-gray-200'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-xs line-clamp-2 flex-1">{post.content}</p>
                            {approvedPosts.includes(index) && (
                              <CheckCircle2 className="w-5 h-5 text-green-500 ml-2 flex-shrink-0" />
                            )}
                          </div>
                          {post.image && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <ImageIcon className="w-3 h-3" />
                              <span>With image</span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              {/* Stats */}
              {(step === 'scheduling' || step === 'complete') && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-3 gap-3"
                >
                  <Card className="p-3 bg-white dark:bg-gray-800 text-center">
                    <div className="text-2xl font-bold text-[oklch(0.65_0.22_45)]">
                      {approvedPosts.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </Card>
                  <Card className="p-3 bg-white dark:bg-gray-800 text-center">
                    <div className="text-2xl font-bold text-[oklch(0.65_0.22_45)]">4</div>
                    <div className="text-xs text-muted-foreground">Platforms</div>
                  </Card>
                  <Card className="p-3 bg-white dark:bg-gray-800 text-center">
                    <div className="text-2xl font-bold text-[oklch(0.65_0.22_45)]">7</div>
                    <div className="text-xs text-muted-foreground">Days</div>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Right Side - Calendar & Schedule */}
            <div className="space-y-4">
              {/* Calendar Card */}
              <Card className="p-6 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Content Calendar</h3>
                    <p className="text-xs text-muted-foreground">This week&apos;s schedule</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {DEMO_POSTS.map((post, index) => (
                    <AnimatePresence key={index}>
                      {(step === 'scheduling' || step === 'complete') && approvedPosts.includes(index) && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.3 }}
                          className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-medium">
                                {['Monday', 'Wednesday', 'Friday'][index]} {post.time}
                              </span>
                            </div>
                            {step === 'complete' && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 2 + index * 0.1 }}
                              >
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              </motion.div>
                            )}
                          </div>
                          <p className="text-xs line-clamp-1 mb-2 text-muted-foreground">
                            {post.content}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {post.platforms.map((platform) => (
                              <Badge
                                key={platform}
                                variant="secondary"
                                className="text-xs px-2 py-0"
                              >
                                {getPlatformIcon(platform)} {platform}
                              </Badge>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  ))}
                </div>

                {step === 'idle' && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Waiting for posts to schedule...
                  </div>
                )}
              </Card>

              {/* Success Message */}
              {step === 'complete' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5 }}
                >
                  <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <ThumbsUp className="w-8 h-8 text-green-500" />
                      <div>
                        <h4 className="font-semibold text-green-700 dark:text-green-400">
                          Perfect! You&apos;re all set
                        </h4>
                        <p className="text-sm text-green-600 dark:text-green-500">
                          Social Bee will post automatically at the scheduled times
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <p className="text-muted-foreground mb-4">
              See Social Bee manage your entire social media presence
            </p>
            <Button
              size="lg"
              className="bg-[oklch(0.65_0.22_45)] hover:bg-[oklch(0.60_0.22_45)]"
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

