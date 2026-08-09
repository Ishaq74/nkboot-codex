
import React, { useMemo } from 'react';
import type { AstroConfig } from '../types';
import { generateCliCommands, type Command } from '../lib/cli';


interface CliVisualizerProps {
  config: AstroConfig;
  currentStep: number;
}

const Cursor: React.FC = () => (
    <span className="bg-light-gray w-2 h-4 inline-block animate-pulse ml-1" />
);

export const CliVisualizer: React.FC<CliVisualizerProps> = ({ config, currentStep }) => {
  
  const commands: Command[] = useMemo(() => generateCliCommands(config, currentStep), [config, currentStep]);

  return (
    <div className="bg-raisin-black h-full flex flex-col font-mono">
      <div className="flex-shrink-0 bg-gunmetal p-2 flex items-center">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="flex-grow text-center text-sm text-gray-400">bash</span>
      </div>
      <div className="p-4 flex-grow overflow-auto text-light-gray">
          {commands.map((cmd, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-mint-green">~/dev</span>
                <span className="text-light-gray"> $ </span>
              </div>
              <div className="break-all">
                {cmd.map((segment, segIndex) => (
                    <span key={segIndex} className={segment.className}>
                        {segment.text}
                    </span>
                ))}
              </div>
              {index === commands.length - 1 && <Cursor />}
            </div>
          ))}
          {commands.length === 0 && (
             <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-mint-green">~/dev</span>
                  <span className="text-light-gray"> $ </span>
                </div>
                <Cursor />
             </div>
          )}
      </div>
    </div>
  );
};