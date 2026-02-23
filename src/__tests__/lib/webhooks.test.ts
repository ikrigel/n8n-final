import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildWebhookURL, sendWebhookRequest, testGetWebhook, testPostWebhook } from '@/lib/webhooks';

// Mock fetch globally
global.fetch = vi.fn();

describe('webhooks.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('buildWebhookURL', () => {
    it('should return test webhook URL for test environment', () => {
      const url = buildWebhookURL('test');
      expect(url).toContain('webhook-test');
      expect(url).toBe('https://ikrigel4.app.n8n.cloud/webhook-test/32e4df61-486f-42a5-a2e8-5fb0d595417d');
    });

    it('should return production webhook URL for production environment', () => {
      const url = buildWebhookURL('production');
      expect(url).not.toContain('webhook-test');
      expect(url).toBe('https://ikrigel4.app.n8n.cloud/webhook/32e4df61-486f-42a5-a2e8-5fb0d595417d');
    });
  });

  describe('sendWebhookRequest', () => {
    it('should send POST request with correct payload', async () => {
      const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValueOnce(''),
      });

      const result = await sendWebhookRequest(
        'test',
        'image',
        'user-123',
        'user@example.com',
        undefined,
        { prompt: 'A beautiful sunset' },
        'request-123'
      );

      expect(result.success).toBe(true);
      expect(result.queued).toBe(true);
      expect(mockFetch).toHaveBeenCalledOnce();

      // Check the call was made with POST
      const call = mockFetch.mock.calls[0];
      expect(call[1]?.method).toBe('POST');
      expect(call[1]?.headers['Content-Type']).toBe('application/json');
    });

    it('should handle HTTP errors gracefully', async () => {
      const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: vi.fn().mockResolvedValueOnce('Server error'),
      });

      const result = await sendWebhookRequest(
        'test',
        'image',
        'user-123',
        'user@example.com',
        undefined,
        { prompt: 'Test' },
        'request-123'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('500');
    });

    it('should handle network errors', async () => {
      const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
      mockFetch.mockRejectedValueOnce(new Error('Network timeout'));

      const result = await sendWebhookRequest(
        'test',
        'image',
        'user-123',
        'user@example.com',
        undefined,
        { prompt: 'Test' },
        'request-123'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network timeout');
    });

    it('should include telegram_id if provided', async () => {
      const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValueOnce(''),
      });

      await sendWebhookRequest(
        'test',
        'image',
        'user-123',
        'user@example.com',
        '123456789',
        { prompt: 'Test' },
        'request-123'
      );

      const call = mockFetch.mock.calls[0];
      const body = JSON.parse(call[1]?.body);
      expect(body.telegram_id).toBe('123456789');
    });
  });

  describe('testGetWebhook', () => {
    it('should make GET request to webhook', async () => {
      const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
      const mockData = { status: 'ok', message: 'Webhook working' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockData),
      });

      const result = await testGetWebhook('test');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledOnce();

      // Check GET method
      const call = mockFetch.mock.calls[0];
      expect(call[1]?.method).toBe('GET');
    });

    it('should handle GET request failures', async () => {
      const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: vi.fn().mockResolvedValueOnce('Not found'),
      });

      const result = await testGetWebhook('test');

      expect(result.success).toBe(false);
      expect(result.error).toContain('404');
    });
  });

  describe('testPostWebhook', () => {
    it('should send test POST request', async () => {
      const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
      const mockData = { success: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockData),
      });

      const result = await testPostWebhook('test', 'request-123');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);

      // Check payload structure
      const call = mockFetch.mock.calls[0];
      const body = JSON.parse(call[1]?.body);
      expect(body.workflow_type).toBe('test');
      expect(body.request_id).toBe('request-123');
    });

    it('should handle POST request errors', async () => {
      const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
      mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

      const result = await testPostWebhook('test', 'request-123');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Connection refused');
    });
  });
});
