'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Ship, Plus, TrendingUp, Target, Calendar } from 'lucide-react';

const GOAL = 3000000; // £30,000 in pence

interface Contribution {
  id: string;
  amount: number;
  description: string;
  createdAt: string;
}

export default function BoatFundPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
  });

  const fetchContributions = async () => {
    try {
      const res = await fetch('/api/boat-fund');
      const data = await res.json();
      setContributions(data.contributions || []);
      setTotalAmount(data.total || 0);
    } catch (error) {
      console.error('Error fetching contributions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountInPence = Math.round(parseFloat(formData.amount) * 100);
    
    if (!amountInPence || amountInPence <= 0) return;

    try {
      const res = await fetch('/api/boat-fund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPence,
          description: formData.description || 'Contribution',
        }),
      });

      if (res.ok) {
        setFormData({ amount: '', description: '' });
        setShowForm(false);
        await fetchContributions();
        
        // Show confetti for big contributions
        if (amountInPence >= 100000) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
      }
    } catch (error) {
      console.error('Error adding contribution:', error);
    }
  };

  const percentage = Math.min((totalAmount / GOAL) * 100, 100);
  const formatCurrency = (pence: number) => `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin text-4xl">⛵</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                initial={{
                  top: '50%',
                  left: '50%',
                  opacity: 1,
                }}
                animate={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0,
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 2, ease: 'easeOut' }}
              >
                {['🎉', '⛵', '💰', '🌊', '⚓'][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">⛵ The Boat Fund</h1>
          <p className="text-muted-foreground">Sailing towards £30,000</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[oklch(0.65_0.22_45)] hover:bg-[oklch(0.60_0.22_45)]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Contribution
        </Button>
      </div>

      {/* Add Contribution Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <Card className="border-2 border-[oklch(0.65_0.22_45)]">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Amount (£)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="100.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="e.g., Sales Bee commission"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-[oklch(0.65_0.22_45)] hover:bg-[oklch(0.60_0.22_45)]">
                      Add to Fund
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Boat Visualization */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Stats Cards */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              Current Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{formatCurrency(totalAmount)}</div>
            <p className="text-xs text-muted-foreground mt-1">of £30,000 goal</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{percentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Complete</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Ship className="h-4 w-4 text-orange-500" />
              Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{formatCurrency(GOAL - totalAmount)}</div>
            <p className="text-xs text-muted-foreground mt-1">to reach goal</p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Boat Progress */}
      <Card className="mb-8 overflow-hidden">
        <CardContent className="p-8">
          <div className="relative h-96 bg-gradient-to-b from-sky-200 to-blue-400 rounded-2xl overflow-hidden">
            {/* Sky/Water Background */}
            <div className="absolute inset-0">
              {/* Clouds */}
              <motion.div
                animate={{ x: [-20, 20, -20] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-8 left-1/4 text-6xl opacity-70"
              >
                ☁️
              </motion.div>
              <motion.div
                animate={{ x: [20, -20, 20] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-12 right-1/4 text-5xl opacity-60"
              >
                ☁️
              </motion.div>
              
              {/* Sun */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="absolute top-4 right-8 text-6xl"
              >
                ☀️
              </motion.div>
            </div>

            {/* Water Level (rises with progress) */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-blue-300/50 to-blue-600"
              initial={{ height: '0%' }}
              animate={{ height: `${percentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              {/* Waves */}
              <motion.div
                animate={{ x: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-0 left-0 right-0 h-8 opacity-50"
                style={{
                  background: 'repeating-linear-gradient(90deg, transparent, rgba(255,255,255,0.3) 20px, transparent 40px)',
                }}
              />
            </motion.div>

            {/* The Boat (floats with water level) */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2"
              initial={{ bottom: '5%' }}
              animate={{
                bottom: `${Math.max(5, percentage - 5)}%`,
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{
                bottom: { duration: 1, ease: 'easeOut' },
                rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              <div className="text-9xl drop-shadow-2xl filter">⛵</div>
            </motion.div>

            {/* Goal Line */}
            <div className="absolute top-4 left-0 right-0 flex justify-center">
              <Badge className="bg-white/90 text-gray-800 text-lg px-4 py-2">
                🎯 Goal: £30,000
              </Badge>
            </div>

            {/* Progress Indicator */}
            <div className="absolute bottom-4 left-4">
              <Badge className="bg-white/90 text-gray-800 text-lg px-4 py-2">
                {formatCurrency(totalAmount)} • {percentage.toFixed(1)}%
              </Badge>
            </div>
          </div>

          {/* Milestone Markers */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            {[25, 50, 75, 100].map((milestone) => {
              const milestoneAmount = (GOAL * milestone) / 100;
              const reached = totalAmount >= milestoneAmount;
              return (
                <div
                  key={milestone}
                  className={`text-center p-3 rounded-lg border-2 transition-all ${
                    reached
                      ? 'bg-green-500/20 border-green-500 scale-105'
                      : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <div className={`text-2xl mb-1 ${reached ? 'animate-bounce' : 'opacity-50'}`}>
                    {reached ? '✅' : '🔒'}
                  </div>
                  <div className="text-sm font-semibold">{milestone}%</div>
                  <div className="text-xs text-muted-foreground">{formatCurrency(milestoneAmount)}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Contributions Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Contributions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contributions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No contributions yet. Start the fund by adding your first contribution! 🚢
            </div>
          ) : (
            <div className="space-y-3">
              {contributions.map((contribution, idx) => (
                <motion.div
                  key={contribution.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">
                      {contribution.amount >= 100000 ? '🎉' : contribution.amount >= 50000 ? '💰' : '💵'}
                    </div>
                    <div>
                      <div className="font-medium">{contribution.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(contribution.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">
                      +{formatCurrency(contribution.amount)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

