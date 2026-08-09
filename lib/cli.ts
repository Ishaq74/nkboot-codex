
import type { AstroConfig } from '../types';
import { Template, TypeScriptLevel, PackageManager, StylingChoice, ComponentLibrary, DbProvider, DbAdapter, AuthProvider, BetterAuthEmailProvider } from '../types';

export type CommandSegment = {
  text: string;
  className: string;
};

export type Command = CommandSegment[];

const getTemplateCliName = (template: Template): string => {
    switch(template) {
        case Template.React:
        case Template.Vue:
        case Template.Svelte:
            return `framework-${template.toLowerCase()}`;
        default:
            return template.toLowerCase();
    }
}

const getDbDialectForDrizzle = (config: AstroConfig): string => {
    const provider = config.db.dev.provider !== DbProvider.None ? config.db.dev.provider : config.db.prod.provider;
    switch(provider) {
        case DbProvider.Postgres:
        case DbProvider.Neon:
        case DbProvider.Supabase:
            return 'pg';
        case DbProvider.MySQL:
        case DbProvider.PlanetScale:
            return 'mysql';
        case DbProvider.SQLite:
            return 'sqlite';
        default:
            return 'pg'; // Default
    }
}

export const generateCliCommands = (config: AstroConfig, currentStep: number): Command[] => {
    const structuredCmds: Command[] = [];

    // --- First Command: create-astro ---
    const createCmd: Command = [];
    switch (config.packageManager) {
      case PackageManager.Yarn:
        createCmd.push({ text: 'yarn create astro', className: 'text-sky-blue' });
        break;
      case PackageManager.PNPM:
        createCmd.push({ text: 'pnpm create astro@latest', className: 'text-sky-blue' });
        break;
      case PackageManager.NPM:
      default:
        createCmd.push({ text: 'npx create-astro@latest', className: 'text-sky-blue' });
        break;
    }
    
    // All initial setup options are decided in Step 0
    createCmd.push({ text: ` ${config.projectName || '<project-name>'}`, className: 'text-coral-pink font-bold' });
    createCmd.push({ text: ` --template ${getTemplateCliName(config.template)}`, className: 'text-mint-green' });

    if (config.typescript !== TypeScriptLevel.None) {
        createCmd.push({ text: ` --typescript ${config.typescript.toLowerCase()}`, className: 'text-mint-green' });
    }

    if (config.installDeps) {
        createCmd.push({ text: ' --install', className: 'text-mint-green' });
    } else {
        createCmd.push({ text: ' --skip-install', className: 'text-mint-green' });
    }
    if (config.initGit) {
        createCmd.push({ text: ' --git', className: 'text-mint-green' });
    }
    
    structuredCmds.push(createCmd);


    // --- Subsequent Commands ---
    // Only show subsequent commands if their corresponding step has been reached/passed.
    const createCmdCompleteStep = 0; 
    const depsToInstall: string[] = [];
    const devDepsToInstall: string[] = [];

    if (currentStep >= 4 && config.useAstroFont) depsToInstall.push('astro-font');
    if (currentStep >= 4 && config.useAstroIcon) {
        depsToInstall.push('astro-icon');
        Object.keys(config.iconLibraries).forEach(libKey => {
            if(config.iconLibraries[libKey]) depsToInstall.push(`@iconify-json/${libKey}`);
        });
    }
    if (currentStep >= 2 && config.componentLibrary === ComponentLibrary.Daisy) depsToInstall.push('daisyui');

    // DB & Auth deps
    if (currentStep >= 5) {
        const providers = new Set<DbProvider>();
        if (config.db.dev.provider !== DbProvider.None) providers.add(config.db.dev.provider);
        if (!config.db.sameForDevProd && config.db.prod.provider !== DbProvider.None) providers.add(config.db.prod.provider);

        if (providers.has(DbProvider.Postgres) || providers.has(DbProvider.Neon) || providers.has(DbProvider.Supabase)) depsToInstall.push('pg');
        if (providers.has(DbProvider.MySQL) || providers.has(DbProvider.PlanetScale)) depsToInstall.push('mysql2');
        if (providers.has(DbProvider.Supabase)) depsToInstall.push('@supabase/supabase-js');

        if (config.db.adapter === DbAdapter.Drizzle) {
            depsToInstall.push('drizzle-orm');
            devDepsToInstall.push('drizzle-kit', 'dotenv');
        } else if (config.db.adapter === DbAdapter.Prisma) {
            depsToInstall.push('@prisma/client');
            devDepsToInstall.push('prisma');
        }

        if (config.auth.provider === AuthProvider.BetterAuth) {
            depsToInstall.push('better-auth');
            const plugins = config.auth.betterAuth.plugins;
            if (plugins.sso) depsToInstall.push('@better-auth/sso');
            if (plugins.stripe) depsToInstall.push('@better-auth/stripe', 'stripe');
            if (plugins.polar) depsToInstall.push('@polar-sh/better-auth', '@polar-sh/sdk');
            if (plugins.dub) depsToInstall.push('@dub/better-auth', 'dub');
            if (plugins.expo) depsToInstall.push('@better-auth/expo');

            if (config.auth.betterAuth.emailProvider === BetterAuthEmailProvider.Nodemailer) {
                depsToInstall.push('nodemailer');
                devDepsToInstall.push('@types/nodemailer');
            } else if (config.auth.betterAuth.emailProvider === BetterAuthEmailProvider.Resend) {
                depsToInstall.push('resend');
            }
        }
    }


    if (currentStep > createCmdCompleteStep) {
        const hasPostCreateActions = config.styling === StylingChoice.Tailwind || config.useI18n || config.componentLibrary !== ComponentLibrary.None || depsToInstall.length > 0 || devDepsToInstall.length > 0 || currentStep >= 5;
        if (hasPostCreateActions) {
            structuredCmds.push([
              { text: 'cd ', className: 'text-sky-blue' },
              { text: `${config.projectName || '<project-name>'}`, className: 'text-coral-pink font-bold' }
            ]);
        }
    }

    if (currentStep >= 1 && config.styling === StylingChoice.Tailwind) {
        structuredCmds.push([
            { text: 'npx astro add ', className: 'text-sky-blue' },
            { text: 'tailwind', className: 'text-mint-green' }
        ]);
    }
    if (currentStep >= 4 && config.useI18n) {
        structuredCmds.push([
            { text: 'npx astro add ', className: 'text-sky-blue' },
            { text: 'i18n', className: 'text-mint-green' }
        ]);
    }

    if (depsToInstall.length > 0) {
        const installCmd: Command = [];
         switch (config.packageManager) {
            case PackageManager.Yarn:
                installCmd.push({ text: 'yarn add ', className: 'text-sky-blue' });
                break;
            case PackageManager.PNPM:
                installCmd.push({ text: 'pnpm add ', className: 'text-sky-blue' });
                break;
            case PackageManager.NPM:
            default:
                installCmd.push({ text: 'npm install ', className: 'text-sky-blue' });
                break;
        }
        depsToInstall.forEach(dep => installCmd.push({ text: `${dep} `, className: 'text-mint-green' }));
        structuredCmds.push(installCmd);
    }
    if (devDepsToInstall.length > 0) {
        const installCmd: Command = [];
         switch (config.packageManager) {
            case PackageManager.Yarn:
                installCmd.push({ text: 'yarn add -D ', className: 'text-sky-blue' });
                break;
            case PackageManager.PNPM:
                installCmd.push({ text: 'pnpm add -D ', className: 'text-sky-blue' });
                break;
            case PackageManager.NPM:
            default:
                installCmd.push({ text: 'npm install -D ', className: 'text-sky-blue' });
                break;
        }
        devDepsToInstall.forEach(dep => installCmd.push({ text: `${dep} `, className: 'text-mint-green' }));
        structuredCmds.push(installCmd);
    }
    
    if (currentStep >= 2 && config.componentLibrary === ComponentLibrary.Shadcn) {
        structuredCmds.push([{ text: 'npx shadcn-ui@latest init', className: 'text-sky-blue' }]);
        const selected = Object.entries(config.selectedComponents).filter(([,v])=>v).map(([k])=>k.toLowerCase().replace(' ', '-'));
        if (selected.length > 0) {
           const addCmd: Command = [{ text: 'npx shadcn-ui@latest add ', className: 'text-sky-blue' }];
           selected.forEach(comp => addCmd.push({ text: `${comp} `, className: 'text-mint-green' }));
           structuredCmds.push(addCmd);
        }
    }

    if (currentStep >= 2 && config.componentLibrary === ComponentLibrary.Starwind) {
        structuredCmds.push([{ text: 'npx starwind@latest init', className: 'text-sky-blue' }]);
        const selected = Object.entries(config.selectedComponents).filter(([,v])=>v).map(([k])=>k.toLowerCase().replace(/ /g, '-'));
        if (selected.length > 0) {
            const addCmd: Command = [{ text: 'npx starwind@latest add ', className: 'text-sky-blue' }];
            selected.forEach(comp => addCmd.push({ text: `${comp} `, className: 'text-mint-green' }));
            structuredCmds.push(addCmd);
        }
    }

    if (currentStep >= 2 && config.componentLibrary === ComponentLibrary.Custom) {
        const selected = Object.entries(config.selectedComponents).filter(([,v])=>v).map(([k])=>k);
        if (selected.length > 0) {
            structuredCmds.push([
                { text: 'mkdir -p ', className: 'text-sky-blue' },
                { text: 'src/components/custom', className: 'text-mint-green' }
            ]);
            const touchCmd: Command = [{ text: 'touch ', className: 'text-sky-blue' }];
            selected.forEach(c => touchCmd.push({ text: `src/components/custom/${c.replace(/ /g, '')}.astro `, className: 'text-mint-green' }));
            structuredCmds.push(touchCmd);
        }
    }

     if (currentStep >= 6 && config.db.adapter === DbAdapter.Prisma) {
        structuredCmds.push([{ text: 'npx prisma db push', className: 'text-sky-blue' }]);
    }
     if (currentStep >= 6 && config.db.adapter === DbAdapter.Drizzle) {
        const dialect = getDbDialectForDrizzle(config);
        structuredCmds.push([
            { text: `npx drizzle-kit push:${dialect}`, className: 'text-sky-blue' }
        ]);
    }

    return structuredCmds;
};