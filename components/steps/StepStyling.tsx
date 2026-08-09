
import React from 'react';
import type { AstroConfig } from '../../types';
import { StylingChoice } from '../../types';
import { Option } from '../form/Option';
import { impactMap, type ImpactType } from '../../lib/constants';

interface StepProps {
    config: AstroConfig;
    updateConfig: (newConfig: Partial<AstroConfig>) => void;
}

export const StepStyling: React.FC<StepProps> = ({ config, updateConfig }) => {
    return (
      <div>
        <label className="block text-sm font-medium text-light-gray mb-2">Choose a Styling Solution:</label>
        <div className="space-y-2">
          {Object.values(StylingChoice).map(choice => {
            const info = impactMap.styling[choice];
            return(
                <Option key={choice} tooltip={info.tooltip} impacts={info.impacts as ImpactType[]} isSelected={config.styling === choice}>
                    <button onClick={() => updateConfig({ styling: choice })} className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${config.styling === choice ? 'bg-mint-green text-raisin-black font-bold' : 'bg-gunmetal hover:bg-gray-700'}`}>
                    {choice}
                    </button>
                </Option>
            )
          })}
        </div>
      </div>
    );
};
