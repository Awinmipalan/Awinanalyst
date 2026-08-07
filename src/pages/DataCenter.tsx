import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, File, AlertCircle, CheckCircle2, Loader2, Sparkles, Database } from 'lucide-react';
import Papa from 'papaparse';
import AIPulse from '@/src/components/AIPulse';
import { Skeleton } from '@/src/components/Skeleton';
import { useData } from '@/src/context/DataContext';
import DynamicChartView from '@/src/components/DynamicChartView';
import { checkAndIncrementUsage } from '../services/usageService';
import { profileDataset } from '../utils/dataProfiler';

export default function DataCenter() {
  const { data, setData, columns, setColumns, insights, setInsights } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [drillDownData, setDrillDownData] = useState<any[] | null>(null);
  const pageSize = 10;

  const filteredData = useMemo(() => {
    let dataset = drillDownData || data;
    if (!searchTerm) return dataset;
    return dataset.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, drillDownData, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const analyzeDataset = async (dataset: any[], cols: string[]) => {
    const summary = profileDataset(dataset, cols);
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summaryProps: summary })
    });
    if (!res.ok) throw new Error('Failed to analyze data');
    setInsights(await res.json());
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setInsights(null);

    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: async (results) => {
          try {
            const hasAccess = await checkAndIncrementUsage();
            if (!hasAccess) {
              setError('You have reached your daily limit of 2 uploads.');
              setLoading(false);
              return;
            }

            const parsedData = results.data as any[];
            const cleanData = parsedData.filter(row => Object.keys(row).length > 0 && Object.values(row).some(v => v !== null));
            const cols = Object.keys(cleanData[0] || {});
            setData(cleanData);
            setColumns(cols);
            await analyzeDataset(cleanData, cols);
          } catch (err: any) {
            setError(err.message || 'Error processing file');
          } finally {
            setLoading(false);
          }
        },
        error: (err) => {
          setError(err.message);
          setLoading(false);
        }
      });
    } else if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const hasAccess = await checkAndIncrementUsage();
          if (!hasAccess) {
            setError('You have reached your daily limit of 2 uploads.');
            setLoading(false);
            return;
          }
          const json = JSON.parse(e.target?.result as string);
          const parsedData = Array.isArray(json) ? json : [json];
          const cols = Object.keys(parsedData[0] || {});
          setData(parsedData);
          setColumns(cols);
          await analyzeDataset(parsedData, cols);
        } catch (err: any) {
          setError('Invalid JSON format or analysis failed');
        } finally {
          setLoading(false);
        }
      };
      reader.readAsText(file);
    }
  }, [setData, setColumns, setInsights]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'], 'application/json': ['.json'] },
    maxFiles: 1
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Data Center</h1>
        <p className="text-muted-foreground text-sm">Upload CSV or JSON files to generate evidence-backed AI insights.</p>
      </header>

      <div {...getRootProps()} className={`glass-panel p-12 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${isDragActive ? 'border-accent bg-accent/5' : 'border-glass-border hover:border-primary/50'}`}>
        <input {...getInputProps()} />
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <UploadCloud className={`w-8 h-8 ${isDragActive ? 'text-accent' : 'text-muted-foreground'}`} />
        </div>
        <h3 className="text-xl font-semibold mb-2">{isDragActive ? 'Drop dataset here' : 'Drag & Drop dataset'}</h3>
        <p className="text-muted-foreground max-w-sm">Supports .csv and .json files. Data is profiled locally before Gemini interprets the verified evidence.</p>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-red-950/50 border border-red-900 flex items-center gap-3 text-red-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /><p>{error}</p>
        </motion.div>
      )}

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
          <AIPulse /><p className="mt-8 text-xl font-semibold text-glow text-accent">Profiling data and preparing evidence...</p>
          <p className="text-sm text-muted-foreground mt-2">Checking quality, statistics, and relationships before AI interpretation.</p>
        </motion.div>
      )}

      <AnimatePresence>
        {insights && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-accent/20 shadow-[0_0_20px_rgba(34,211,238,0.1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-[50px] -mr-10 -mt-10" />
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-accent" />AI Executive Summary</h3>
                <p className="text-sm leading-relaxed text-slate-300 font-medium border-l-2 border-accent pl-3">{insights.executiveSummary}</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4">Key Priorities</h3>
                <ul className="space-y-4 text-sm text-slate-300">{insights.insights?.map((insight: string, i: number) => <li key={i} className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" /><span>{insight}</span></li>)}</ul>
              </div>
            </div>

            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col h-full min-h-[400px]">
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div><h3 className="text-lg font-semibold">Dataset Preview</h3><p className="text-sm text-muted-foreground">{filteredData.length} records found • {columns.length} columns</p></div>
                <div className="flex items-center gap-2">
                  {drillDownData && <button onClick={() => setDrillDownData(null)} className="text-xs px-3 py-1 bg-accent/20 text-accent rounded-lg hover:bg-accent/30">Clear Filter</button>}
                  <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="bg-white/5 border border-glass-border px-4 py-2 rounded-xl text-sm focus:outline-none focus:border-accent" />
                </div>
              </div>
              <div className="flex-1 overflow-auto rounded-xl border border-glass-border">
                <table className="w-full text-sm text-left"><thead className="text-xs text-muted-foreground uppercase bg-white/5 sticky top-0"><tr>{columns.slice(0, 8).map(col => <th key={col} className="px-4 py-3 font-medium whitespace-nowrap">{col}</th>)}</tr></thead>
                  <tbody className="divide-y divide-glass-border">{paginatedData.map((row, i) => <tr key={i} className="hover:bg-white/5 transition-colors">{columns.slice(0, 8).map(col => <td key={col} className="px-4 py-3 whitespace-nowrap">{typeof row[col] === 'number' && Number.isInteger(row[col]) ? row[col] : typeof row[col] === 'number' ? row[col].toFixed(2) : String(row[col]).substring(0, 30)}</td>)}</tr>)}</tbody>
                </table>
              </div>
              {totalPages > 1 && <div className="mt-4 flex justify-between items-center text-sm"><button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="px-3 py-1 bg-white/5 rounded-lg disabled:opacity-50">Previous</button><span>Page {currentPage} of {totalPages}</span><button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="px-3 py-1 bg-white/5 rounded-lg disabled:opacity-50">Next</button></div>}
            </div>

            <div className="lg:col-span-3"><DynamicChartView data={data} columns={columns} insights={insights} onDrillDown={(dp) => {const key = Object.keys(dp)[0]; const val = dp[key]; setDrillDownData(data.filter(row => row[key] === val)); setCurrentPage(1);}} /></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
