'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, Clock, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface ProgressSectionProps {
  total: number
  completed: number
  pending: number
  completionRate: number
}

const getProgressMessage = (rate: number) => {
  if (rate === 100) return "You're all caught up! Time to relax! 🌸"
  if (rate >= 75) return 'Almost there! Doing amazing! ✨'
  if (rate >= 50) return 'Halfway through your goals! Keep going! 🌱'
  if (rate > 0) return 'Great start! Step by step. 💛'
  return "Let's plan your day and start productive! ☀️"
}

export function ProgressSection({
  total,
  completed,
  pending,
  completionRate
}: ProgressSectionProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      {/* Cozy Progress Card */}
      <Card className="md:col-span-2 border-border/40 bg-card rounded-3xl overflow-hidden hover:shadow-sm transition-all duration-300 relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-24 h-24 text-primary" />
        </div>
        <CardContent className="p-6 flex flex-col justify-between h-full min-h-[130px]">
          <div>
            <span className="text-xs text-muted-foreground/80 font-bold uppercase tracking-wider">
              Today&apos;s Journey
            </span>
            <h3 className="text-lg font-bold text-foreground mt-1">
              {getProgressMessage(completionRate)}
            </h3>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground mb-1.5">
              <span>
                Completed {completed} of {total} tasks
              </span>
              <span>{completionRate}%</span>
            </div>
            <div className="w-full bg-secondary/60 h-3 rounded-full overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-violet-400 to-pink-400 dark:from-violet-500 dark:to-pink-500 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Small stats cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-border/40 bg-card rounded-3xl hover:shadow-sm transition-all duration-300">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="bg-primary/10 text-primary p-2.5 rounded-2xl w-fit">
              <ClipboardList className="h-4.5 w-4.5" />
            </div>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground font-semibold">Tasks</p>
              <h4 className="text-2xl font-bold mt-0.5">{total}</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card rounded-3xl hover:shadow-sm transition-all duration-300">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="bg-amber-400/10 text-amber-600 dark:text-amber-500 p-2.5 rounded-2xl w-fit">
              <Clock className="h-4.5 w-4.5" />
            </div>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground font-semibold">Pending</p>
              <h4 className="text-2xl font-bold mt-0.5">{pending}</h4>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
