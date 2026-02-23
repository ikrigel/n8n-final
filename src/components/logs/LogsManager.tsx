'use client';

import React, { useState, useEffect } from 'react';
import { useLogger } from '@/hooks/useLogger';

/**
 * Comprehensive logs management component with view and delete functionality
 */
export default function LogsManager() {
  const { logs, clearLogs } = useLogger();
  const [filteredLogs, setFilteredLogs] = useState(logs);
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLogs, setSelectedLogs] = useState<Set<number>>(new Set());

  useEffect(() => {
    let filtered = logs;

    // Filter by level
    if (filterLevel !== 'all') {
      filtered = filtered.filter(log => log.level === filterLevel);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        log =>
          log.message.toLowerCase().includes(term) ||
          JSON.stringify(log.meta).toLowerCase().includes(term)
      );
    }

    setFilteredLogs(filtered);
  }, [logs, filterLevel, searchTerm]);

  const handleSelectLog = (index: number) => {
    const newSelected = new Set(selectedLogs);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedLogs(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedLogs.size === filteredLogs.length) {
      setSelectedLogs(new Set());
    } else {
      setSelectedLogs(new Set(filteredLogs.map((_, i) => i)));
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Delete ${selectedLogs.size} log(s)?`)) {
      // Get indices of selected logs in the original logs array
      const indicesToDelete = filteredLogs
        .map((log, idx) => logs.indexOf(log))
        .filter((idx, i) => selectedLogs.has(i));

      // For now, show a success message - actual deletion would depend on backend
      setSelectedLogs(new Set());
      alert(`${indicesToDelete.length} log(s) would be deleted`);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200';
      case 'info':
        return 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200';
      case 'debug':
        return 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900/40 text-gray-800 dark:text-gray-200';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return '❌';
      case 'warn':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'debug':
        return '🐛';
      default:
        return '📝';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          📋 Logs Manager
        </h2>
        <button
          onClick={clearLogs}
          className="btn-secondary text-sm"
        >
          Clear All Logs
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="card text-center">
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
            {logs.length}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mt-1">
            Total Logs
          </p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">
            {logs.filter(l => l.level === 'error').length}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mt-1">
            Errors
          </p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
            {logs.filter(l => l.level === 'debug').length}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mt-1">
            Debug
          </p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {logs.filter(l => l.level === 'info').length}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mt-1">
            Info
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Level Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Log Level
            </label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="select-field"
            >
              <option value="all">All Levels</option>
              <option value="error">Errors Only</option>
              <option value="info">Info Only</option>
              <option value="debug">Debug Only</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col justify-end gap-2">
            {selectedLogs.size > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="btn-secondary text-sm bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800"
              >
                Delete {selectedLogs.size} Selected
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {logs.length === 0 ? '📭 No logs yet' : '🔍 No logs match your filters'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-50 dark:bg-amber-900/20 border-b-2 border-amber-200 dark:border-amber-900/40">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedLogs.size === filteredLogs.length && filteredLogs.length > 0}
                      onChange={handleSelectAll}
                      className="checkbox-field cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Level
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Message
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => {
                  const actualIndex = logs.indexOf(log);
                  return (
                    <tr
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedLogs.has(index)}
                          onChange={() => handleSelectLog(index)}
                          className="checkbox-field cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${getLevelColor(
                            log.level
                          )}`}
                        >
                          {getLevelIcon(log.level)} {log.level.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {log.message}
                          </p>
                          {log.meta && Object.keys(log.meta).length > 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {JSON.stringify(log.meta)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredLogs.length} of {logs.length} logs
      </div>
    </div>
  );
}
