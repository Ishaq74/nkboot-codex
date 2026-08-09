
import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { AstroConfig } from '../types';
import { FileTab, StylingChoice, DbAdapter, AuthProvider, BetterAuthEmailProvider } from '../types';
import { diffLines, type Change } from 'diff';
import { getRequiredEnvVars } from '../lib/env';
import {
  getPackageJsonContent,
  getAstroConfigContent,
  getTailwindConfigContent,
  getThemeCssContent,
  getDrizzleSchemaContent,
  getPrismaSchemaContent,
  getAuthTsContent,
  getMiddlewareTsContent,
  getApiAuthRouteContent,
  getAuthClientContent,
  getEmailUtilContent,
  getEnvDTsContent,
  getEnvContent,
} from '../lib/fileContentGenerators';

// --- HOOK TO STORE PREVIOUS VALUE ---
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


// --- MAIN COMPONENT ---
interface CodeViewerProps {
  config: AstroConfig;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<FileTab>(FileTab.PackageJson);
  const prevConfig = usePrevious(config);

  const getContentForTab = (tab: FileTab, cfg: AstroConfig): string => {
    switch (tab) {
        case FileTab.PackageJson: return getPackageJsonContent(cfg);
        case FileTab.AstroConfig: return getAstroConfigContent(cfg);
        case FileTab.TailwindConfig: return cfg.styling === StylingChoice.Tailwind ? getTailwindConfigContent(cfg) : '';
        case FileTab.ThemeCss: return getThemeCssContent(cfg);
        case FileTab.DrizzleSchema: return cfg.db.adapter === DbAdapter.Drizzle ? getDrizzleSchemaContent(cfg) : '';
        case FileTab.PrismaSchema: return cfg.db.adapter === DbAdapter.Prisma ? getPrismaSchemaContent(cfg) : '';
        case FileTab.AuthTs: return cfg.auth.provider === AuthProvider.BetterAuth ? getAuthTsContent(cfg) : '';
        case FileTab.MiddlewareTs: return cfg.auth.provider === AuthProvider.BetterAuth ? getMiddlewareTsContent() : '';
        case FileTab.ApiAuthRoute: return cfg.auth.provider === AuthProvider.BetterAuth ? getApiAuthRouteContent() : '';
        case FileTab.AuthClient: return cfg.auth.provider === AuthProvider.BetterAuth ? getAuthClientContent(cfg) : '';
        case FileTab.EmailUtil: return cfg.auth.provider === AuthProvider.BetterAuth && cfg.auth.betterAuth.emailProvider !== BetterAuthEmailProvider.None ? getEmailUtilContent(cfg) : '';
        case FileTab.EnvDTs: return cfg.auth.provider === AuthProvider.BetterAuth ? getEnvDTsContent() : '';
        case FileTab.Env: return getEnvContent(cfg);
        default: return '';
    }
  };
  
  const tabs = useMemo(() => {
      const availableTabs = [FileTab.PackageJson, FileTab.AstroConfig];
      if (config.styling === StylingChoice.Tailwind) availableTabs.push(FileTab.TailwindConfig);
      availableTabs.push(FileTab.ThemeCss);
      if (config.db.adapter === DbAdapter.Drizzle) availableTabs.push(FileTab.DrizzleSchema);
      if (config.db.adapter === DbAdapter.Prisma) availableTabs.push(FileTab.PrismaSchema);
      if (config.auth.provider === AuthProvider.BetterAuth) {
          availableTabs.push(FileTab.AuthTs, FileTab.MiddlewareTs, FileTab.ApiAuthRoute, FileTab.AuthClient, FileTab.EnvDTs);
          if (config.auth.betterAuth.emailProvider !== BetterAuthEmailProvider.None) {
              availableTabs.push(FileTab.EmailUtil);
          }
      }
      if (getRequiredEnvVars(config).length > 0) {
          availableTabs.push(FileTab.Env);
      }
      return availableTabs;
  }, [config]);

  useEffect(() => {
    // If the active tab is no longer available, switch to the first one.
    if (!tabs.includes(activeTab)) {
        setActiveTab(tabs[0]);
    }
  }, [tabs, activeTab]);

  const diffs = useMemo<Change[]>(() => {
    const newContent = getContentForTab(activeTab, config);
    // On first load, treat the entire file as an addition
    if (!prevConfig) {
      return [{ value: newContent, added: true, removed: false, count: newContent.split('\n').length }];
    }
    const oldContent = getContentForTab(activeTab, prevConfig);
    return diffLines(oldContent, newContent);
  }, [activeTab, config, prevConfig]);


  return (
    <div className="bg-raisin-black h-full flex flex-col font-mono">
      <div className="flex-shrink-0 bg-gunmetal border-b border-jet">
        <nav className="flex space-x-2 p-2 overflow-x-auto">
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1 text-sm rounded-md flex-shrink-0 ${activeTab === tab ? 'bg-jet text-cyber-yellow' : 'text-gray-400 hover:bg-jet/50'}`}
                >
                    {tab}
                </button>
            ))}
        </nav>
      </div>
      <div className="p-4 flex-grow overflow-auto text-light-gray text-xs">
          <pre>
            <code>
              {diffs.map((part, partIndex) => {
                const lines = part.value.split('\n').filter((line, i, arr) => i < arr.length - 1 || line !== '');
                let style = {};
                let prefix = ' ';
                if (part.added) {
                  style = { backgroundColor: 'rgba(44, 150, 88, 0.2)' };
                  prefix = '+';
                } else if (part.removed) {
                  style = { backgroundColor: 'rgba(248, 81, 73, 0.2)' };
                  prefix = '-';
                }
                
                return (
                  <span key={partIndex} style={style} className="block">
                    {lines.map((line, lineIndex) => (
                      <div key={lineIndex} className="flex">
                         <span className={`w-6 flex-shrink-0 text-left pl-2 ${part.added ? 'text-green-400' : part.removed ? 'text-red-400' : 'text-gray-500'}`}>{prefix}</span>
                         <span className="flex-grow">{line}</span>
                      </div>
                    ))}
                  </span>
                );
              })}
            </code>
          </pre>
      </div>
    </div>
  );
};