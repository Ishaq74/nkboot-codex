
import React, { useMemo } from 'react';
import type { CssVariable } from '../../types';
import { oklchToRgb, rgbToHex, parseOklch, formatOklch, hexToOklch } from '../../lib/colorUtils';


export const VisualColorPicker: React.FC<{ variable: CssVariable, onChange: (newValue: string) => void }> = ({ variable, onChange }) => {
    const oklch = useMemo(() => parseOklch(variable.value) || { l: 0, c: 0, h: 0 }, [variable.value]);
    const hex = useMemo(() => {
        const [r, g, b] = oklchToRgb(oklch.l, oklch.c, oklch.h);
        return rgbToHex(r, g, b);
    }, [oklch]);

    const handleHexChange = (newHex: string) => {
        const [l, c, h] = hexToOklch(newHex);
        onChange(formatOklch(l, c, h));
    };

    return (
        <div className="flex items-center space-x-2">
            <div className="relative w-8 h-8 rounded-md overflow-hidden border-2 border-gunmetal">
                <input type="color" value={hex} onChange={(e) => handleHexChange(e.target.value)} className="absolute top-0 left-0 w-full h-full cursor-pointer opacity-0" />
                <div className="w-full h-full" style={{ backgroundColor: hex }} />
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-mono text-coral-pink">{variable.name}</label>
                <span className="text-xs text-gray-400 font-mono">{variable.value}</span>
            </div>
        </div>
    );
};
