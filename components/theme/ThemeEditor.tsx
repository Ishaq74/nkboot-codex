
import React from 'react';
import type { AstroConfig } from '../../types';
import { ThemeMode } from '../../types';
import { Wand2, Lock, Unlock } from 'lucide-react';
import { oklchToRgb, calculateContrastRatio, parseOklch, formatOklch } from '../../lib/colorUtils';
import { ThemePaletteEditor } from './ThemePaletteEditor';
import { ThemePreview } from './ThemePreview';

// --- MAIN COMPONENT ---

interface ThemeEditorProps {
    config: AstroConfig;
    updateConfig: (newConfig: Partial<AstroConfig>) => void;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ config, updateConfig }) => {
  
  const handleThemeColorChange = (themeType: 'light' | 'dark', index: number, newValue: string) => {
      const newTheme = { ...config.theme };
      const baseName = newTheme[themeType][index].name.replace('--', '');
      
      const newColors = [...newTheme[themeType]];
      newColors[index] = { ...newColors[index], value: newValue };
      newTheme[themeType] = newColors;

      if (!newTheme.syncLocks[baseName]) {
          const oppositeTheme = themeType === 'light' ? 'dark' : 'light';
          const oklch = parseOklch(newValue);
          if (oklch) {
              const newL = 1.05 - oklch.l;
              const oppositeValue = formatOklch(Math.max(0, Math.min(1, newL)), oklch.c, oklch.h);
              
              const oppositeIndex = newTheme[oppositeTheme].findIndex(v => v.name === newTheme[themeType][index].name);
              if (oppositeIndex !== -1) {
                  const newOppositeColors = [...newTheme[oppositeTheme]];
                  newOppositeColors[oppositeIndex] = { ...newOppositeColors[oppositeIndex], value: oppositeValue };
                  newTheme[oppositeTheme] = newOppositeColors;
              }
          }
      }
      updateConfig({ theme: newTheme });
  };

  const toggleThemeSyncLock = (variableName: string) => {
      const key = variableName.replace('--', '');
      updateConfig({
          theme: {
              ...config.theme,
              syncLocks: {
                  ...config.theme.syncLocks,
                  [key]: !config.theme.syncLocks[key]
              }
          }
      })
  }
    
    const generateAaaPalette = () => {
        const baseHue = Math.random() * 360;
        const secondaryHue = (baseHue + 60) % 360;
        const destructiveHue = 20;

        const getBestForeground = (bgOklch: { l: number; c: number; h: number }): { l: number; c: number; h: number } => {
            const lightText = { l: 0.98, c: 0.01, h: bgOklch.h };
            const darkText = { l: 0.1, c: 0.02, h: bgOklch.h };
            const bgRgb = oklchToRgb(bgOklch.l, bgOklch.c, bgOklch.h);
            const contrastWithLight = calculateContrastRatio(bgRgb, oklchToRgb(lightText.l, lightText.c, lightText.h));
            const contrastWithDark = calculateContrastRatio(bgRgb, oklchToRgb(darkText.l, darkText.c, darkText.h));
            return contrastWithLight > contrastWithDark ? lightText : darkText;
        };

        const lightVars: { [key: string]: { l: number; c: number; h: number } } = {};
        lightVars.background = { l: 0.98, c: 0.01, h: baseHue };
        lightVars.foreground = getBestForeground(lightVars.background);
        lightVars.card = { l: 1.0, c: 0, h: baseHue };
        lightVars['card-foreground'] = getBestForeground(lightVars.card);
        lightVars.primary = { l: 0.6, c: 0.15, h: baseHue };
        lightVars['primary-foreground'] = getBestForeground(lightVars.primary);
        lightVars.secondary = { l: 0.9, c: 0.05, h: secondaryHue };
        lightVars['secondary-foreground'] = getBestForeground(lightVars.secondary);
        lightVars.destructive = { l: 0.65, c: 0.2, h: destructiveHue };
        lightVars['destructive-foreground'] = getBestForeground(lightVars.destructive);
        lightVars.border = { l: 0.9, c: 0.02, h: baseHue };
        lightVars.input = { l: 0.9, c: 0.02, h: baseHue };
        lightVars.ring = lightVars.primary;

        const darkVars: { [key: string]: { l: number; c: number; h: number } } = {};
        Object.entries(lightVars).forEach(([key, oklch]) => {
            if (key.endsWith('-foreground')) return;
            const newL = Math.max(0, Math.min(1, 1.05 - oklch.l));
            darkVars[key] = { ...oklch, l: newL };
        });

        darkVars.foreground = getBestForeground(darkVars.background);
        darkVars['card-foreground'] = getBestForeground(darkVars.card);
        darkVars['primary-foreground'] = getBestForeground(darkVars.primary);
        darkVars['secondary-foreground'] = getBestForeground(darkVars.secondary);
        darkVars['destructive-foreground'] = getBestForeground(darkVars.destructive);

        updateConfig({
            theme: {
                ...config.theme,
                light: Object.entries(lightVars).map(([k, v]) => ({ name: `--${k}`, value: formatOklch(v.l, v.c, v.h) })),
                dark: Object.entries(darkVars).map(([k, v]) => ({ name: `--${k}`, value: formatOklch(v.l, v.c, v.h) })),
            },
        });
    };

    const shouldShowLight = config.theme.mode === ThemeMode.System || config.theme.mode === ThemeMode.Light;
    const shouldShowDark = config.theme.mode === ThemeMode.System || config.theme.mode === ThemeMode.Dark;

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <div className="space-y-2">
                     <label className="block text-sm font-medium text-light-gray">Theme Mode</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {Object.values(ThemeMode).map(mode => (
                            <button key={mode} onClick={() => updateConfig({ theme: { ...config.theme, mode } })} className={`p-2 text-sm rounded-md transition-colors duration-200 ${config.theme.mode === mode ? 'bg-coral-pink text-raisin-black font-bold' : 'bg-gunmetal hover:bg-gray-700'}`}>
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>
                 <div className="text-right">
                    <label className="block text-sm font-medium text-light-gray mb-2">Palette Generator</label>
                    <button onClick={generateAaaPalette} className="p-2 rounded-md bg-sky-blue text-raisin-black hover:bg-sky-blue/80 transition-colors flex items-center gap-2">
                        <Wand2 size={16} />
                        <span>Generate</span>
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-8">
                    {shouldShowLight && <ThemePaletteEditor themeType="light" config={config} toggleThemeSyncLock={toggleThemeSyncLock} handleThemeColorChange={handleThemeColorChange} />}
                    {shouldShowDark && <ThemePaletteEditor themeType="dark" config={config} toggleThemeSyncLock={toggleThemeSyncLock} handleThemeColorChange={handleThemeColorChange} />}
                </div>

                <div className="space-y-8 lg:sticky top-0">
                     {shouldShowLight && <ThemePreview themeColors={config.theme.light} title="Light Theme Preview"/>}
                     {shouldShowDark && <ThemePreview themeColors={config.theme.dark} title="Dark Theme Preview"/>}
                </div>
            </div>
        </div>
    );
};