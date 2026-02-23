import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LogsPanel from '@/components/logs/LogsPanel';
import { LogsProvider } from '@/contexts/LogsContext';
import { LogEntry } from '@/types';

// Create a test wrapper with the LogsProvider
const renderWithLogsContext = (component: React.ReactElement) => {
  return render(<LogsProvider>{component}</LogsProvider>);
};

describe('LogsPanel Component', () => {
  it('should render without crashing', () => {
    renderWithLogsContext(<LogsPanel />);
    expect(screen.getByText(/showing/i)).toBeInTheDocument();
  });

  it('should display empty state when no logs', () => {
    renderWithLogsContext(<LogsPanel />);
    expect(screen.getByText(/no logs yet/i)).toBeInTheDocument();
  });

  it('should have filter dropdown', () => {
    renderWithLogsContext(<LogsPanel />);
    const filterDropdown = screen.getByRole('combobox');
    expect(filterDropdown).toBeInTheDocument();
    expect(filterDropdown).toHaveValue('all');
  });

  it('should have clear button', () => {
    renderWithLogsContext(<LogsPanel />);
    const clearButton = screen.getByRole('button', { name: /clear/i });
    expect(clearButton).toBeInTheDocument();
  });

  it('should show max entries prop in summary', () => {
    renderWithLogsContext(<LogsPanel maxEntries={5} />);
    expect(screen.getByText(/showing 0 of 0 logs/i)).toBeInTheDocument();
  });

  it('should have filter options', () => {
    renderWithLogsContext(<LogsPanel />);
    const filterSelect = screen.getByRole('combobox') as HTMLSelectElement;
    expect(filterSelect.value).toBe('all');

    fireEvent.change(filterSelect, { target: { value: 'info' } });
    expect(filterSelect.value).toBe('info');
  });

  it('should render filter dropdown with correct options', () => {
    const { container } = renderWithLogsContext(<LogsPanel />);
    const select = container.querySelector('select');
    const options = select?.querySelectorAll('option');

    expect(options).toHaveLength(4); // all, info, debug, error
    expect(options?.[0].textContent).toBe('All');
    expect(options?.[1].textContent).toBe('Info');
    expect(options?.[2].textContent).toBe('Debug');
    expect(options?.[3].textContent).toBe('Error');
  });

  it('should have proper styling classes', () => {
    const { container } = renderWithLogsContext(<LogsPanel />);
    const logsContainer = container.querySelector('.space-y-3');
    expect(logsContainer).toBeInTheDocument();
  });

  it('should have max-height for scrollable content', () => {
    const { container } = renderWithLogsContext(<LogsPanel />);
    const scrollableDiv = container.querySelector('.max-h-80');
    expect(scrollableDiv).toBeInTheDocument();
  });
});
