'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { LogEntry } from '@/types';
import { saveLogs, loadLogs } from '@/lib/localStorage';

interface LogsContextType {
  logs: LogEntry[];
  addLog: (log: LogEntry) => void;
  clearLogs: () => void;
  getLogs: (filter?: { level?: string }) => LogEntry[];
}

const LogsContext = createContext<LogsContextType | undefined>(undefined);

export function LogsProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    const loaded = loadLogs();
    setLogs(loaded);
    setMounted(true);
  }, []);

  // Save logs to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      saveLogs(logs);
    }
  }, [logs, mounted]);

  const addLog = (log: LogEntry) => {
    setLogs((prev) => {
      // Keep last 100 logs to avoid localStorage bloat
      const updated = [log, ...prev].slice(0, 100);
      return updated;
    });
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const getLogs = (filter?: { level?: string }) => {
    if (!filter?.level) return logs;
    return logs.filter((log) => log.level === filter.level);
  };

  if (!mounted) {
    return null;
  }

  return (
    <LogsContext.Provider value={{ logs, addLog, clearLogs, getLogs }}>
      {children}
    </LogsContext.Provider>
  );
}

export function useLogs() {
  const context = useContext(LogsContext);
  if (!context) {
    throw new Error('useLogs must be used within LogsProvider');
  }
  return context;
}
