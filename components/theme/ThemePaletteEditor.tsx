
import React from 'react';
import type { AstroConfig } from '../../types';
import { Lock, Unlock } from 'lucide-react';
import { VisualColorPicker } from './VisualColorPicker';

interface ThemePaletteEditorProps {
    themeType: 'light' | 'dark';
    config: AstroConfig;
    toggleThemeSyncLock: (variableName: string) => void;
    handleThemeColorChange: (themeType: 'light' | 'dark', index: number, newValue: string) => void;
}

export const ThemePaletteEditor: React.FC<ThemePaletteEditorProps> = ({themeType, config, toggleThemeSyncLock, handleThemeColorChange}) => {
     return (
         <div>
            <h3 className="text-lg font-semibold text-light-gray capitalize mb-4">{themeType} Theme Palette</h3>
            <div className="space-y-4">
                {config.theme[themeType].map((variable, index) => {
                     const key = variable.name.replace('--', '');
                     const isLocked = config.theme.syncLocks[key];
                     return(
                        <div key={index} className="flex items-center space-x-2">
                            <button onClick={() => toggleThemeSyncLock(variable.name)} className="p-1.5 rounded-md hover:bg-gunmetal mt-1">
                                {isLocked ? <Lock size={16} className="text-cyber-yellow" /> : <Unlock size={16} className="text-gray-400" />}
                            </button>
                            <VisualColorPicker variable={variable} onChange={(value) => handleThemeColorChange(themeType, index, value)} />
                        </div>
                     )
                 })}
            </div>
         </div>
     );
}
