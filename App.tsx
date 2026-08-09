
import React, { useEffect, useState, useCallback } from 'react';
import { Header } from './components/Header';
import { MultiStepForm } from './components/MultiStepForm';
import { CliVisualizer } from './components/CliVisualizer';
import { CodeViewer } from './components/CodeViewer';
import type { AstroConfig } from './types';
import { Template, TypeScriptLevel, PackageManager, StylingChoice, ComponentLibrary, ThemeMode, DbProvider, DbAdapter, AuthProvider, BetterAuthEmailProvider } from './types';
import { initialTheme } from './lib/theme';
import { getInitialSchema } from './lib/schema';

const STORAGE_KEY = 'nkbooting-prime-config';
const STORAGE_VERSION = 1;


const createInitialConfig = (): AstroConfig => {

    const initialBaseConfig: Omit<AstroConfig, 'schema'> = {
        projectName: 'my-astro-site',
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
        i18n: {
            locales: ['en'],
            defaultLocale: 'en'
        },
        db: {
            sameForDevProd: true,
            dev: { provider: DbProvider.None },
            prod: { provider: DbProvider.None },
            adapter: DbAdapter.None
        },
        auth: {
            provider: AuthProvider.None,
            betterAuth: {
                plugins: {},
                emailProvider: BetterAuthEmailProvider.None,
            }
        },
        envVars: {}
    };
    return {
        ...initialBaseConfig,
        schema: getInitialSchema(initialBaseConfig),
    };
};

const mergeStoredConfig = (storedConfig: Partial<AstroConfig>): AstroConfig => {
  const initialConfig = createInitialConfig();
  return {
    ...initialConfig,
    ...storedConfig,
    i18n: { ...initialConfig.i18n, ...storedConfig.i18n },
    db: {
      ...initialConfig.db,
      ...storedConfig.db,
      dev: { ...initialConfig.db.dev, ...storedConfig.db?.dev },
      prod: { ...initialConfig.db.prod, ...storedConfig.db?.prod },
    },
    auth: {
      ...initialConfig.auth,
      ...storedConfig.auth,
      betterAuth: { ...initialConfig.auth.betterAuth, ...storedConfig.auth?.betterAuth },
    },
    theme: {
      ...initialConfig.theme,
      ...storedConfig.theme,
      syncLocks: { ...initialConfig.theme.syncLocks, ...storedConfig.theme?.syncLocks },
    },
    schema: storedConfig.schema ?? initialConfig.schema,
    envVars: { ...initialConfig.envVars, ...storedConfig.envVars },
  };
};

const loadInitialConfig = (): AstroConfig => {
  if (typeof window === 'undefined') return createInitialConfig();

  try {
    const savedConfig = window.localStorage.getItem(STORAGE_KEY);
    if (!savedConfig) return createInitialConfig();

    const parsedConfig = JSON.parse(savedConfig) as { version?: number; config?: Partial<AstroConfig> } | Partial<AstroConfig>;
    const storedConfig = 'config' in parsedConfig ? parsedConfig.config : parsedConfig;
    return mergeStoredConfig(storedConfig ?? {});
  } catch (error) {
    console.warn('Unable to restore saved NKBOOTING PRIME config.', error);
    return createInitialConfig();
  }
};

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<AstroConfig>(loadInitialConfig);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, config }));
    } catch (error) {
      console.warn('Unable to persist NKBOOTING PRIME config.', error);
    }
  }, [config]);

  const resetConfig = useCallback(() => {
    const shouldReset = window.confirm('Réinitialiser toute la configuration du wizard ?');
    if (!shouldReset) return;

    setConfig(createInitialConfig());
    setCurrentStep(0);
  }, []);

  const updateConfig = useCallback((newConfig: Partial<AstroConfig> | ((c: AstroConfig) => AstroConfig)) => {
    setConfig(prev => {
        const updated = typeof newConfig === 'function' ? newConfig(prev) : { ...prev, ...newConfig };

        // If auth provider changes, reset schema
        if (typeof newConfig !== 'function' && 'auth' in newConfig) {
            if (newConfig.auth?.provider !== prev.auth.provider) {
                updated.schema = getInitialSchema(updated);
            }
        }
        
        return updated;
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-raisin-black">
      <Header config={config} onReset={resetConfig} />
      <main className="flex-grow p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 overflow-auto">
        {/* Left Column */}
        <div className="bg-jet rounded-lg shadow-lg p-4 md:p-6 overflow-auto">
          <MultiStepForm 
            config={config} 
            updateConfig={updateConfig}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 min-h-0">
            <div className="bg-jet rounded-lg shadow-lg overflow-hidden flex-1 flex flex-col min-h-0">
                <CliVisualizer config={config} currentStep={currentStep} />
            </div>
            <div className="bg-jet rounded-lg shadow-lg overflow-hidden flex-1 flex flex-col min-h-0">
                <CodeViewer config={config} />
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;