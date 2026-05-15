import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { staggerContainer, cardReveal, hoverGlow } from '@/src/animations/variants';

const data = [
  { name: 'Jan', revenue: 4000, users: 2400 },
  { name: 'Feb', revenue: 3000, users: 1398 },
  { name: 'Mar', revenue: 2000, users: 9800 },
  { name: 'Apr', revenue: 2780, users: 3908 },
  { name: 'May', revenue: 1890, users: 4800 },
  { name: 'Jun', revenue: 2390, users: 3800 },
  { name: 'Jul', revenue: 3490, users: 4300 },
];

function KPICard({ title, value, change, icon: Icon, delay }: any) {
  return (
    <motion.div
      variants={cardReveal}
      whileHover={hoverGlow.hover}
      className="glass-panel p-6 rounded-2xl relative overflow-hidden group cursor-pointer"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-16 h-16 text-white" />
      </div>
      <div className="relative z-10">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
          {title}
        </p>
        <h3 className="text-3xl font-bold mb-1">{value}</h3>
        <p className={`text-sm font-medium ${change >= 0 ? 'text-emerald-400' : 'text-red-400'} flex items-center gap-1`}>
          {change >= 0 ? '+' : ''}{change}%
          <span className="text-muted-foreground ml-1">vs last month</span>
        </p>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-8 pb-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Overview</h1>
          <p className="text-muted-foreground text-sm">Your business at a glance. Upload new data to update these metrics.</p>
        </div>
      </header>

      {/* KPIs */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <KPICard title="Total Revenue" value="$45,231.89" change={20.1} icon={DollarSign} />
        <KPICard title="Active Users" value="2,350" change={18.2} icon={Users} />
        <KPICard title="Conversion Rate" value="3.2%" change={-1.4} icon={Activity} />
        <KPICard title="Net Profit" value="$12,234" change={14.1} icon={TrendingUp} />
      </motion.div>

      {/* Charts area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="glass-panel p-6 rounded-3xl"
      >
        <div className="mb-6">
            <h3 className="text-lg font-semibold">Revenue Trend</h3>
            <p className="text-sm text-muted-foreground">Monthly revenue compared to active users</p>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="users" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
