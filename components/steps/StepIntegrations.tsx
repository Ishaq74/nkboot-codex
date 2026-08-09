
import React from 'react';
import type { AstroConfig } from '../../types';
import { Option } from '../form/Option';
import { impactMap, type ImpactType } from '../../lib/constants';
import { availableLanguages, availableIconLibraries } from '../../lib/stepData';

interface StepProps {
    config: AstroConfig;
    updateConfig: (newConfig: Partial<AstroConfig>) => void;
}

export const StepIntegrations: React.FC<StepProps> = ({ config, updateConfig }) => {
  const handleLanguageToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const langCode = e.currentTarget.dataset.code as string;
    const newLocales = config.i18n.locales.includes(langCode)
        ? config.i18n.locales.filter(l => l !== langCode)
        : [...config.i18n.locales, langCode].sort();

    let newDefaultLocale = config.i18n.defaultLocale;
    if (!newLocales.includes(newDefaultLocale)) newDefaultLocale = newLocales[0] || 'en';
    if (config.i18n.locales.length === 0 && newLocales.length > 0) newDefaultLocale = newLocales[0];
    updateConfig({ i18n: { locales: newLocales, defaultLocale: newDefaultLocale } });
  };
    
  const handleIconLibraryToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.currentTarget.dataset.key as string;
    const newLibs = { ...config.iconLibraries };
    if (newLibs[key]) {
      delete newLibs[key];
    } else {
      newLibs[key] = true;
    }
    updateConfig({ iconLibraries: newLibs });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-light-gray mb-2">Optional Integrations:</label>
       <Option tooltip={impactMap.integrations.i18n.tooltip} impacts={impactMap.integrations.i18n.impacts as ImpactType[]} isSelected={config.useI18n}>
          <div className={`p-3 rounded-md transition-all duration-300 bg-gunmetal`}>
            <div className="flex items-center justify-between cursor-pointer" onClick={() => updateConfig({ useI18n: !config.useI18n })}>
              <span>Multi-language support (i18n)</span>
              <div className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${config.useI18n ? 'bg-raisin-black/50' : 'bg-gray-500'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${config.useI18n ? 'translate-x-6' : ''}`} />
              </div>
            </div>
            {config.useI18n && (
              <div className="mt-4 pt-3 pl-4 border-l-2 border-sky-blue/30 space-y-3">
                <label className="block text-xs font-medium text-gray-400">Select languages:</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(availableLanguages).map(([code, name]) => (
                      <div key={code} className="flex items-center">
                          <input type="checkbox" id={`lang-${code}`} checked={config.i18n.locales.includes(code)} onChange={handleLanguageToggle} data-code={code} className="h-4 w-4 rounded border-gray-500 bg-gunmetal text-sky-blue focus:ring-sky-blue"/>
                          <label htmlFor={`lang-${code}`} className="ml-3 text-sm text-light-gray">{name}</label>
                      </div>
                  ))}
                </div>
                {config.i18n.locales.length > 0 && (
                  <div className="mt-3">
                      <label htmlFor="default-locale" className="block text-xs font-medium text-gray-400 mb-1">Default language:</label>
                      <select id="default-locale" value={config.i18n.defaultLocale} onChange={e => updateConfig({ i18n: { ...config.i18n, defaultLocale: e.target.value }})} className="w-full bg-jet border border-gray-600 rounded-md p-2 text-sm text-light-gray focus:ring-2 focus:ring-cyber-yellow focus:outline-none">
                          {config.i18n.locales.map(code => <option key={code} value={code}>{availableLanguages[code as keyof typeof availableLanguages]}</option>)}
                      </select>
                  </div>
                )}
              </div>
            )}
          </div>
       </Option>
       <Option tooltip={impactMap.integrations.astroFont.tooltip} impacts={impactMap.integrations.astroFont.impacts as ImpactType[]} isSelected={config.useAstroFont}>
          <div className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors duration-200 ${config.useAstroFont ? 'bg-gunmetal' : 'bg-gunmetal'}`} onClick={() => updateConfig({ useAstroFont: !config.useAstroFont })}>
            <span>Astro Font</span>
            <div className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${config.useAstroFont ? 'bg-raisin-black/50' : 'bg-gray-500'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${config.useAstroFont ? 'translate-x-6' : ''}`} />
            </div>
          </div>
       </Option>
       <Option tooltip={impactMap.integrations.astroIcon.tooltip} impacts={impactMap.integrations.astroIcon.impacts as ImpactType[]} isSelected={config.useAstroIcon}>
          <div className={`p-3 rounded-md transition-all duration-300 bg-gunmetal`}>
            <div className="flex items-center justify-between cursor-pointer" onClick={() => updateConfig({ useAstroIcon: !config.useAstroIcon })}>
              <span>Astro Icon</span>
              <div className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${config.useAstroIcon ? 'bg-raisin-black/50' : 'bg-gray-500'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${config.useAstroIcon ? 'translate-x-6' : ''}`} />
              </div>
            </div>
            {config.useAstroIcon && (
              <div className="mt-4 pt-3 pl-4 border-l-2 border-sky-blue/30 space-y-3">
                <label className="block text-xs font-medium text-gray-400">Select icon libraries to install:</label>
                {Object.entries(availableIconLibraries).map(([key, name]) => (
                  <div key={key} className="flex items-center">
                    <input type="checkbox" id={`icon-${key}`} checked={!!config.iconLibraries[key]} onChange={handleIconLibraryToggle} data-key={key} className="h-4 w-4 rounded border-gray-500 bg-gunmetal text-sky-blue focus:ring-sky-blue"/>
                    <label htmlFor={`icon-${key}`} className="ml-3 text-sm text-light-gray">{name}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
       </Option>
    </div>
  );
};