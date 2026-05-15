import React, { useRef } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush
} from 'recharts';
import { motion } from 'motion/react';
import html2canvas from 'html2canvas';

interface DynamicChartViewProps {
  data: any[];
  columns: string[];
  insights: any;
  onDrillDown?: (dataPoint: any) => void;
}

export default function DynamicChartView({ data, columns, insights, onDrillDown }: DynamicChartViewProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  if (!data || data.length === 0 || !insights) return null;

  const chartType = insights.recommendedChartType || 'area';
  const numericCols = columns.filter(col => typeof data[0]?.[col] === 'number');
  const catCols = columns.filter(col => typeof data[0]?.[col] === 'string');
  const xKey = catCols[0] || columns[0];
  const yKey = numericCols[0] || columns[1];

  const tooltipStyle = {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    borderRadius: '12px',
    padding: '12px',
  };

  const handleChartClick = (data: any) => {
    if (onDrillDown && data && data.activePayload && data.activePayload.length > 0) {
      onDrillDown(data.activePayload[0].payload);
    }
  };

  const downloadChart = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `chart-${chartType}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderChart = () => {
    switch (chartType.toLowerCase()) {
      case 'bar':
        return (
          <BarChart data={data} onClick={handleChartClick}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey={xKey} stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey={yKey} fill="#8b5cf6" activeBar={{ fill: '#c084fc', opacity: 0.8 }} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data} onClick={handleChartClick}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey={xKey} stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey={yKey} stroke="#22d3ee" strokeWidth={3} activeDot={{ r: 8 }} />
            <Brush dataKey={xKey} height={30} stroke="#22d3ee" fill="#0f172a" />
          </LineChart>
        );
      case 'area':
      default:
        return (
          <AreaChart data={data} onClick={handleChartClick}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey={xKey} stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey={yKey} fill="#8b5cf6" stroke="#8b5cf6" activeDot={{ r: 8 }} />
            <Brush dataKey={xKey} height={30} stroke="#8b5cf6" fill="#0f172a" />
          </AreaChart>
        );
    }
  };

  return (
    <motion.div 
      ref={chartRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 rounded-3xl mt-8"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
           <h3 className="text-xl font-bold mb-2">AI Recommended Visualization: {chartType}</h3>
           <p className="text-muted-foreground text-sm">{insights.description || 'Dynamic insight visualization'}</p>
        </div>
        <button 
           onClick={downloadChart}
           className="px-4 py-2 bg-primary rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Download PNG
        </button>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
