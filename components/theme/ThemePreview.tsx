
import React from 'react';
import type { CssVariable } from '../../types';
import { ContrastBadge } from './ContrastBadge';

export const ThemePreview: React.FC<{ themeColors: CssVariable[], title: string }> = ({ themeColors, title }) => {
  const style: React.CSSProperties = {};
  const varMap: Record<string, string> = {};
  themeColors.forEach(v => { style[v.name as any] = v.value; varMap[v.name] = v.value; });
  
  return (
      <div className="space-y-4">
           <h3 className="text-lg font-semibold text-light-gray">{title}</h3>
          <div className="p-4 rounded-lg space-y-4 border-2 border-gunmetal" style={{ backgroundColor: varMap['--background'], color: varMap['--foreground'] }}>
              <div className="p-4 rounded-lg space-y-2" style={{ backgroundColor: varMap['--card'], color: varMap['--card-foreground'], border: `1px solid ${varMap['--border']}`}}>
                   <div className="flex justify-between items-center">
                      <h2 className="text-lg font-bold">Card Heading</h2>
                      <ContrastBadge fgOklch={varMap['--card-foreground']} bgOklch={varMap['--card']} isLarge />
                  </div>
                  <div className="flex justify-between items-center">
                      <p className="text-sm">Card paragraph text.</p>
                      <ContrastBadge fgOklch={varMap['--card-foreground']} bgOklch={varMap['--card']} />
                  </div>
              </div>
              <div className="flex items-center space-x-2">
                  <button className="flex-1 p-2 text-sm font-bold rounded-md flex justify-between items-center" style={{ backgroundColor: varMap['--primary'], color: varMap['--primary-foreground']}}>
                      <span>Primary</span> <ContrastBadge fgOklch={varMap['--primary-foreground']} bgOklch={varMap['--primary']} />
                  </button>
                  <button className="flex-1 p-2 text-sm font-bold rounded-md flex justify-between items-center" style={{ backgroundColor: varMap['--secondary'], color: varMap['--secondary-foreground']}}>
                      <span>Secondary</span> <ContrastBadge fgOklch={varMap['--secondary-foreground']} bgOklch={varMap['--secondary']} />
                  </button>
              </div>
              <input type="text" placeholder="Input field" className="w-full p-2 rounded-md text-sm" style={{ backgroundColor: varMap['--input'], border: `1px solid ${varMap['--border']}`, color: varMap['--foreground'] }} />
          </div>
      </div>
  );
};
