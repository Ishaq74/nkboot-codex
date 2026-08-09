import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AstroConfig } from '../types';
import { DbAdapter } from '../types';
import { generateSchemaViaProxy } from './schemaAi';

const baseConfig = {
  db: { adapter: DbAdapter.Drizzle },
  schema: { tables: [] },
} as AstroConfig;

describe('generateSchemaViaProxy', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('posts only schema context to the backend proxy', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ tables: [{ id: 'posts', name: 'posts', columns: [] }] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const schema = await generateSchemaViaProxy(baseConfig, 'add posts');

    expect(fetchMock).toHaveBeenCalledWith('/api/generate-schema', expect.objectContaining({ method: 'POST' }));
    expect(schema.tables[0].name).toBe('posts');
  });

  it('rejects invalid proxy payloads', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));

    await expect(generateSchemaViaProxy(baseConfig, 'bad payload')).rejects.toThrow('invalid schema');
  });
});
