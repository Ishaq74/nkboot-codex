import JSZip from 'jszip';
import type { AstroConfig } from '../types';
import { AuthProvider, BetterAuthEmailProvider, DbAdapter, FileTab, StylingChoice } from '../types';
import { getRequiredEnvVars } from './env';
import {
  getApiAuthRouteContent,
  getAstroConfigContent,
  getAuthClientContent,
  getAuthTsContent,
  getDrizzleSchemaContent,
  getEmailUtilContent,
  getEnvContent,
  getEnvDTsContent,
  getMiddlewareTsContent,
  getPackageJsonContent,
  getPrismaSchemaContent,
  getTailwindConfigContent,
  getThemeCssContent,
} from './fileContentGenerators';

export type GeneratedProjectFile = {
  path: string;
  content: string;
};

const sanitizeProjectName = (name: string): string => {
  const sanitized = name.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  return sanitized || 'astro-project';
};

const getGeneratedReadme = (config: AstroConfig): string => `# ${config.projectName || 'Astro Project'}

Generated with NKBOOTING PRIME.

## Getting started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Generated files

This archive contains the selected Astro configuration, theme CSS, and optional database/auth files based on your wizard choices.
`;

const getGeneratedIndexPage = (config: AstroConfig): string => `---
import '../styles/theme.css';
---

<html lang="${config.i18n.defaultLocale || 'en'}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>${config.projectName || 'Astro Project'}</title>
  </head>
  <body>
    <main>
      <h1>${config.projectName || 'Astro Project'}</h1>
      <p>Your generated Astro foundation is ready.</p>
    </main>
  </body>
</html>
`;

const getGeneratedTsConfig = (): string => JSON.stringify({
  extends: 'astro/tsconfigs/strict',
}, null, 2);

export const getGeneratedProjectFiles = (config: AstroConfig): GeneratedProjectFile[] => {
  const files: GeneratedProjectFile[] = [
    { path: FileTab.PackageJson, content: getPackageJsonContent(config) },
    { path: FileTab.AstroConfig, content: getAstroConfigContent(config) },
    { path: 'tsconfig.json', content: getGeneratedTsConfig() },
    { path: 'README.md', content: getGeneratedReadme(config) },
    { path: 'src/pages/index.astro', content: getGeneratedIndexPage(config) },
    { path: FileTab.ThemeCss, content: getThemeCssContent(config) },
    { path: 'nkboot.config.json', content: JSON.stringify(config, null, 2) },
  ];

  if (config.styling === StylingChoice.Tailwind) {
    files.push({ path: FileTab.TailwindConfig, content: getTailwindConfigContent(config) });
  }
  if (config.db.adapter === DbAdapter.Drizzle) {
    files.push({ path: FileTab.DrizzleSchema, content: getDrizzleSchemaContent(config) });
  }
  if (config.db.adapter === DbAdapter.Prisma) {
    files.push({ path: FileTab.PrismaSchema, content: getPrismaSchemaContent(config) });
  }
  if (config.auth.provider === AuthProvider.BetterAuth) {
    files.push(
      { path: FileTab.AuthTs, content: getAuthTsContent(config) },
      { path: FileTab.MiddlewareTs, content: getMiddlewareTsContent() },
      { path: FileTab.ApiAuthRoute, content: getApiAuthRouteContent() },
      { path: FileTab.AuthClient, content: getAuthClientContent(config) },
      { path: FileTab.EnvDTs, content: getEnvDTsContent() },
    );

    if (config.auth.betterAuth.emailProvider !== BetterAuthEmailProvider.None) {
      files.push({ path: FileTab.EmailUtil, content: getEmailUtilContent(config) });
    }
  }
  if (getRequiredEnvVars(config).length > 0) {
    files.push({ path: FileTab.Env, content: getEnvContent(config) });
  }

  return files.sort((a, b) => a.path.localeCompare(b.path));
};

export const downloadGeneratedProject = async (config: AstroConfig): Promise<void> => {
  if (typeof document === 'undefined') return;

  const zip = new JSZip();
  const projectName = sanitizeProjectName(config.projectName);
  const root = zip.folder(projectName);

  if (!root) return;

  getGeneratedProjectFiles(config).forEach((file) => {
    root.file(file.path, file.content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${projectName}.zip`;
  link.rel = 'noopener';
  link.click();
  URL.revokeObjectURL(url);
};
