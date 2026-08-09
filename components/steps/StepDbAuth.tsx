
import React from 'react';
import type { AstroConfig } from '../../types';
import { DbProvider, DbAdapter, AuthProvider, BetterAuthEmailProvider } from '../../types';
import { betterAuthPlugins } from '../../lib/stepData';

interface StepProps {
    config: AstroConfig;
    updateConfig: (newConfig: Partial<AstroConfig>) => void;
}

export const StepDbAuth: React.FC<StepProps> = ({ config, updateConfig }) => {
    const isDbAdapterDisabled = config.db.dev.provider === DbProvider.None && config.db.prod.provider === DbProvider.None;
    const isSupabaseAuthDisabled = config.db.dev.provider !== DbProvider.Supabase || config.db.prod.provider !== DbProvider.Supabase;

    const handlePluginToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.currentTarget.dataset.key as string;
        const newPlugins = { ...config.auth.betterAuth.plugins };
        if (newPlugins[key]) {
            delete newPlugins[key];
        } else {
            newPlugins[key] = true;
        }
        updateConfig({
            auth: {
                ...config.auth,
                betterAuth: {
                    ...config.auth.betterAuth,
                    plugins: newPlugins,
                },
            },
        });
    };

    const handleEmailProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateConfig({
            auth: {
                ...config.auth,
                betterAuth: {
                    ...config.auth.betterAuth,
                    emailProvider: e.target.value as BetterAuthEmailProvider,
                },
            },
        });
    };
    
    const toggleSameForDevProd = () => {
        updateConfig({ db: { ...config.db, sameForDevProd: !config.db.sameForDevProd } });
    };

    const handleDbProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const p = e.target.value as DbProvider;
        updateConfig({ db: { ...config.db, dev: { provider: p }, prod: { provider: p } } });
    };

    const handleDevDbProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateConfig({ db: { ...config.db, dev: { provider: e.target.value as DbProvider } } });
    };

    const handleProdDbProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateConfig({ db: { ...config.db, prod: { provider: e.target.value as DbProvider } } });
    };

    const handleDbAdapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateConfig({ db: { ...config.db, adapter: e.target.value as DbAdapter } });
    };
    
    const handleAuthProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateConfig({ auth: { ...config.auth, provider: e.target.value as AuthProvider } });
    };


    return (
        <div className="space-y-8">
            {/* Database Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-light-gray border-b border-gunmetal pb-2">Database</h3>
                <div className="flex items-center justify-between p-3 rounded-md bg-gunmetal">
                    <span>Use same database for Dev & Prod?</span>
                    <div className="w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out cursor-pointer" onClick={toggleSameForDevProd}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${config.db.sameForDevProd ? 'translate-x-6' : ''}`} />
                    </div>
                </div>

                {config.db.sameForDevProd ? (
                    <div>
                        <label htmlFor="db-provider" className="block text-sm font-medium text-light-gray mb-2">Database Provider:</label>
                        <select id="db-provider" value={config.db.dev.provider} onChange={handleDbProviderChange} className="w-full bg-gunmetal border border-gray-600 rounded-md p-2 text-light-gray focus:ring-2 focus:ring-cyber-yellow focus:outline-none">
                            {Object.values(DbProvider).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="db-dev-provider" className="block text-sm font-medium text-light-gray mb-2">Dev Provider:</label>
                            <select id="db-dev-provider" value={config.db.dev.provider} onChange={handleDevDbProviderChange} className="w-full bg-gunmetal border border-gray-600 rounded-md p-2 text-light-gray focus:ring-2 focus:ring-cyber-yellow focus:outline-none">
                                {Object.values(DbProvider).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="db-prod-provider" className="block text-sm font-medium text-light-gray mb-2">Prod Provider:</label>
                            <select id="db-prod-provider" value={config.db.prod.provider} onChange={handleProdDbProviderChange} className="w-full bg-gunmetal border border-gray-600 rounded-md p-2 text-light-gray focus:ring-2 focus:ring-cyber-yellow focus:outline-none">
                                {Object.values(DbProvider).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>
                )}

                <div>
                    <label htmlFor="db-adapter" className="block text-sm font-medium mb-2" style={{ color: isDbAdapterDisabled ? '#6B7280' : '#D1D5DB' }}>Database Adapter:</label>
                    <select id="db-adapter" disabled={isDbAdapterDisabled} value={config.db.adapter} onChange={handleDbAdapterChange} className="w-full bg-gunmetal border border-gray-600 rounded-md p-2 text-light-gray focus:ring-2 focus:ring-cyber-yellow focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                       {Object.values(DbAdapter).map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                     {isDbAdapterDisabled && <p className="text-xs text-gray-500 mt-1">Select a database provider to enable adapters.</p>}
                </div>
            </div>

            {/* Auth Section */}
            <div className="space-y-4">
                 <h3 className="text-lg font-semibold text-light-gray border-b border-gunmetal pb-2">Authentication</h3>
                  <div>
                    <label htmlFor="auth-provider" className="block text-sm font-medium text-light-gray mb-2">Auth Provider:</label>
                    <select id="auth-provider" value={config.auth.provider} onChange={handleAuthProviderChange} className="w-full bg-gunmetal border border-gray-600 rounded-md p-2 text-light-gray focus:ring-2 focus:ring-cyber-yellow focus:outline-none">
                       {Object.values(AuthProvider).map(p => (
                            <option key={p} value={p} disabled={p === AuthProvider.Supabase && isSupabaseAuthDisabled}>{p}</option>
                       ))}
                    </select>
                    {isSupabaseAuthDisabled && config.auth.provider !== AuthProvider.Supabase && <p className="text-xs text-gray-500 mt-1">Select 'Supabase' as DB provider for both Dev & Prod to enable Supabase Auth.</p>}
                </div>

                {config.auth.provider === AuthProvider.BetterAuth && (
                     <div className="mt-4 pt-3 pl-4 border-l-2 border-sky-blue/30 space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Better Auth Plugins:</label>
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                                 {Object.entries(betterAuthPlugins).map(([key, name]) => (
                                    <div key={key} className="flex items-center">
                                        <input type="checkbox" id={`plugin-${key}`} checked={!!config.auth.betterAuth.plugins[key]} onChange={handlePluginToggle} data-key={key} className="h-4 w-4 rounded border-gray-500 bg-gunmetal text-sky-blue focus:ring-sky-blue"/>
                                        <label htmlFor={`plugin-${key}`} className="ml-3 text-sm text-light-gray">{name}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email-provider" className="block text-xs font-medium text-gray-400 mb-1">Email Provider:</label>
                            <select id="email-provider" value={config.auth.betterAuth.emailProvider} onChange={handleEmailProviderChange} className="w-full bg-jet border border-gray-600 rounded-md p-2 text-sm text-light-gray focus:ring-2 focus:ring-cyber-yellow focus:outline-none">
                                 {Object.values(BetterAuthEmailProvider).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                     </div>
                )}
            </div>
        </div>
    );
};