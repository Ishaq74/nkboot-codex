
import React from 'react';
import type { ImpactType } from '../../lib/constants';

const ImpactIndicator: React.FC<{ type: ImpactType }> = ({ type }) => {
    const colorMap: Record<ImpactType, string> = {
        install: 'bg-sky-blue',
        config: 'bg-cyber-yellow',
        scaffold: 'bg-mint-green',
    };
    const tooltipMap: Record<ImpactType, string> = {
        install: 'Package Install',
        config: 'Config Change',
        scaffold: 'File Scaffolding',
    };
    return <div className={`w-2.5 h-2.5 rounded-full ${colorMap[type]}`} title={tooltipMap[type]} />;
};

export const Option: React.FC<{
    children: React.ReactNode;
    tooltip: string;
    impacts: ImpactType[];
    isSelected: boolean;
}> = ({ children, tooltip, impacts, isSelected }) => {
    return (
        <div className="relative group">
            <div className="flex items-center justify-between">
                <div className="flex-grow">
                    {children}
                </div>
                {isSelected && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1.5 p-1 bg-gunmetal/80 rounded-full">
                        {impacts.map(impact => <ImpactIndicator key={impact} type={impact} />)}
                    </div>
                )}
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs px-3 py-1.5 bg-raisin-black text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                {tooltip}
            </div>
        </div>
    );
};
