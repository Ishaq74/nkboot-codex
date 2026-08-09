
import React from 'react';
import type { AstroConfig } from '../../types';
import { availableIconLibraries } from '../../lib/stepData';

interface StepProps {
    config: AstroConfig;
    updateConfig: (newConfig: Partial<AstroConfig>) => void;
}

export const StepSummary: React.FC<StepProps> = ({ config }) => {
    const selectedIconLibs = Object.entries(config.iconLibraries).filter(([, selected]) => selected).map(([key]) => availableIconLibraries[key as keyof typeof availableIconLibraries]);
    const astroIconSummary = config.useAstroIcon ? `Astro Icon ${selectedIconLibs.length > 0 ? `(${selectedIconLibs.join(', ')})` : ''}` : null;
    const i18nSummary = config.useI18n ? `i18n (${config.i18n.locales.join(', ')}, default: ${config.i18n.defaultLocale})` : null;
    const integrations = [ i18nSummary, config.useAstroFont && 'Astro Font', astroIconSummary ].filter(Boolean).join(', ') || 'None';
    const dbSummary = config.db.sameForDevProd ? config.db.dev.provider : `Dev: ${config.db.dev.provider}, Prod: ${config.db.prod.provider}`;

    return (
         <div>
            <h3 className="text-lg font-bold text-light-gray mb-4 border-b border-gray-600 pb-2">Configuration Summary</h3>
            <ul className="space-y-2 text-sm">
                <li><span className="font-semibold text-sky-blue">Package Manager:</span> {config.packageManager.toUpperCase()}</li>
                <li><span className="font-semibold text-sky-blue">Project Name:</span> {config.projectName}</li>
                <li><span className="font-semibold text-sky-blue">Template:</span> {config.template}</li>
                <li><span className="font-semibold text-sky-blue">TypeScript:</span> {config.typescript}</li>
                <li><span className="font-semibold text-sky-blue">Styling:</span> {config.styling}</li>
                <li><span className="font-semibold text-sky-blue">Component Lib:</span> {config.componentLibrary}</li>
                <li><span className="font-semibold text-sky-blue">Theme Mode:</span> {config.theme.mode}</li>
                <li><span className="font-semibold text-sky-blue">Integrations:</span> {integrations}</li>
                <li><span className="font-semibold text-sky-blue">Database:</span> {dbSummary}</li>
                <li><span className="font-semibold text-sky-blue">DB Adapter:</span> {config.db.adapter}</li>
                <li><span className="font-semibold text-sky-blue">Auth:</span> {config.auth.provider}</li>
                <li><span className="font-semibold text-sky-blue">Data Schema:</span> {config.schema.tables.length} tables defined</li>
                <li><span className="font-semibold text-sky-blue">Install Dependencies:</span> {config.installDeps ? 'Yes' : 'No'}</li>
                <li><span className="font-semibold text-sky-blue">Initialize Git:</span> {config.initGit ? 'Yes' : 'No'}</li>
            </ul>
        </div>
    );
};