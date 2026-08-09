
import React from 'react';
import type { AstroConfig } from '../../types';

interface StepProps {
    config: AstroConfig;
    updateConfig: (newConfig: Partial<AstroConfig>) => void;
    requiredEnvVars: { name: string, description: string }[];
}

export const StepEnvironment: React.FC<StepProps> = ({ config, updateConfig, requiredEnvVars }) => {
    return (
        <div>
            <h3 className="text-lg font-bold text-light-gray mb-4 border-b border-gray-600 pb-2">Environment Variables</h3>
            <p className="text-sm text-gray-400 mb-4">Your configuration requires the following secrets. Provide them here to add them to your <code className="bg-gunmetal text-coral-pink px-1 rounded-sm">.env</code> file.</p>
            <div className="space-y-4">
                {requiredEnvVars.map(envVar => (
                    <div key={envVar.name}>
                        <label htmlFor={envVar.name} className="block text-sm font-medium text-light-gray font-mono">{envVar.name}</label>
                        <p className="text-xs text-gray-500 mb-2">{envVar.description}</p>
                        <input
                            type="text"
                            id={envVar.name}
                            value={config.envVars[envVar.name] || ''}
                            onChange={e => updateConfig({ envVars: { ...config.envVars, [envVar.name]: e.target.value } })}
                            className="w-full bg-gunmetal border border-gray-600 rounded-md p-2 text-light-gray font-mono focus:ring-2 focus:ring-cyber-yellow focus:outline-none"
                            placeholder={`Your ${envVar.name.toLowerCase().replace(/_/g, ' ')}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
