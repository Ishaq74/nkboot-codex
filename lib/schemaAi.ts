import type { AstroConfig } from '../types';
import { sanitizeSchema } from './configValidation';

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

  const payload = await response.json() as unknown;
  const schema = sanitizeSchema(payload);
  if (schema.tables.length === 0) {
    throw new Error('Schema proxy returned an invalid schema payload.');
  }

  return schema;
};
