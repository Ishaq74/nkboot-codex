
import React from 'react';
import type { AstroConfig } from '../types';
import { FileTab, Template, StylingChoice, ThemeMode, ComponentLibrary, DbAdapter } from '../types';

// --- Step-specific impact content components ---

const InitialSetupImpact = () => (
    <>
      <h3 className="text-lg font-bold text-sky-blue mb-2">Initial Project Setup</h3>
      <p className="text-sm mb-4">This step configures all the basic options for creating your Astro project, mirroring the <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">create-astro</code> command line tool.</p>
      <ul className="list-disc list-inside text-sm space-y-2">
        <li><span className="font-semibold text-mint-green">Package Manager:</span> Selects between NPM, Yarn, or PNPM.</li>
        <li><span className="font-semibold text-mint-green">Project Name:</span> Sets the directory name for your project.</li>
        <li><span className="font-semibold text-mint-green">Template:</span> Choose from official Astro templates, including empty projects or starters with a UI framework.</li>
        <li><span className="font-semibold text-mint-green">TypeScript:</span> Set the strictness level for TypeScript.</li>
        <li><span className="font-semibold text-mint-green">Install/Git:</span> Options to automatically install dependencies and initialize a Git repository.</li>
      </ul>
    </>
);

const StylingImpact = () => (
    <>
      <h3 className="text-lg font-bold text-sky-blue mb-2">Styling Approach</h3>
      <p className="text-sm mb-4">Define how you want to style your project.</p>
      <ul className="list-disc list-inside text-sm space-y-2">
        <li><span className="font-semibold text-mint-green">Tailwind CSS:</span> Sets up Astro with the official Tailwind integration. This will add <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">@astrojs/tailwind</code>, create a <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">{FileTab.TailwindConfig}</code>, and update <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">{FileTab.ThemeCss}</code> with Tailwind directives.</li>
        <li><span className="font-semibold text-mint-green">Custom CSS:</span> Provides a clean slate with a basic <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">{FileTab.ThemeCss}</code> file for you to define your own styles and variables.</li>
      </ul>
    </>
);

const ComponentLibraryImpact = () => (
    <>
      <h3 className="text-lg font-bold text-sky-blue mb-2">Component Library</h3>
      <p className="text-sm mb-4">Kickstart your project with a pre-configured component library. Dependencies will be added to <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">{FileTab.PackageJson}</code>.</p>
      <ul className="list-disc list-inside text-sm space-y-2">
        <li><span className="font-semibold text-mint-green">{ComponentLibrary.Shadcn}:</span> A popular, accessible component library. <span className="text-coral-pink">Requires {Template.React} Template.</span> The CLI will show commands to initialize and add selected components.</li>
        <li><span className="font-semibold text-mint-green">{ComponentLibrary.Daisy}:</span> A highly customizable component library for Tailwind CSS. <span className="text-coral-pink">Requires {StylingChoice.Tailwind}.</span></li>
        <li><span className="font-semibold text-mint-green">{ComponentLibrary.Starwind}:</span> A lightweight Astro-first component library. The CLI will show commands to initialize the library and add your selected components.</li>
        <li><span className="font-semibold text-mint-green">{ComponentLibrary.Custom}:</span> This option generates commands to create empty <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">.astro</code> files for each selected component, setting up your project structure for you.</li>
      </ul>
    </>
);

const ThemeImpact = () => (
    <>
      <h3 className="text-lg font-bold text-sky-blue mb-2">Theme & Colors</h3>
      <p className="text-sm mb-4">Configure your site's appearance with modern CSS features. Your choices will populate <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">{FileTab.ThemeCss}</code>.</p>
      <ul className="list-disc list-inside text-sm space-y-2">
        <li><span className="font-semibold text-mint-green">Theme Mode:</span> Choose how your site responds to light/dark modes. '{ThemeMode.System}' uses the <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">prefers-color-scheme</code> media query.</li>
        <li><span className="font-semibold text-mint-green">oklch Colors:</span> We use the <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">oklch()</code> color function, which provides more consistent and accessible color palettes.</li>
      </ul>
    </>
);

const IntegrationsImpact = () => (
    <>
      <h3 className="text-lg font-bold text-sky-blue mb-2">Astro Integrations</h3>
      <p className="text-sm mb-4">Supercharge your project with official and third-party Astro integrations. Selected integrations will add dependencies and be configured in <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">{FileTab.AstroConfig}</code>.</p>
      <ul className="list-disc list-inside text-sm space-y-2">
        <li><span className="font-semibold text-mint-green">Multi-language (i18n):</span> Adds and configures <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">@astrojs/i18n</code> to create an internationalized website with multiple languages.</li>
        <li><span className="font-semibold text-mint-green">Astro Font:</span> A font optimization and management tool.</li>
        <li><span className="font-semibold text-mint-green">Astro Icon:</span> Easily add icons from any icon set.</li>
      </ul>
    </>
);

const DbAuthImpact = () => (
    <>
      <h3 className="text-lg font-bold text-sky-blue mb-2">Database & Auth</h3>
      <p className="text-sm mb-4">Set up your project's backend with database and authentication solutions. This will add dependencies and create multiple configuration files.</p>
      <ul className="list-disc list-inside text-sm space-y-2">
        <li><span className="font-semibold text-mint-green">Database Provider:</span> Choose your database, like SQLite, PostgreSQL, or Supabase.</li>
        <li><span className="font-semibold text-mint-green">Database Adapter:</span> Add an ORM like Drizzle or Prisma to interact with your database. This will create config files like <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">{FileTab.DrizzleSchema}</code> or <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">{FileTab.PrismaSchema}</code>.</li>
        <li><span className="font-semibold text-mint-green">Auth Provider:</span> Add authentication. Supabase Auth is available if you use Supabase DB. Better Auth is a powerful, modular solution that creates several files, including <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">src/auth.ts</code> and <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">src/middleware.ts</code>.</li>
      </ul>
    </>
);

const DataSchemaImpact: React.FC<{ config: AstroConfig }> = ({ config }) => (
    <>
      <h3 className="text-lg font-bold text-sky-blue mb-2">Data Schema</h3>
      <p className="text-sm mb-4">Define the structure of your database tables and columns. Your choices here will directly generate the schema file for your selected ORM.</p>
      {config.db.adapter === DbAdapter.None ? (
        <p className="text-sm text-coral-pink p-3 bg-red-900/50 rounded-md">Please select a Database Adapter (Drizzle or Prisma) in the "Database & Auth" step to enable schema generation.</p>
      ) : (
        <>
            <ul className="list-disc list-inside text-sm space-y-2">
                <li><span className="font-semibold text-mint-green">Pre-filled Tables:</span> If you chose an auth provider, the necessary tables (like users, sessions) are already defined for you.</li>
                <li><span className="font-semibold text-mint-green">AI-Powered Generation:</span> Describe the data you need (e.g., "a blog with posts and comments") and let the AI generate the tables and columns for you.</li>
                <li><span className="font-semibold text-mint-green">Manual Editing:</span> Add or modify tables and columns manually to fine-tune your schema.</li>
                <li><span className="font-semibold text-mint-green">Live Output:</span> The generated code for <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">{config.db.adapter === DbAdapter.Drizzle ? FileTab.DrizzleSchema : FileTab.PrismaSchema}</code> will update as you make changes.</li>
            </ul>
             <p className="text-sm mt-4">The CLI will also include a command like <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">prisma db push</code> or <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">drizzle-kit push</code> to apply your schema to the database.</p>
        </>
      )}
    </>
);


const EnvironmentImpact = () => (
    <>
      <h3 className="text-lg font-bold text-sky-blue mb-2">Environment Variables</h3>
      <p className="text-sm mb-4">
        Your selected configuration requires secrets or keys to function. 
        Provide them here to automatically populate your <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">{FileTab.Env}</code> file.
      </p>
       <p className="text-xs text-gray-400">
        This is a crucial step for services like databases, authentication providers (OAuth), and email services. 
        Leaving these fields blank will result in an incomplete <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">.env</code> file.
      </p>
    </>
);

const SummaryImpact = () => (
     <>
      <h3 className="text-lg font-bold text-sky-blue mb-2">Ready to Go!</h3>
      <p className="text-sm mb-4">You have configured your new Astro project. The panels show the exact commands to run and what key files will look like.</p>
      <p className="text-sm">You can go back to any step to change your choices, and all panels will update in real-time.</p>
    </>
);

const impactContentMap: Record<number, React.FC<{config: AstroConfig}>> = {
  0: InitialSetupImpact,
  1: StylingImpact,
  2: ComponentLibraryImpact,
  3: ThemeImpact,
  4: IntegrationsImpact,
  5: DbAuthImpact,
  6: DataSchemaImpact,
  7: EnvironmentImpact,
  8: SummaryImpact,
};

interface ChoiceImpactProps {
  currentStepId: number;
  config: AstroConfig;
}

export const ChoiceImpact: React.FC<ChoiceImpactProps> = ({ currentStepId, config }) => {
  const ImpactComponent = impactContentMap[currentStepId];

  return (
    <div className="h-full">
      <h2 className="text-2xl font-bold mb-4 text-cyber-yellow">Choice Impact</h2>
      <div className="bg-gunmetal/50 p-4 rounded-lg">
        {ImpactComponent ? <ImpactComponent config={config} /> : <p>Select an option to see its impact.</p>}
      </div>
    </div>
  );
};