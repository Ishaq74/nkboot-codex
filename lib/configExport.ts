import type { AstroConfig } from '../types';
import { downloadTextFile } from './downloadUtils';

const sanitizeConfigName = (name: string): string => {
  const sanitized = name.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  return sanitized || 'astro-project';
};

export const getConfigExportContent = (config: AstroConfig): string => {
  return JSON.stringify({ version: 1, config }, null, 2);
};

export const downloadConfigJson = (config: AstroConfig): void => {
  downloadTextFile(`${sanitizeConfigName(config.projectName)}.nkboot.json`, getConfigExportContent(config));
};
