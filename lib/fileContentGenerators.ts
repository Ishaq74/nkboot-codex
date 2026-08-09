
import type { AstroConfig, Table, Column } from '../types';
import { Template, StylingChoice, ComponentLibrary, ThemeMode, DbProvider, DbAdapter, AuthProvider, BetterAuthEmailProvider } from '../types';
import { getRequiredEnvVars } from './env';

// --- HELPERS for schema generation ---
const toCamelCase = (str: string) => str.replace(/_([a-z])/g, g => g[1].toUpperCase());
const toPascalCase = (str: string) => toCamelCase(str).charAt(0).toUpperCase() + toCamelCase(str).slice(1);
const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

const getDrizzleDbInstance = (config: AstroConfig) => {
    const provider = config.db.dev.provider !== DbProvider.None ? config.db.dev.provider : config.db.prod.provider;
    switch (provider) {
        case DbProvider.Postgres:
        case DbProvider.Neon:
        case DbProvider.Supabase:
            return 'pgTable';
        case DbProvider.MySQL:
        case DbProvider.PlanetScale:
            return 'mysqlTable';
        case DbProvider.SQLite:
            return 'sqliteTable';
        default:
            return 'pgTable'; // Default to pg
    }
}

const getDrizzleColumnType = (col: Column, provider: DbProvider) => {
    const isPg = [DbProvider.Postgres, DbProvider.Neon, DbProvider.Supabase].includes(provider);
    switch (col.type) {
        case 'id': return "serial('id')";
        case 'string': return "varchar('name', { length: 256 })";
        case 'text': return "text('content')";
        case 'number': return "integer('value')";
        case 'boolean': return "boolean('is_active')";
        case 'date': return isPg ? "timestamp('created_at')" : "datetime('created_at')";
        case 'json': return isPg ? "jsonb('data')" : "json('data')";
        default: return "varchar('default_col')";
    }
}

const getPrismaColumnType = (col: Column) => {
    switch (col.type) {
        case 'id': return 'Int @id @default(autoincrement())';
        case 'string': return 'String';
        case 'text': return 'String @db.Text';
        case 'number': return 'Int';
        case 'boolean': return 'Boolean';
        case 'date': return 'DateTime @default(now())';
        case 'json': return 'Json';
        case 'relation': return `${toPascalCase(col.options.relatedTo || '')}? @relation(fields: [${toCamelCase(col.name)}Id], references: [id])`;
        default: return 'String';
    }
}

// --- MAIN FILE GENERATORS ---

export const getPackageJsonContent = (config: AstroConfig) => {
    const deps: Record<string, string> = { "astro": "^4.0.0" };
    const devDeps: Record<string, string> = {};

    const frameworkDeps: Record<string, Record<string, string>> = {
        [Template.React]: { "@astrojs/react": "^3.0.0", "react": "^18.2.0", "react-dom": "^18.2.0" },
        [Template.Vue]: { "@astrojs/vue": "^4.0.0", "vue": "^3.3.11" },
        [Template.Svelte]: { "@astrojs/svelte": "^5.0.0", "svelte": "^4.2.8" },
    };
    if(frameworkDeps[config.template]) {
        Object.assign(deps, frameworkDeps[config.template]);
    }
    
    if (config.typescript !== 'None') deps["typescript"] = "^5.3.3";
    if (config.styling === StylingChoice.Tailwind) {
        deps["@astrojs/tailwind"] = "^5.1.0";
        deps["tailwindcss"] = "^3.4.1";
    }
    if(config.useI18n) deps["@astrojs/i18n"] = "^0.1.0";
    if (config.useAstroFont) deps['astro-font'] = '^0.0.8';
    if (config.useAstroIcon) {
        deps['astro-icon'] = '^1.1.0';
        Object.keys(config.iconLibraries).forEach(libKey => {
            if(config.iconLibraries[libKey]) deps[`@iconify-json/${libKey}`] = '^1.1.0';
        });
    }
    if (config.componentLibrary === ComponentLibrary.Daisy) deps['daisyui'] = '^4.7.2';
    if (config.componentLibrary === ComponentLibrary.Shadcn) {
        deps["tailwindcss-animate"] = "^1.0.7";
        deps["class-variance-authority"] = "^0.7.0";
        deps["clsx"] = "^2.1.0";
        deps["tailwind-merge"] = "^2.2.1";
        deps["lucide-react"] = "^0.344.0";
    }

    // DB & Auth Deps
    const providers = new Set<DbProvider>();
    if (config.db.dev.provider !== DbProvider.None) providers.add(config.db.dev.provider);
    if (!config.db.sameForDevProd && config.db.prod.provider !== DbProvider.None) providers.add(config.db.prod.provider);
    if (providers.has(DbProvider.Postgres) || providers.has(DbProvider.Neon) || providers.has(DbProvider.Supabase)) deps['pg'] = '^8.11.3';
    if (providers.has(DbProvider.MySQL) || providers.has(DbProvider.PlanetScale)) deps['mysql2'] = '^3.9.2';
    if (providers.has(DbProvider.Supabase)) deps['@supabase/supabase-js'] = '^2.39.7';

    if (config.db.adapter === DbAdapter.Drizzle) {
        deps['drizzle-orm'] = '^0.30.1';
        devDeps['drizzle-kit'] = '^0.20.14';
        devDeps['dotenv'] = '^16.4.5';
    } else if (config.db.adapter === DbAdapter.Prisma) {
        deps['@prisma/client'] = '^5.10.2';
        devDeps['prisma'] = '^5.10.2';
    }

    if (config.auth.provider === AuthProvider.BetterAuth) {
        deps['better-auth'] = '^1.0.0'; // Placeholder version
        const plugins = config.auth.betterAuth.plugins;
        if (plugins.sso) deps['@better-auth/sso'] = '^1.0.0';
        if (plugins.stripe) { deps['@better-auth/stripe'] = '^1.0.0'; deps['stripe'] = '^14.19.0'; }
        if (plugins.polar) { deps['@polar-sh/better-auth'] = '^1.0.0'; deps['@polar-sh/sdk'] = '^0.5.0'; }
        if (plugins.dub) { deps['@dub/better-auth'] = '^1.0.0'; deps['dub'] = '^0.2.0'; }
        if (plugins.expo) deps['@better-auth/expo'] = '^1.0.0';

        if (config.auth.betterAuth.emailProvider === BetterAuthEmailProvider.Nodemailer) {
            deps['nodemailer'] = '^6.9.11';
            devDeps['@types/nodemailer'] = '^6.4.14';
        } else if (config.auth.betterAuth.emailProvider === BetterAuthEmailProvider.Resend) {
            deps['resend'] = '^3.2.0';
        }
    }

    return JSON.stringify({
        "name": config.projectName, "type": "module", "version": "0.0.1",
        "scripts": { "dev": "astro dev", "start": "astro dev", "build": "astro build", "preview": "astro preview", "astro": "astro" },
        "dependencies": deps,
        ...(Object.keys(devDeps).length > 0 && { "devDependencies": devDeps })
    }, null, 2);
};

export const getAstroConfigContent = (config: AstroConfig) => {
  const imports = ['import { defineConfig } from "astro/config";'];
  const integrations = [];

  if (config.template === Template.React) { imports.push('import react from "@astrojs/react";'); integrations.push('react()'); }
  if (config.template === Template.Vue) { imports.push('import vue from "@astrojs/vue";'); integrations.push('vue()'); }
  if (config.template === Template.Svelte) { imports.push('import svelte from "@astrojs/svelte";'); integrations.push('svelte()'); }
  if (config.styling === StylingChoice.Tailwind) { imports.push('import tailwind from "@astrojs/tailwind";'); integrations.push('tailwind()'); }
  if (config.useI18n) { imports.push('import i18n from "@astrojs/i18n";'); integrations.push(`i18n(${JSON.stringify(config.i18n, null, 2)})`);}
  if (config.useAstroFont) { imports.push('import font from "astro-font";'); integrations.push('font()'); }
  if (config.useAstroIcon) { imports.push('import icon from "astro-icon";'); integrations.push('icon()'); }

  const integrationStr = integrations.length > 0 ? `\n    ${integrations.join(',\n    ')}\n  ` : '';

  return `${imports.join('\n')}\n\n// https://astro.build/config\nexport default defineConfig({\n  integrations: [${integrationStr}]\n});`;
};

export const getTailwindConfigContent = (config: AstroConfig) => {
    const plugins = [];
    if (config.componentLibrary === ComponentLibrary.Daisy) plugins.push('require("daisyui")');
    return `/** @type {import('tailwindcss').Config} */\nexport default {\n  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],\n  theme: {\n    extend: {},\n  },\n  plugins: [${plugins.join(', ')}],\n}`;
};

export const getThemeCssContent = (config: AstroConfig) => {
    let content = `/* src/styles/theme.css */\n`;
    if (config.styling === StylingChoice.Tailwind) content += `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n`;
    const generateVariables = (theme: 'light' | 'dark') => config.theme[theme].map(v => `  ${v.name}: ${v.value};`).join('\n');
    if (config.theme.mode === ThemeMode.Light) content += `:root {\n${generateVariables('light')}\n}\n`;
    else if (config.theme.mode === ThemeMode.Dark) content += `:root {\n${generateVariables('dark')}\n}\n`;
    else {
        content += `:root {\n${generateVariables('light')}\n}\n\n`;
        content += `@media (prefers-color-scheme: dark) {\n  :root {\n${generateVariables('dark')}\n  }\n}\n`;
    }
    if (config.styling !== StylingChoice.Tailwind) {
        content += `\nbody {\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n  background-color: var(--color-bg);\n  color: var(--color-text);\n  line-height: 1.5;\n}\n\nh1, h2, h3 {\n  color: var(--color-primary);\n}\n`;
    }
    return content;
};

export const getDrizzleSchemaContent = (config: AstroConfig) => {
    const provider = config.db.dev.provider !== DbProvider.None ? config.db.dev.provider : config.db.prod.provider;
    const isPg = [DbProvider.Postgres, DbProvider.Neon, DbProvider.Supabase].includes(provider);
    const isMysql = [DbProvider.MySQL, DbProvider.PlanetScale].includes(provider);
    
    const imports = new Set<string>();
    if (isPg) imports.add(`import { pgTable, serial, text, varchar, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';`);
    if (isMysql) imports.add(`import { mysqlTable, serial, text, varchar, datetime, boolean, int, json } from 'drizzle-orm/mysql-core';`);
    // TODO: Add SQLite imports when supported

    let schemaContent = '';
    
    config.schema.tables.forEach(table => {
        const tableName = toCamelCase(table.name);
        schemaContent += `\nexport const ${tableName} = ${getDrizzleDbInstance(config)}('${toSnakeCase(table.name)}', {\n`;
        table.columns.forEach(col => {
            const colName = toSnakeCase(col.name);
            let colType = getDrizzleColumnType(col, provider).replace(/'[^']+'/, `'${colName}'`);
            
            if (col.options.primaryKey && col.type !== 'id') {
                colType += '.primaryKey()';
            }
            if (col.options.notNull) {
                colType += '.notNull()';
            }
            if (col.options.unique) {
                colType += '.unique()';
            }
            if (col.options.default !== undefined) {
                 colType += `.default(${JSON.stringify(col.options.default)})`;
            }
            if (col.type === 'relation' && col.options.relatedTo) {
                 colType = `integer('${colName}_id').references(() => ${toCamelCase(col.options.relatedTo)}.id)`;
            }

            schemaContent += `  ${toCamelCase(colName)}: ${colType},\n`;
        });
        schemaContent += `});\n`;
    });
    
    return `${Array.from(imports).join('\n')}\n${schemaContent}`;
};

export const getPrismaSchemaContent = (config: AstroConfig) => {
    const primaryProvider = config.db.dev.provider !== DbProvider.None ? config.db.dev.provider : config.db.prod.provider;
    const providerMap: Partial<Record<DbProvider, string>> = {
        [DbProvider.Postgres]: 'postgresql',
        [DbProvider.Neon]: 'postgresql',
        [DbProvider.Supabase]: 'postgresql',
        [DbProvider.MySQL]: 'mysql',
        [DbProvider.PlanetScale]: 'mysql',
        [DbProvider.SQLite]: 'sqlite',
    };
    const provider = providerMap[primaryProvider] || 'postgresql';

    let schemaContent = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}\n\n`;

    config.schema.tables.forEach(table => {
        schemaContent += `model ${toPascalCase(table.name)} {\n`;
        table.columns.forEach(col => {
            const colName = toCamelCase(col.name);
            let colType = getPrismaColumnType(col);
            let options = '';
            if (col.options.unique) options += ' @unique';
            if (col.options.default !== undefined) options += ` @default(${col.options.default})`;
             if (col.type === 'relation' && col.options.relatedTo) {
                schemaContent += `  ${colName}Id Int?\n`
             }
            schemaContent += `  ${colName} ${colType}${options}\n`;
        });
        schemaContent += '}\n\n';
    });

    return schemaContent;
};

export const getAuthTsContent = (config: AstroConfig) => {
    const { plugins } = config.auth.betterAuth;
    const primaryProvider = config.db.dev.provider !== DbProvider.None ? config.db.dev.provider : config.db.prod.provider;
    const isPg = [DbProvider.Postgres, DbProvider.Neon, DbProvider.Supabase].includes(primaryProvider);
    const isMysql = [DbProvider.MySQL, DbProvider.PlanetScale].includes(primaryProvider);

    const corePlugins = Object.keys(plugins).filter(p => ['admin','organization','username','twoFactor','bearer','anonymous','openAPI'].includes(p));
    
    const imports = ['import { betterAuth } from "better-auth";'];
    if (isPg) imports.push('import { Pool } from "pg";');
    if (isMysql) imports.push('import mysql from "mysql2/promise";');
    if (corePlugins.length) imports.push(`import { ${corePlugins.join(', ')} } from "better-auth/plugins";`);
    if (plugins.sso) imports.push(`import { sso } from "@better-auth/sso";`);
    if (plugins.stripe) { imports.push(`import { stripe as stripePlugin } from "@better-auth/stripe";`, `import Stripe from "stripe";`); }
    if (plugins.polar) { imports.push(`import { polar } from "@polar-sh/better-auth";`, `import { Polar } from "@polar-sh/sdk";`); }
    if (plugins.dub) { imports.push(`import { dubAnalytics } from "@dub/better-auth";`, `import { Dub } from "dub";`); }
    if (plugins.expo) imports.push(`import { expo } from "@better-auth/expo";`);
    
    const configProperties = [];

    if (isPg) {
        configProperties.push(`  database: new Pool({ connectionString: process.env.DATABASE_URL_DEV || process.env.DATABASE_URL_LOCAL || process.env.DATABASE_URL })`);
    } else if (isMysql) {
        configProperties.push(`  database: mysql.createPool(process.env.DATABASE_URL_DEV || process.env.DATABASE_URL_LOCAL || process.env.DATABASE_URL)`);
    }

    if (plugins['email-password']) {
        configProperties.push(`  emailAndPassword: { enabled: true }`);
    }

    const socialProviders = [];
    if (plugins['oauth-github']) socialProviders.push(`github: { clientId: process.env.GITHUB_CLIENT_ID!, clientSecret: process.env.GITHUB_CLIENT_SECRET! }`);
    if (plugins['oauth-google']) socialProviders.push(`google: { clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! }`);
    if (socialProviders.length > 0) {
        configProperties.push(`  socialProviders: { ${socialProviders.join(', ')} }`);
    }

    const pluginCalls = [...corePlugins.map(p => `${p}()`)];
    if (plugins.sso) pluginCalls.push('sso()');
    if (plugins.stripe) pluginCalls.push(`stripePlugin({ stripeClient: new Stripe(process.env.STRIPE_SECRET_KEY!), stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET! })`);
    if (plugins.polar) pluginCalls.push(`polar({ client: new Polar({ accessToken: process.env.POLAR_ACCESS_TOKEN }) })`);
    if (plugins.dub) pluginCalls.push(`dubAnalytics({ dubClient: new Dub() })`);
    if (plugins.expo) pluginCalls.push('expo()');
    if (pluginCalls.length > 0) {
        configProperties.push(`  plugins: [ ${pluginCalls.join(', ')} ]`);
    }
    
    const configBody = configProperties.join(',\n');
    
    return `// Auto-generated - adjust to your project needs
${imports.join('\n')}

export const auth = betterAuth({
${configBody}
});
`;
};

export const getMiddlewareTsContent = () => {
    return `import { auth } from "./auth";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const session = await auth.api.getSession({ headers: context.request.headers });
  if (session) {
    context.locals.user = session.user;
    context.locals.session = session.session;
  } else {
    context.locals.user = null;
    context.locals.session = null;
  }
  return next();
});
`;
};

export const getApiAuthRouteContent = () => {
    return `import type { APIRoute } from "astro";
import { auth } from "../../../../auth";

export const ALL: APIRoute = async (ctx) => {
  return auth.handler(ctx.request);
};
`;
};

export const getAuthClientContent = (config: AstroConfig) => {
    const { plugins } = config.auth.betterAuth;
    const imports = [`import { createAuthClient } from "better-auth/client";`];
    const clientPlugins = [];

    if (plugins.sso) { imports.push(`import { ssoClient } from "@better-auth/sso/client";`); clientPlugins.push('ssoClient()'); }
    if (plugins.stripe) { imports.push(`import { stripeClient } from "@better-auth/stripe/client";`); clientPlugins.push('stripeClient({ subscription: true })'); }
    if (plugins.polar) { imports.push(`import { polarClient } from "@polar-sh/better-auth";`); clientPlugins.push('polarClient()'); }

    const configLines = clientPlugins.length > 0 ? `  plugins: [ ${clientPlugins.join(', ')} ]\n` : '';
    
    return `${imports.join('\n')}

export const authClient = createAuthClient({
${configLines}});
`;
};

export const getEmailUtilContent = (config: AstroConfig) => {
    if (config.auth.betterAuth.emailProvider === BetterAuthEmailProvider.Nodemailer) {
        return `import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
  auth: (process.env.SMTP_USER && process.env.SMTP_PASS) ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
});

export async function sendEmail({ to, subject, text, html }: { to: string; subject: string; text?: string; html?: string; }) {
  await transporter.sendMail({ from: process.env.SMTP_FROM!, to, subject, text, html });
}
`;
    }
    if (config.auth.betterAuth.emailProvider === BetterAuthEmailProvider.Resend) {
        return `import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, text, html }: { to: string; subject: string; text?: string; html?: string; }) {
  await resend.emails.send({ from: process.env.RESEND_FROM!, to, subject, text, html });
}
`;
    }
    return '';
};

export const getEnvDTsContent = () => {
    return `/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    user: import("better-auth").User | null;
    session: import("better-auth").Session | null;
  }
}
`;
};

export const getEnvContent = (config: AstroConfig): string => {
    const requiredVars = getRequiredEnvVars(config);
    if (requiredVars.length === 0) return '';
    
    let content = `# Environment variables for your Astro project\n# Fill in the values for your setup\n\n`;

    requiredVars.forEach(envVar => {
        const value = config.envVars[envVar.name] || '';
        const placeholder = value ? '' : ` # 👈 SET YOUR SECRET HERE`;
        content += `# ${envVar.description}\n`;
        content += `${envVar.name}="${value}"${placeholder}\n\n`;
    });
    
    return content.trim();
};