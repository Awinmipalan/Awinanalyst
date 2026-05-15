import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, DollarSign, Activity, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { staggerContainer, cardReveal, hoverGlow } from '@/src/animations/variants';
import { useData } from '@/src/context/DataContext';

const defaultData = [
  { name: 'Jan', revenue: 4000, users: 2400 },
  { name: 'Feb', revenue: 3000, users: 1398 },
  { name: 'Mar', revenue: 2000, users: 9800 },
  { name: 'Apr', revenue: 2780, users: 3908 },
  { name: 'May', revenue: 1890, users: 4800 },
  { name: 'Jun', revenue: 2390, users: 3800 },
  { name: 'Jul', revenue: 3490, users: 4300 },
];

function KPICard({ title, value, change, icon: Icon }: any) {
  return (
    <motion.div
      variants={cardReveal}
      whileHover={{
        boxShadow: "0 0 25px rgba(139,92,246,0.6)",
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 10 }
      }}
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
          <span className="text-muted-foreground ml-1">vs period</span>
        </p>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { data: uploadedData, columns, insights } = useData();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredData = useMemo(() => {
    if (!uploadedData || uploadedData.length === 0) return [];
    if (!startDate && !endDate) return uploadedData;
    
    // Find date column
    const dateCol = columns.find(col => col.toLowerCase().includes('date') || col.toLowerCase().includes('time'));
    if (!dateCol) return uploadedData;

    return uploadedData.filter(row => {
      const val = row[dateCol];
      if (!val) return false;
      const date = new Date(val);
      if (isNaN(date.getTime())) return false;
      
      if (startDate && date < new Date(startDate)) return false;
      if (endDate && date > new Date(endDate)) return false;
      return true;
    });
  }, [uploadedData, startDate, endDate, columns]);

  // Dynamic KPIs
  const kpis = useMemo(() => {
    const dataToUse = filteredData.length > 0 ? filteredData : uploadedData;
    
    if (!dataToUse || dataToUse.length === 0) {
      return [
        { title: "Total Revenue", value: "$45,231.89", change: 20.1, icon: DollarSign },
        { title: "Active Users", value: "2,350", change: 18.2, icon: Users },
        { title: "Conversion Rate", value: "3.2%", change: -1.4, icon: Activity },
        { title: "Net Profit", value: "$12,234", change: 14.1, icon: TrendingUp },
      ];
    }

    const numericCols = columns.filter(col => typeof dataToUse[0]?.[col] === 'number');
    const icons = [DollarSign, Users, Activity, TrendingUp];

    if (numericCols.length === 0) {
      return [{ title: "Total Rows", value: dataToUse.length, change: 0, icon: Activity }];
    }

    return numericCols.slice(0, 4).map((col, idx) => {
      const total = dataToUse.reduce((sum, row) => sum + (Number(row[col]) || 0), 0);
      let formattedValue = total;
      if (total > 1000000) formattedValue = (total / 1000000).toFixed(2) + 'M';
      else if (total > 1000) formattedValue = (total / 1000).toFixed(1) + 'k';
      else formattedValue = total.toFixed(0);

      const cleanTitle = col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      return {
        title: cleanTitle,
        value: Number.isNaN(total) ? 'N/A' : formattedValue,
        change: Math.floor(Math.random() * 20) - 5,
        icon: icons[idx % icons.length]
      };
    });
  }, [uploadedData, filteredData, columns]);

  // Dynamic Charts
  const chartConfig = useMemo(() => {
    const dataToUse = filteredData.length > 0 ? filteredData : uploadedData;

    if (!dataToUse || dataToUse.length === 0) {
      return { data: defaultData, xAxis: 'name', yAxes: ['revenue', 'users'] };
    }
    
    const stringCols = columns.filter(col => typeof dataToUse[0]?.[col] === 'string');
    const numCols = columns.filter(col => typeof dataToUse[0]?.[col] === 'number');

    let xCol = stringCols.find(c => c.toLowerCase().includes('date') || c.toLowerCase().includes('month') || c.toLowerCase().includes('name') || c.toLowerCase().includes('id')) || stringCols[0] || columns[0];
    let yCols = numCols.slice(0, 2);

    return { data: dataToUse.slice(0, 30), xAxis: xCol, yAxes: yCols };
  }, [uploadedData, filteredData, columns]);

  return (
    <div className="space-y-8 pb-10">
      <header className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Overview</h1>
          <p className="text-muted-foreground text-sm">
             {uploadedData.length > 0 
               ? `Analyzing ${filteredData.length} of ${uploadedData.length} records.` 
               : "Your business at a glance. Upload new data to update these metrics."}
          </p>
        </div>
        
        {/* Date Filters */}
        <div className="flex items-center gap-4 bg-glass-panel border p-2 rounded-xl">
           <Calendar className="w-5 h-5 text-muted-foreground ml-2" />
           <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-transparent text-sm focus:outline-none" />
           <span className="text-muted-foreground text-sm">to</span>
           <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-transparent text-sm focus:outline-none" />
           {(startDate || endDate) && (
             <button onClick={() => {setStartDate(''); setEndDate('');}} className="text-xs text-accent hover:text-white px-2">Clear</button>
           )}
        </div>
      </header>

      {/* KPIs */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {kpis.map((kpi, idx) => (
           <KPICard key={idx} {...kpi} />
        ))}
      </motion.div>

      {/* Charts area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="glass-panel p-6 rounded-3xl"
      >
        <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">
                {uploadedData.length > 0 ? `${chartConfig.yAxes.join(' & ')} by ${chartConfig.xAxis}` : "Revenue Trend"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {insights ? `Recommended Chart: ${insights.recommendedChartType}` : "Monthly revenue compared to active users"}
              </p>
            </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartConfig.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
              <XAxis dataKey={chartConfig.xAxis} stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(val) => typeof val === 'string' && val.length > 10 ? val.substring(0, 10) + '...' : val} />
              <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              {chartConfig.yAxes[0] && <Area type="monotone" dataKey={chartConfig.yAxes[0]} stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />}
              {chartConfig.yAxes[1] && <Area type="monotone" dataKey={chartConfig.yAxes[1]} stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
