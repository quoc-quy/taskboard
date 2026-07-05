'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

interface HeaderProps {
  onCreateClick: () => void;
}

const QUOTES = [
  "Focus on being productive instead of busy. 🌟",
  "Small progress is still progress. 🌱",
  "You got this! Let's make today count. ✨",
  "Take a deep breath and start with one small step. 🌸",
  "Do what you can, with what you have, where you are. 💛",
  "Your future self will thank you for what you do today. 🚀",
];

export function Header({ onCreateClick }: HeaderProps) {
  const [greeting, setGreeting] = useState('Welcome back');
  const [dailyQuote, setDailyQuote] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning ☀️');
    else if (hour < 18) setGreeting('Good afternoon ☕');
    else setGreeting('Good evening 🌙');

    setDailyQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-border/40 pb-6 mb-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-pink-500 dark:from-violet-400 dark:to-pink-400 bg-clip-text text-transparent">
          {greeting}
        </h1>
        {dailyQuote && (
          <p className="text-sm text-muted-foreground mt-1 font-medium tracking-wide flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" /> {dailyQuote}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button
          onClick={onCreateClick}
          className="rounded-full shadow-sm font-bold bg-primary hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200 px-5 gap-1.5"
        >
          <Plus className="h-4.5 w-4.5" /> Create Task
        </Button>
      </div>
    </header>
  );
}
