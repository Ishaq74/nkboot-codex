
import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { AstroConfig } from '../types';
import { diffLines, type Change } from 'diff';
import { getGeneratedProjectFiles } from '../lib/exportProject';

// --- HOOK TO STORE PREVIOUS VALUE ---
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


// --- MAIN COMPONENT ---
interface CodeViewerProps {
  config: AstroConfig;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState('package.json');
  const prevConfig = usePrevious(config);

  const generatedFiles = useMemo(() => getGeneratedProjectFiles(config), [config]);
  const prevGeneratedFiles = useMemo(() => prevConfig ? getGeneratedProjectFiles(prevConfig) : undefined, [prevConfig]);

  const getContentForTab = (tab: string, files = generatedFiles): string => {
    return files.find((file) => file.path === tab)?.content ?? '';
  };
  
  const tabs = useMemo(() => generatedFiles.map((file) => file.path), [generatedFiles]);

  useEffect(() => {
    // If the active tab is no longer available, switch to the first one.
    if (!tabs.includes(activeTab)) {
        setActiveTab(tabs[0]);
    }
  }, [tabs, activeTab]);

  const diffs = useMemo<Change[]>(() => {
    const newContent = getContentForTab(activeTab);
    // On first load, treat the entire file as an addition
    if (!prevConfig) {
      return [{ value: newContent, added: true, removed: false, count: newContent.split('\n').length }];
    }
    const oldContent = getContentForTab(activeTab, prevGeneratedFiles);
    return diffLines(oldContent, newContent);
  }, [activeTab, prevConfig, generatedFiles, prevGeneratedFiles]);


  return (
    <div className="bg-raisin-black h-full flex flex-col font-mono">
      <div className="flex-shrink-0 bg-gunmetal border-b border-jet">
        <nav className="flex space-x-2 p-2 overflow-x-auto">
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1 text-sm rounded-md flex-shrink-0 ${activeTab === tab ? 'bg-jet text-cyber-yellow' : 'text-gray-400 hover:bg-jet/50'}`}
                >
                    {tab}
                </button>
            ))}
        </nav>
      </div>
      <div className="p-4 flex-grow overflow-auto text-light-gray text-xs">
          <pre>
            <code>
              {diffs.map((part, partIndex) => {
                const lines = part.value.split('\n').filter((line, i, arr) => i < arr.length - 1 || line !== '');
                let style = {};
                let prefix = ' ';
                if (part.added) {
                  style = { backgroundColor: 'rgba(44, 150, 88, 0.2)' };
                  prefix = '+';
                } else if (part.removed) {
                  style = { backgroundColor: 'rgba(248, 81, 73, 0.2)' };
                  prefix = '-';
                }
                
                return (
                  <span key={partIndex} style={style} className="block">
                    {lines.map((line, lineIndex) => (
                      <div key={lineIndex} className="flex">
                         <span className={`w-6 flex-shrink-0 text-left pl-2 ${part.added ? 'text-green-400' : part.removed ? 'text-red-400' : 'text-gray-500'}`}>{prefix}</span>
                         <span className="flex-grow">{line}</span>
                      </div>
                    ))}
                  </span>
                );
              })}
            </code>
          </pre>
      </div>
    </div>
  );
};