
import React from 'react';
import type { AstroConfig } from '../../types';
import { PackageManager, Template, TypeScriptLevel } from '../../types';
import { Option } from '../form/Option';

interface StepProps {
    config: AstroConfig;
    updateConfig: (newConfig: Partial<AstroConfig>) => void;
}

export const StepInitialSetup: React.FC<StepProps> = ({ config, updateConfig }) => {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-light-gray mb-2">Choose a Package Manager:</label>
          <div className="space-y-2">
            {Object.values(PackageManager).map(pm => (
               <Option key={pm} tooltip={`Uses ${pm} for all installation commands.`} impacts={[]} isSelected={config.packageManager === pm}>
                  <button onClick={() => updateConfig({ packageManager: pm })} className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${config.packageManager === pm ? 'bg-cyber-yellow text-raisin-black font-bold' : 'bg-gunmetal hover:bg-gray-700'}`}>
                    {pm.toUpperCase()}
                  </button>
               </Option>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-light-gray mb-2">Project Name:</label>
            <input type="text" id="projectName" value={config.projectName} onChange={(e) => updateConfig({ projectName: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="w-full bg-gunmetal border border-gray-600 rounded-md p-2 text-light-gray focus:ring-2 focus:ring-cyber-yellow focus:outline-none" placeholder="my-astro-site"/>
          </div>
          <div>
              <label htmlFor="template" className="block text-sm font-medium text-light-gray mb-2">Template:</label>
              <select id="template" value={config.template} onChange={e => updateConfig({ template: e.target.value as Template })} className="w-full bg-gunmetal border border-gray-600 rounded-md p-2 text-light-gray focus:ring-2 focus:ring-cyber-yellow focus:outline-none">
                  <optgroup label="Official Templates">
                    <option value={Template.Minimal}>Minimal</option>
                    <option value={Template.Basics}>Basics</option>
                    <option value={Template.Blog}>Blog</option>
                    <option value={Template.Portfolio}>Portfolio</option>
                  </optgroup>
                   <optgroup label="Framework Starters">
                    <option value={Template.React}>React</option>
                    <option value={Template.Vue}>Vue</option>
                    <option value={Template.Svelte}>Svelte</option>
                  </optgroup>
              </select>
          </div>
          <div>
              <label htmlFor="typescript" className="block text-sm font-medium text-light-gray mb-2">TypeScript:</label>
              <select id="typescript" value={config.typescript} onChange={e => updateConfig({ typescript: e.target.value as TypeScriptLevel })} className="w-full bg-gunmetal border border-gray-600 rounded-md p-2 text-light-gray focus:ring-2 focus:ring-cyber-yellow focus:outline-none">
                  {Object.values(TypeScriptLevel).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
          </div>
        </div>

        <div className="space-y-4">
           <Option tooltip="Automatically runs your package manager's install command after setup." impacts={[]} isSelected={config.installDeps}>
                <div className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors duration-200 bg-gunmetal`} onClick={() => updateConfig({ installDeps: !config.installDeps })}>
                <span>Install dependencies?</span>
                <div className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${config.installDeps ? 'bg-raisin-black/50' : 'bg-gray-500'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${config.installDeps ? 'translate-x-6' : ''}`} />
                </div>
                </div>
            </Option>
            <Option tooltip="Initializes a new Git repository in your project folder." impacts={[]} isSelected={config.initGit}>
                <div className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors duration-200 bg-gunmetal`} onClick={() => updateConfig({ initGit: !config.initGit })}>
                <span>Initialize a new git repository?</span>
                <div className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${config.initGit ? 'bg-raisin-black/50' : 'bg-gray-500'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${config.initGit ? 'translate-x-6' : ''}`} />
                </div>
                </div>
            </Option>
        </div>
      </div>
    );
};
