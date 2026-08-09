
import React, { useEffect, useMemo } from 'react';
import type { AstroConfig } from '../../types';
import { StylingChoice, ComponentLibrary, Template } from '../../types';
import { Option } from '../form/Option';
import { impactMap, type ImpactType } from '../../lib/constants';
import { componentLists } from '../../lib/stepData';

interface StepProps {
    config: AstroConfig;
    updateConfig: (newConfig: Partial<AstroConfig>) => void;
}

export const StepComponents: React.FC<StepProps> = ({ config, updateConfig }) => {
  const isReactTemplate = useMemo(() => config.template === Template.React, [config.template]);

  useEffect(() => {
    if (config.styling !== StylingChoice.Tailwind && config.componentLibrary === ComponentLibrary.Daisy) {
        updateConfig({ componentLibrary: ComponentLibrary.None, selectedComponents: {} });
    }
    if (!isReactTemplate && config.componentLibrary === ComponentLibrary.Shadcn) {
        updateConfig({ componentLibrary: ComponentLibrary.None, selectedComponents: {} });
    }
  }, [config.styling, isReactTemplate, config.componentLibrary, updateConfig]);

  const handleComponentLibraryChange = (library: ComponentLibrary) => {
    const newSelectedComponents: Record<string, boolean> = {};
    if (library !== ComponentLibrary.None) {
        componentLists[library].forEach(comp => {
            newSelectedComponents[comp] = true;
        });
    }
    updateConfig({ componentLibrary: library, selectedComponents: newSelectedComponents });
  };

  const toggleComponentSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const componentName = e.currentTarget.dataset.component as string;
    updateConfig({
        selectedComponents: {
            ...config.selectedComponents,
            [componentName]: !config.selectedComponents[componentName]
        }
    });
  };

  const isShadcnDisabled = !isReactTemplate;
  const isDaisyDisabled = config.styling !== StylingChoice.Tailwind;

  return (
    <div>
        <label className="block text-sm font-medium text-light-gray mb-2">Choose a Component Library:</label>
        <div className="space-y-2">
            {Object.values(ComponentLibrary).map(lib => {
                const isDisabled = (lib === ComponentLibrary.Shadcn && isShadcnDisabled) || (lib === ComponentLibrary.Daisy && isDaisyDisabled);
                const info = impactMap.components[lib];
                let tooltip = info.tooltip;
                if (isDisabled) tooltip += lib === ComponentLibrary.Shadcn ? ' (Requires React Template)' : ' (Requires Tailwind CSS)';

                return (
                    <Option key={lib} tooltip={tooltip} impacts={info.impacts as ImpactType[]} isSelected={config.componentLibrary === lib}>
                        <button 
                            onClick={() => handleComponentLibraryChange(lib)}
                            disabled={isDisabled}
                            className={`w-full text-left p-3 rounded-md transition-colors duration-200 relative ${config.componentLibrary === lib ? 'bg-cyber-yellow text-raisin-black font-bold' : 'bg-gunmetal'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                        >
                            {lib}
                        </button>
                    </Option>
                );
            })}
        </div>
        {config.componentLibrary !== ComponentLibrary.None && componentLists[config.componentLibrary].length > 0 && (
            <div className="mt-4 pt-3 pl-4 border-l-2 border-sky-blue/30 space-y-3 max-h-48 overflow-y-auto">
                <label className="block text-xs font-medium text-gray-400">Select components to include:</label>
                {componentLists[config.componentLibrary].map(comp => (
                     <div key={comp} className="flex items-center">
                        <input type="checkbox" id={`comp-${comp}`} checked={!!config.selectedComponents[comp]} onChange={toggleComponentSelection} data-component={comp} className="h-4 w-4 rounded border-gray-500 bg-gunmetal text-sky-blue focus:ring-sky-blue"/>
                        <label htmlFor={`comp-${comp}`} className="ml-3 text-sm text-light-gray">{comp}</label>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};