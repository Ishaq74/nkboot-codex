import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const readRequestBody = async (req: { on: (event: string, callback: (chunk?: Buffer) => void) => void }): Promise<string> => {
  const chunks: Buffer[] = [];

  await new Promise<void>((resolve, reject) => {
    req.on('data', (chunk) => {
      if (chunk) chunks.push(Buffer.from(chunk));
    });
    req.on('end', () => resolve());
    req.on('error', () => reject(new Error('Unable to read request body.')));
  });

  return Buffer.concat(chunks).toString('utf8');
};

const createSchemaPrompt = (body: { prompt?: string; adapter?: string; currentSchema?: unknown }): string => `You are a database schema designer for an Astro project using ${body.adapter || 'an ORM'}.
The current schema is:
\`\`\`json
${JSON.stringify(body.currentSchema || { tables: [] }, null, 2)}
\`\`\`

The user request is: "${body.prompt || ''}".

Return only JSON matching this exact shape:
{
  "tables": [
    {
      "id": "string",
      "name": "snake_case_table_name",
      "columns": [
        {
          "id": "string",
          "name": "snake_case_column_name",
          "type": "id | string | text | number | boolean | date | json | relation",
          "options": {
            "primaryKey": true,
            "notNull": true,
            "unique": false,
            "default": "optional string/number/boolean",
            "relatedTo": "optional_related_table"
          }
        }
      ]
    }
  ]
}

Rules:
- Preserve existing tables and columns unless the user explicitly asks to change them.
- Ensure every table has an id primary key.
- Use snake_case for table and column names.
- Do not include commentary or markdown.`;

const schemaProxyPlugin = (apiKey?: string, model = 'gemini-2.5-flash'): Plugin => ({
  name: 'nkboot-schema-proxy',
  configureServer(server) {
    server.middlewares.use('/api/generate-schema', async (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
      }

      if (!apiKey) {
        res.statusCode = 501;
        res.end(JSON.stringify({ error: 'GEMINI_API_KEY is not configured on the server.' }));
        return;
      }

      try {
        const body = JSON.parse(await readRequestBody(req)) as { prompt?: string; adapter?: string; currentSchema?: unknown };
        if (!body.prompt?.trim()) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Missing prompt.' }));
          return;
        }

        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: createSchemaPrompt(body) }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        });

        if (!geminiResponse.ok) {
          res.statusCode = geminiResponse.status;
          res.end(JSON.stringify({ error: 'Gemini schema generation failed.' }));
          return;
        }

        const payload = await geminiResponse.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
        const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          res.statusCode = 502;
          res.end(JSON.stringify({ error: 'Gemini response did not include JSON text.' }));
          return;
        }

        res.end(text);
      } catch (error) {
        console.error(error);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Schema proxy failed.' }));
      }
    });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), schemaProxyPlugin(env.GEMINI_API_KEY, env.GEMINI_MODEL)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
