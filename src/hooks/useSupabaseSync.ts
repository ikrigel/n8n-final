'use client';

import { useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  createRequestTask,
  pollForResponse,
  fetchGalleryItems,
  registerUser,
} from '@/lib/supabase-helpers';
import { WebhookEnvironment, WorkflowType } from '@/types';

/**
 * Hook to sync app data with Supabase
 * Handles registration, task creation, and gallery fetching
 */
export function useSupabaseSync() {
  const { userEmail, isAuthenticated } = useAuth();

  // Register user on first authentication
  useEffect(() => {
    if (isAuthenticated && userEmail && userEmail !== 'user@example.com') {
      registerUser(userEmail).catch((err) => {
        console.error('Failed to register user:', err);
      });
    }
  }, [isAuthenticated, userEmail]);

  /**
   * Create a workflow request task in Supabase
   */
  const createTask = useCallback(
    async (
      workflowType: WorkflowType,
      env: WebhookEnvironment,
      requestId: string,
      payload: Record<string, any>
    ) => {
      if (!userEmail || userEmail === 'user@example.com') {
        return { success: false, error: 'User not authenticated' };
      }

      return createRequestTask(userEmail, workflowType, env, requestId, payload);
    },
    [userEmail]
  );

  /**
   * Poll for workflow result from Supabase
   */
  const waitForResponse = useCallback(
    async (requestId: string, maxWait?: number) => {
      return pollForResponse(requestId, maxWait);
    },
    []
  );

  /**
   * Fetch gallery items from Supabase
   */
  const loadGallery = useCallback(
    async (filters?: {
      type?: 'image' | 'video';
      env?: WebhookEnvironment;
      startDate?: string;
      endDate?: string;
      searchText?: string;
    }) => {
      if (!userEmail || userEmail === 'user@example.com') {
        return { success: false, error: 'User not authenticated', items: [] };
      }

      return fetchGalleryItems(userEmail, filters);
    },
    [userEmail]
  );

  return {
    isSupabaseReady: isAuthenticated && userEmail !== 'user@example.com',
    createTask,
    waitForResponse,
    loadGallery,
  };
}
