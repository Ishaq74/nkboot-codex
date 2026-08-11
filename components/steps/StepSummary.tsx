import React, { useMemo, useState } from 'react';
import { CheckCircle2, Clipboard, Download, FileJson, Info, Rocket } from 'lucide-react';
import type { AstroConfig } from '../../types';
import { availableIconLibraries } from '../../lib/stepData';
import { generateCliCommands } from '../../lib/cli';
import { downloadConfigJson } from '../../lib/configExport';
import { downloadGeneratedProject, getGeneratedProjectFiles } from '../../lib/exportProject';
import { getRequiredEnvVars } from '../../lib/env';

interface StepProps {
    config: AstroConfig;
    updateConfig: (newConfig: Partial<AstroConfig>) => void;
}

const LAST_WIZARD_STEP = 8;

export const StepSummary: React.FC<StepProps> = ({ config }) => {
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
    const selectedIconLibs = Object.entries(config.iconLibraries).filter(([, selected]) => selected).map(([key]) => availableIconLibraries[key as keyof typeof availableIconLibraries]);
    const astroIconSummary = config.useAstroIcon ? `Astro Icon ${selectedIconLibs.length > 0 ? `(${selectedIconLibs.join(', ')})` : ''}` : null;
    const i18nSummary = config.useI18n ? `i18n (${config.i18n.locales.join(', ')}, default: ${config.i18n.defaultLocale})` : null;
    const integrations = [ i18nSummary, config.useAstroFont && 'Astro Font', astroIconSummary ].filter(Boolean).join(', ') || 'None';
    const dbSummary = config.db.sameForDevProd ? config.db.dev.provider : `Dev: ${config.db.dev.provider}, Prod: ${config.db.prod.provider}`;
    const generatedFiles = useMemo(() => getGeneratedProjectFiles(config), [config]);
    const envVars = useMemo(() => getRequiredEnvVars(config), [config]);
    const cliCommands = useMemo(() => {
        return generateCliCommands(config, LAST_WIZARD_STEP)
            .map((command) => command.map((segment) => segment.text).join('').trim())
            .join('\n');
    }, [config]);

    const copyCliCommands = async () => {
        try {
            await navigator.clipboard.writeText(cliCommands);
            setCopyStatus('copied');
        } catch (error) {
            console.error(error);
            setCopyStatus('failed');
        }
    };

    return (
         <div className="space-y-6">
            <div className="rounded-lg border border-mint-green/40 bg-mint-green/10 p-4">
                <h3 className="flex items-center gap-2 text-xl font-bold text-mint-green">
                    <Rocket size={22} />
                    Projet prêt à exporter
                </h3>
                <p className="mt-2 text-sm text-light-gray">
                    Télécharge le ZIP pour démarrer ton projet Astro, exporte la configuration pour la partager, ou copie les commandes pour rejouer l'installation à la main.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                    <button onClick={() => void downloadGeneratedProject(config)} className="inline-flex items-center gap-2 rounded-md bg-cyber-yellow px-3 py-2 text-sm font-bold text-raisin-black transition-colors hover:bg-cyber-yellow/80">
                        <Download size={16} /> Télécharger le projet
                    </button>
                    <button onClick={() => downloadConfigJson(config)} className="inline-flex items-center gap-2 rounded-md border border-mint-green px-3 py-2 text-sm font-semibold text-mint-green transition-colors hover:bg-gunmetal">
                        <FileJson size={16} /> Exporter la config
                    </button>
                    <button onClick={copyCliCommands} className="inline-flex items-center gap-2 rounded-md border border-sky-blue px-3 py-2 text-sm font-semibold text-sky-blue transition-colors hover:bg-gunmetal">
                        <Clipboard size={16} /> Copier les commandes
                    </button>
                </div>
                {copyStatus === 'copied' && <p className="mt-2 text-xs text-mint-green">Commandes copiées dans le presse-papiers.</p>}
                {copyStatus === 'failed' && <p className="mt-2 text-xs text-red-400">Impossible de copier automatiquement. Copie les commandes depuis le panneau CLI.</p>}
            </div>

            <div>
                <h3 className="text-lg font-bold text-light-gray mb-4 border-b border-gray-600 pb-2">Configuration Summary</h3>
                <ul className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
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

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-lg bg-gunmetal/60 p-4">
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-light-gray"><CheckCircle2 size={18} className="text-mint-green" /> Fichiers inclus dans le ZIP</h4>
                    <ul className="max-h-56 space-y-1 overflow-auto text-xs font-mono text-gray-300">
                        {generatedFiles.map((file) => <li key={file.path}>{file.path}</li>)}
                    </ul>
                </div>
                <div className="rounded-lg bg-gunmetal/60 p-4">
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-light-gray"><Info size={18} className="text-cyber-yellow" /> À vérifier après export</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li>• Lance <code className="rounded bg-raisin-black px-1 text-cyber-yellow">npm install</code> dans le projet exporté.</li>
                        <li>• Complète <code className="rounded bg-raisin-black px-1 text-cyber-yellow">.env</code> ou <code className="rounded bg-raisin-black px-1 text-cyber-yellow">.env.example</code> si des secrets sont requis.</li>
                        {envVars.length > 0 && <li>• Variables attendues : {envVars.map((envVar) => envVar.name).join(', ')}.</li>}
                        <li>• Le proxy IA Vite est prévu pour le développement ; en production, porte <code className="rounded bg-raisin-black px-1 text-cyber-yellow">/api/generate-schema</code> vers ton backend cible.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
