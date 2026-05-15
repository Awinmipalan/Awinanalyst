import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DataContextType {
  data: any[];
  setData: (data: any[]) => void;
  columns: string[];
  setColumns: (cols: string[]) => void;
  insights: any;
  setInsights: (insights: any) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [insights, setInsights] = useState<any>(null);

  return (
    <DataContext.Provider value={{ data, setData, columns, setColumns, insights, setInsights }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
