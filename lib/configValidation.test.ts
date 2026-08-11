import { describe, expect, it } from 'vitest';
import type { AstroConfig } from '../types';
import { PackageManager, Template, TypeScriptLevel, StylingChoice, ComponentLibrary, ThemeMode, DbProvider, DbAdapter, AuthProvider, BetterAuthEmailProvider } from '../types';
import { initialTheme } from './theme';
import { getInitialSchema } from './schema';
import { extractStoredConfig, sanitizeAstroConfig, sanitizeSchema } from './configValidation';

const createInitialConfig = (): AstroConfig => {
  const base: Omit<AstroConfig, 'schema'> = {
    projectName: 'demo',
    template: Template.Minimal,
    typescript: TypeScriptLevel.Strict,
    installDeps: true,
    initGit: true,
    packageManager: PackageManager.NPM,
    useAstroFont: false,
    useAstroIcon: false,
    iconLibraries: {},
    styling: StylingChoice.Custom,
    componentLibrary: ComponentLibrary.None,
    selectedComponents: {},
    theme: initialTheme,
    useI18n: false,
    i18n: { locales: ['en'], defaultLocale: 'en' },
    db: { sameForDevProd: true, dev: { provider: DbProvider.None }, prod: { provider: DbProvider.None }, adapter: DbAdapter.None },
    auth: { provider: AuthProvider.None, betterAuth: { plugins: {}, emailProvider: BetterAuthEmailProvider.None } },
    envVars: {},
  };

  return { ...base, schema: getInitialSchema(base) };
};

describe('configValidation', () => {
  it('sanitizes imported config values back to supported enums and shapes', () => {
    const config = sanitizeAstroConfig({
      projectName: '  Imported Site  ',
      template: 'invalid',
      packageManager: PackageManager.PNPM,
      db: { adapter: DbAdapter.Drizzle, dev: { provider: DbProvider.Neon } },
      schema: { tables: [{ id: 'posts', name: 'Blog Posts!', columns: [{ id: 'title', name: 'Title', type: 'bad', options: { notNull: true } }] }] },
    }, createInitialConfig());

    expect(config.projectName).toBe('Imported Site');
    expect(config.template).toBe(Template.Minimal);
    expect(config.packageManager).toBe(PackageManager.PNPM);
    expect(config.db.adapter).toBe(DbAdapter.Drizzle);
    expect(config.schema.tables[0].name).toBe('blog_posts');
    expect(config.schema.tables[0].columns[0].name).toBe('id');
  });

  it('extracts versioned stored configs and rejects empty schemas', () => {
    expect(extractStoredConfig({ version: 1, config: { projectName: 'x' } })).toEqual({ projectName: 'x' });
    expect(sanitizeSchema({ tables: [] }).tables).toHaveLength(0);
  });
});
