import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Database, LogOut, Hexagon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import AnimatedBackground from '@/src/components/AnimatedBackground';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: Database, label: 'Data Center', href: '/dashboard/data' },
  { icon: MessageSquare, label: 'AI Analytics', href: '/dashboard/chat' },
];

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-transparent text-foreground font-sans">
      <AnimatedBackground />

      {/* Sidebar */}
      <aside className="w-full md:w-64 glass-panel border-r border-y-0 border-l-0 flex-shrink-0 flex flex-col z-20 sticky top-0 md:h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="relative flex items-center justify-center p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-glass-border shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <Hexagon className="w-6 h-6 text-accent" />
          </div>
          <span className="text-xl font-bold tracking-tight text-glow">Awinlytics</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group text-sm font-medium',
                    isActive ? 'text-white' : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  )
                }
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent border-l-2 border-accent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                <item.icon className={cn("w-5 h-5 relative z-10 transition-colors", isActive ? "text-accent" : "")} />
                <span className="relative z-10">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="glass-panel p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white shadow-lg">
              AW
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">awinflex</p>
              <p className="text-xs text-muted-foreground truncate">awinflex@gmail.com</p>
            </div>
            <LogOut className="w-4 h-4 text-muted-foreground hover:text-white" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 min-w-0 h-screen overflow-y-auto">
        <div className="p-6 md:p-8 2xl:px-12 2xl:py-10 max-w-7xl mx-auto w-full">
            <Outlet />
        </div>
      </main>
    </div>
  );
}
