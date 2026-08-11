import React, { useRef, useState } from 'react';
import { Download, FileJson, Upload } from 'lucide-react';
import type { AstroConfig } from '../types';
import { downloadGeneratedProject } from '../lib/exportProject';
import { downloadConfigJson } from '../lib/configExport';
import { ImpactLegend } from './ImpactLegend';

interface HeaderProps {
  config: AstroConfig;
  onReset: () => void;
  onImportConfig: (config: unknown) => void;
}

export const Header: React.FC<HeaderProps> = ({ config, onReset, onImportConfig }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleImportClick = () => {
    setImportError(null);
    fileInputRef.current?.click();
  };

  const handleImportFile: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const parsedConfig = JSON.parse(await file.text()) as unknown;
      onImportConfig(parsedConfig);
    } catch (error) {
      console.error(error);
      setImportError('Import JSON invalide.');
    }
  };

  return (
    <header className="bg-gunmetal p-4 shadow-md z-10 flex items-center justify-between flex-wrap gap-4">
      <h1 className="text-xl font-bold text-light-gray tracking-wider">
        Astro Project Boilerplate Generator
      </h1>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => void downloadGeneratedProject(config)}
          className="inline-flex items-center gap-2 rounded-md bg-cyber-yellow px-3 py-2 text-sm font-bold text-raisin-black transition-colors hover:bg-cyber-yellow/80"
        >
          <Download size={16} />
          Télécharger le projet
        </button>
        <button
          type="button"
          onClick={() => downloadConfigJson(config)}
          className="inline-flex items-center gap-2 rounded-md border border-mint-green px-3 py-2 text-sm font-semibold text-mint-green transition-colors hover:bg-jet"
        >
          <FileJson size={16} />
          Exporter config
        </button>
        <button
          type="button"
          onClick={handleImportClick}
          className="inline-flex items-center gap-2 rounded-md border border-sky-blue px-3 py-2 text-sm font-semibold text-sky-blue transition-colors hover:bg-jet"
        >
          <Upload size={16} />
          Importer config
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleImportFile}
          className="hidden"
          aria-label="Importer une configuration NKBOOT"
        />
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-gray-500 px-3 py-2 text-sm font-semibold text-light-gray transition-colors hover:bg-jet"
        >
          Réinitialiser
        </button>
        <ImpactLegend />
        {importError && <p className="w-full text-right text-xs text-red-400">{importError}</p>}
      </div>
    </header>
  );
};
