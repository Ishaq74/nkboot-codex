import React from 'react';
import { ImpactLegend } from './ImpactLegend';

export const Header: React.FC = () => {
  return (
    <header className="bg-gunmetal p-4 shadow-md z-10 flex items-center justify-between flex-wrap gap-4">
      <h1 className="text-xl font-bold text-light-gray tracking-wider">
        Astro Project Boilerplate Generator
      </h1>
      <ImpactLegend />
    </header>
  );
};
