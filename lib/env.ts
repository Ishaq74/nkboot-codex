
import type { AstroConfig } from '../types';
import { DbProvider, DbAdapter, AuthProvider, BetterAuthEmailProvider } from '../types';

export const getRequiredEnvVars = (config: AstroConfig): { name: string, description: string }[] => {
    const vars: { name: string, description: string }[] = [];
    const addVar = (name: string, description: string) => {
        if (!vars.some(v => v.name === name)) {
            vars.push({ name, description });
        }
    };

    const dbProvider = config.db.sameForDevProd 
        ? config.db.dev.provider 
        : (config.db.dev.provider !== DbProvider.None ? config.db.dev.provider : config.db.prod.provider);

    if (config.db.adapter !== DbAdapter.None && dbProvider !== DbProvider.SQLite && dbProvider !== DbProvider.None) {
        addVar('DATABASE_URL', 'Your full database connection string.');
    }
    
    if (dbProvider === DbProvider.Supabase) {
        addVar('SUPABASE_URL', 'Your Supabase project URL.');
        addVar('SUPABASE_ANON_KEY', 'Your Supabase project anonymous key.');
    }

    if (config.auth.provider === AuthProvider.BetterAuth) {
        const plugins = config.auth.betterAuth.plugins;
        if (plugins['oauth-github']) {
            addVar('GITHUB_CLIENT_ID', 'GitHub OAuth App Client ID.');
            addVar('GITHUB_CLIENT_SECRET', 'GitHub OAuth App Client Secret.');
        }
        if (plugins['oauth-google']) {
            addVar('GOOGLE_CLIENT_ID', 'Google OAuth App Client ID.');
            addVar('GOOGLE_CLIENT_SECRET', 'Google OAuth App Client Secret.');
        }
        if (plugins.stripe) {
            addVar('STRIPE_SECRET_KEY', 'Your Stripe secret key.');
            addVar('STRIPE_WEBHOOK_SECRET', 'Your Stripe webhook secret.');
        }
        if (plugins.polar) {
            addVar('POLAR_ACCESS_TOKEN', 'Your Polar access token.');
        }

        const email = config.auth.betterAuth.emailProvider;
        if (email === BetterAuthEmailProvider.Nodemailer) {
            addVar('SMTP_HOST', 'SMTP server host.');
            addVar('SMTP_PORT', 'SMTP server port.');
            addVar('SMTP_USER', 'SMTP username.');
            addVar('SMTP_PASS', 'SMTP password.');
            addVar('SMTP_FROM', 'The "from" address for emails.');
        } else if (email === BetterAuthEmailProvider.Resend) {
            addVar('RESEND_API_KEY', 'Your Resend API key.');
            addVar('RESEND_FROM', 'The "from" address for emails.');
        }
    }
    
    return vars;
};