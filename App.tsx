
import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { MultiStepForm } from './components/MultiStepForm';
import { CliVisualizer } from './components/CliVisualizer';
import { CodeViewer } from './components/CodeViewer';
import type { AstroConfig } from './types';
import { Template, TypeScriptLevel, PackageManager, StylingChoice, ComponentLibrary, ThemeMode, DbProvider, DbAdapter, AuthProvider, BetterAuthEmailProvider } from './types';
import { initialTheme } from './lib/theme';
import { getInitialSchema } from './lib/schema';


const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const [config, setConfig] = useState<AstroConfig>(() => {
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
  });

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
      <Header />
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