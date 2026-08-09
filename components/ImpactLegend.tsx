import React from 'react';

const LegendItem: React.FC<{ colorClass: string; text: string }> = ({ colorClass, text }) => (
    <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
        <span className="text-xs text-gray-400">{text}</span>
    </div>
);

export const ImpactLegend: React.FC = () => {
    return (
        <div className="flex items-center space-x-4 bg-jet p-2 rounded-lg">
            <LegendItem colorClass="bg-sky-blue" text="Package Install" />
            <LegendItem colorClass="bg-cyber-yellow" text="Config Change" />
            <LegendItem colorClass="bg-mint-green" text="File Scaffolding" />
        </div>
    );
};
