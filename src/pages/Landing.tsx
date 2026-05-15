import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, BrainCircuit, Database } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background text-foreground">
      <AnimatedBackground />
      
      {/* Navbar */}
      <header className="px-8 py-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-accent" />
          <span className="text-2xl font-bold tracking-tighter text-glow">Awinlytics</span>
        </div>
        <div className="flex gap-4 items-center">
          <button className="text-sm font-medium hover:text-white text-muted-foreground transition-colors">
            Product
          </button>
          <button className="text-sm font-medium hover:text-white text-muted-foreground transition-colors">
            Pricing
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 transition-transform active:scale-95"
          >
            Launch Platform
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel mb-8 border border-white/10 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gemini 3.1 Pro Powered</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Talk to your data like <br />
            <span className="gradient-text">never before.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Upload CSV, Excel, or JSON. Watch our elite AI engine instantly clean, analyze, and visualize your entire business operation in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold flex items-center gap-2 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300"
            >
              Start Analyzing for Free <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 rounded-full glass-panel text-white font-medium hover:bg-white/5 transition-colors">
              View Demo
            </button>
          </div>
        </motion.div>

        {/* Feature Highlights beneath */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl px-4 w-full"
        >
            <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
                <Database className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Instant Parsing</h3>
                <p className="text-sm text-muted-foreground">Drop any dataset and let AI clean and structure it automatically.</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
                <BarChart3 className="w-10 h-10 text-secondary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Smart Dashboards</h3>
                <p className="text-sm text-muted-foreground">Beautiful responsive charts generated without touching code.</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
                <BrainCircuit className="w-10 h-10 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">Conversational AI</h3>
                <p className="text-sm text-muted-foreground">Ask "Why did revenue drop in Q3?" and get real answers.</p>
            </div>
        </motion.div>
      </main>
    </div>
  );
}
