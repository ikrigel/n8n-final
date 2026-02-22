'use client';

import React from 'react';

interface GalleryFiltersProps {
  onTypeChange: (type: 'all' | 'image' | 'video') => void;
  onEnvChange: (env: 'all' | 'test' | 'production') => void;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onSearchChange: (text: string) => void;
  currentType: 'all' | 'image' | 'video';
  currentEnv: 'all' | 'test' | 'production';
  currentDateFrom: string;
  currentDateTo: string;
  currentSearch: string;
}

/**
 * Gallery filter controls
 */
export default function GalleryFilters({
  onTypeChange,
  onEnvChange,
  onDateFromChange,
  onDateToChange,
  onSearchChange,
  currentType,
  currentEnv,
  currentDateFrom,
  currentDateTo,
  currentSearch,
}: GalleryFiltersProps) {
  return (
    <div className="card space-y-4">
      <h2 className="font-bold text-lg">Filters</h2>

      {/* Media Type Filter */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Media Type</label>
        <div className="flex gap-2 flex-wrap">
          {['all', 'image', 'video'].map((type) => (
            <button
              key={type}
              onClick={() => onTypeChange(type as any)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {type === 'all' && '📷 All'}
              {type === 'image' && '🖼️ Images'}
              {type === 'video' && '🎬 Videos'}
            </button>
          ))}
        </div>
      </div>

      {/* Environment Filter */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Environment</label>
        <div className="flex gap-2 flex-wrap">
          {['all', 'test', 'production'].map((env) => (
            <button
              key={env}
              onClick={() => onEnvChange(env as any)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentEnv === env
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {env === 'all' && '🌍 All'}
              {env === 'test' && '🧪 Test'}
              {env === 'production' && '🚀 Production'}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Date Range</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={currentDateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="input-field text-sm"
            placeholder="From"
          />
          <input
            type="date"
            value={currentDateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="input-field text-sm"
            placeholder="To"
          />
        </div>
      </div>

      {/* Search Filter */}
      <div className="space-y-2">
        <label htmlFor="search" className="block text-sm font-medium">
          Search Prompt
        </label>
        <input
          id="search"
          type="text"
          value={currentSearch}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by prompt or description..."
          className="input-field text-sm"
        />
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={() => {
          onTypeChange('all');
          onEnvChange('all');
          onDateFromChange('');
          onDateToChange('');
          onSearchChange('');
        }}
        className="btn-secondary w-full text-sm"
      >
        🔄 Clear Filters
      </button>
    </div>
  );
}
