import type { AstroConfig } from '../types';

const SCHEMA_PROXY_ENDPOINT = '/api/generate-schema';

export const generateSchemaViaProxy = async (config: AstroConfig, prompt: string): Promise<AstroConfig['schema']> => {
  const response = await fetch(SCHEMA_PROXY_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      adapter: config.db.adapter,
      currentSchema: config.schema,
    }),
  });

  if (!response.ok) {
    throw new Error(`Schema proxy request failed with ${response.status}`);
  }

  const payload = await response.json() as Partial<AstroConfig['schema']>;
  if (!Array.isArray(payload.tables)) {
    throw new Error('Schema proxy returned an invalid schema payload.');
  }

  return { tables: payload.tables };
};
