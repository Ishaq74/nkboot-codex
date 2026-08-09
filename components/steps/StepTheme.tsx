
import React from 'react';
import type { AstroConfig } from '../../types';
import { ThemeEditor } from '../theme/ThemeEditor';

interface StepProps {
    config: AstroConfig;
    updateConfig: (newConfig: Partial<AstroConfig>) => void;
}

export const StepTheme: React.FC<StepProps> = ({ config, updateConfig }) => {
    return <ThemeEditor config={config} updateConfig={updateConfig} />;
};
