
import React, { useMemo } from 'react';
import { oklchToRgb, calculateContrastRatio, parseOklch } from '../../lib/colorUtils';

export const ContrastBadge: React.FC<{ fgOklch: string, bgOklch: string, isLarge?: boolean }> = ({ fgOklch, bgOklch, isLarge = false }) => {
  const ratio = useMemo(() => {
      const fgParsed = parseOklch(fgOklch);
      const bgParsed = parseOklch(bgOklch);
      if (!fgParsed || !bgParsed) return null;
      const fgRgb = oklchToRgb(fgParsed.l, fgParsed.c, fgParsed.h);
      const bgRgb = oklchToRgb(bgParsed.l, bgParsed.c, bgParsed.h);
      return calculateContrastRatio(fgRgb, bgRgb);
  }, [fgOklch, bgOklch]);

  if (ratio === null) return <span className="text-xs px-2 py-1 rounded-full bg-gray-600 text-gray-300">...</span>;
  
  const aaThreshold = isLarge ? 3 : 4.5;
  const aaaThreshold = isLarge ? 4.5 : 7;
  let level = 'Fail';
  let color = 'bg-red-500 text-white';
  if (ratio >= aaaThreshold) { level = 'AAA'; color = 'bg-green-500 text-white'; } 
  else if (ratio >= aaThreshold) { level = 'AA'; color = 'bg-yellow-500 text-black'; }
  return <span className={`text-xs px-2 py-1 rounded-full font-bold ${color}`}>{ratio.toFixed(2)}:1 ({level})</span>;
};
