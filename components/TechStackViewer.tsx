
import React from 'react';
import type { AstroConfig } from '../types';
import { PackageManager, Template, StylingChoice, ComponentLibrary, TypeScriptLevel, DbProvider, DbAdapter, AuthProvider } from '../types';
import { Rocket, Package, Code, Component, Palette, PenTool, Library, Blocks, Type, PictureInPicture, Database, DatabaseZap, KeyRound, Wind, Star, Sparkles, Fingerprint } from 'lucide-react';


const TechIcon: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="relative group flex items-center justify-center h-10 w-10 bg-gunmetal rounded-full transition-transform hover:scale-110">
    {children}
    <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-raisin-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      {title}
    </div>
  </div>
);

export const TechStackViewer: React.FC<{ config: AstroConfig }> = ({ config }) => {
  const icons: React.ReactNode[] = [];
  const addedIcons = new Set<string>();

  const addIcon = (key: string, title: string, icon: React.ReactNode) => {
    if (!addedIcons.has(key)) {
      icons.push(<TechIcon key={key} title={title}>{icon}</TechIcon>);
      addedIcons.add(key);
    }
  };

  // Base: Astro
  addIcon("astro", "Astro", <Rocket className="w-6 h-6 text-white" />);
    
  // Package Manager
  addIcon(config.packageManager, config.packageManager.toUpperCase(), <Package className="w-6 h-6 text-coral-pink" />);
  
  // TypeScript
  if (config.typescript !== TypeScriptLevel.None) {
      addIcon("ts", "TypeScript", <Code className="w-6 h-6 text-blue-400" />);
  }

  // Framework
  if ([Template.React, Template.Vue, Template.Svelte].includes(config.template)) {
    addIcon(config.template, config.template, <Component className="w-6 h-6 text-sky-blue" />);
  }

  // Styling
  if (config.styling === StylingChoice.Tailwind) {
      addIcon("tailwind", "Tailwind CSS", <Wind className="w-6 h-6 text-cyan-400" />);
  } else if (config.styling === StylingChoice.Custom) {
       addIcon("custom-css", "Custom CSS", <PenTool className="w-6 h-6 text-cyber-yellow" />);
  }

  // Component Library
  if (config.componentLibrary === ComponentLibrary.Daisy) {
    addIcon("daisy", "DaisyUI", <Sparkles className="w-6 h-6" style={{color: '#5A0EF8'}} />);
  } else if (config.componentLibrary === ComponentLibrary.Shadcn) {
    addIcon("shadcn", "Shadcn/UI", <Library className="w-6 h-6 text-white" />);
  } else if (config.componentLibrary === ComponentLibrary.Starwind) {
    addIcon("starwind", "Starwind UI", <Star className="w-6 h-6 text-cyber-yellow" />);
  } else if (config.componentLibrary === ComponentLibrary.Custom) {
    addIcon("custom-comp", "Custom Components", <Blocks className="w-6 h-6 text-cyber-yellow" />);
  }
  
  // Integrations
  if (config.useAstroFont) {
    addIcon("astro-font", "Astro Font", <Type className="w-6 h-6 text-mint-green" />);
  }
  if (config.useAstroIcon) {
    addIcon("astro-icon", "Astro Icon", <PictureInPicture className="w-6 h-6 text-sky-blue" />);
  }
  
  // DB and Auth
  const dbProvider = config.db.sameForDevProd ? config.db.dev.provider : (config.db.dev.provider !== DbProvider.None ? config.db.dev.provider : config.db.prod.provider);
  if (dbProvider !== DbProvider.None) {
      addIcon('db', `Database: ${dbProvider}`, <Database className="w-6 h-6 text-green-400" />);
  }
  
  if (config.db.adapter !== DbAdapter.None) {
      addIcon(config.db.adapter, `${config.db.adapter} ORM`, <DatabaseZap className="w-6 h-6 text-lime-400" />);
  }

  if (config.auth.provider === AuthProvider.Supabase) {
      addIcon('supabase', 'Supabase', <KeyRound className="w-6 h-6 text-green-500" />);
  }
  if (config.auth.provider === AuthProvider.BetterAuth) {
      addIcon('better-auth', 'Better Auth', <Fingerprint className="w-6 h-6 text-cyber-yellow" />);
  }

  return (
    <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-2">Your Stack:</h3>
        <div className="flex flex-wrap gap-3">
            {icons}
        </div>
    </div>
  );
};