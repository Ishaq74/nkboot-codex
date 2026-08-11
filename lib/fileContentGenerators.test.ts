import { describe, expect, it } from 'vitest';
import type { AstroConfig } from '../types';
import { AuthProvider, BetterAuthEmailProvider, ComponentLibrary, DbAdapter, DbProvider, PackageManager, StylingChoice, Template, ThemeMode, TypeScriptLevel } from '../types';
import { initialTheme } from './theme';
import { getInitialSchema } from './schema';
import { getPackageJsonContent, getThemeCssContent } from './fileContentGenerators';
import { getGeneratedProjectFiles } from './exportProject';

const createConfig = (overrides: Partial<AstroConfig> = {}): AstroConfig => {
  const base: Omit<AstroConfig, 'schema'> = {
    projectName: 'demo-site',
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
    db: {
      sameForDevProd: true,
      dev: { provider: DbProvider.None },
      prod: { provider: DbProvider.None },
      adapter: DbAdapter.None,
    },
    auth: {
      provider: AuthProvider.None,
      betterAuth: { plugins: {}, emailProvider: BetterAuthEmailProvider.None },
    },
    envVars: {},
  };

  const config = { ...base, schema: getInitialSchema(base), ...overrides };
  return config;
};

describe('file content generators', () => {
  it('adds Tailwind files and dependencies when Tailwind is selected', () => {
    const config = createConfig({ styling: StylingChoice.Tailwind });
    const packageJson = JSON.parse(getPackageJsonContent(config));
    const files = getGeneratedProjectFiles(config).map((file) => file.path);

    expect(packageJson.dependencies.tailwindcss).toBeDefined();
    expect(files).toContain('tailwind.config.mjs');
    expect(files).toContain('src/pages/index.astro');
    expect(files).toContain('nkboot.config.json');
    expect(files).toContain('.env.example');
    expect(files).toContain('.gitignore');
    expect(getThemeCssContent(config)).toContain('@tailwind base;');
    expect(getThemeCssContent(createConfig())).toContain('background-color: var(--background);');
  });


  it('keeps generated export files deterministic and complete enough to boot', () => {
    const files = getGeneratedProjectFiles(createConfig());

    expect(files.map((file) => file.path)).toEqual([...files.map((file) => file.path)].sort((a, b) => a.localeCompare(b)));
    expect(files.find((file) => file.path === 'src/pages/index.astro')?.content).toContain("import '../styles/theme.css';");
    expect(files.find((file) => file.path === 'tsconfig.json')?.content).toContain('astro/tsconfigs/strict');
    expect(files.find((file) => file.path === 'nkboot.config.json')?.content).toContain('\"version\": 1');
  });

  it('adds environment files for remote database adapters', () => {
    const config = createConfig({
      db: {
        sameForDevProd: true,
        dev: { provider: DbProvider.Neon },
        prod: { provider: DbProvider.None },
        adapter: DbAdapter.Drizzle,
      },
    });

    expect(getGeneratedProjectFiles(config).map((file) => file.path)).toContain('.env');
  });
});
