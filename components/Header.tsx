import React from 'react';
import { Download } from 'lucide-react';
import type { AstroConfig } from '../types';
import { downloadGeneratedProject } from '../lib/exportProject';
import { ImpactLegend } from './ImpactLegend';

interface HeaderProps {
  config: AstroConfig;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ config, onReset }) => {
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
          onClick={onReset}
          className="rounded-md border border-gray-500 px-3 py-2 text-sm font-semibold text-light-gray transition-colors hover:bg-jet"
        >
          Réinitialiser
        </button>
        <ImpactLegend />
      </div>
    </header>
  );
};
