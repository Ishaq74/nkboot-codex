
import React, { useMemo } from 'react';
import type { AstroConfig } from '../types';
import { TechStackViewer } from './TechStackViewer';
import { getRequiredEnvVars } from '../lib/env';
import { baseSteps } from '../lib/constants';
import { ChoiceImpact } from './ChoiceImpact';

// Import step components
import { StepInitialSetup } from './steps/StepInitialSetup';
import { StepStyling } from './steps/StepStyling';
import { StepComponents } from './steps/StepComponents';
import { StepTheme } from './steps/StepTheme';
import { StepIntegrations } from './steps/StepIntegrations';
import { StepDbAuth } from './steps/StepDbAuth';
import { StepDataSchema } from './steps/StepDataSchema';
import { StepEnvironment } from './steps/StepEnvironment';
import { StepSummary } from './steps/StepSummary';

interface MultiStepFormProps {
  config: AstroConfig;
  updateConfig: (updater: (c: AstroConfig) => AstroConfig) => void;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

// Helper component to render the current step.
const StepContent: React.FC<{
  currentStepInfo: { id: number } | undefined;
  config: AstroConfig;
  updateConfig: (updater: (c: AstroConfig) => AstroConfig) => void;
  requiredEnvVars: { name: string; description: string }[];
}> = ({ currentStepInfo, config, updateConfig, requiredEnvVars }) => {
  if (!currentStepInfo) return null;

  const props = { config, updateConfig: (newConfig) => updateConfig(c => ({...c, ...newConfig})) };
  const functionalUpdateProps = {config, updateConfig};

  switch(currentStepInfo.id) {
    case 0: return <StepInitialSetup {...props} />;
    case 1: return <StepStyling {...props} />;
    case 2: return <StepComponents {...props} />;
    case 3: return <StepTheme {...props} />;
    case 4: return <StepIntegrations {...props} />;
    case 5: return <StepDbAuth {...props} />;
    case 6: return <StepDataSchema {...functionalUpdateProps} />;
    case 7: return <StepEnvironment {...props} requiredEnvVars={requiredEnvVars} />;
    case 8: return <StepSummary {...props} />;
    default: return null;
  }
};


export const MultiStepForm: React.FC<MultiStepFormProps> = ({ config, updateConfig, currentStep, setCurrentStep }) => {
  
  const requiredEnvVars = useMemo(() => getRequiredEnvVars(config), [config]);
  const hasEnvStep = requiredEnvVars.length > 0;

  const steps = useMemo(() => {
    const dynamicSteps = [...baseSteps];
    if (hasEnvStep) {
        dynamicSteps.splice(7, 0, { name: 'Environment', id: 7 });
    }
    return dynamicSteps.map((step, index) => ({ ...step, index }));
  }, [hasEnvStep]);

  const currentStepInfo = useMemo(() => steps.find(s => s.index === currentStep), [steps, currentStep]);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-2 text-cyber-yellow">Astro Setup</h2>
      <TechStackViewer config={config} />
      <div className="mb-6">
        <div className="flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex-1 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.index <= currentStep ? 'bg-sky-blue text-raisin-black' : 'bg-gunmetal text-light-gray'}`}>
                {step.id + 1}
              </div>
              <p className={`text-xs mt-1 text-center hidden sm:block ${step.index <= currentStep ? 'text-sky-blue' : 'text-gray-500'}`}>{step.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-8 min-h-0">
          <div className="overflow-y-auto pr-2">
            <StepContent
              currentStepInfo={currentStepInfo}
              config={config}
              updateConfig={updateConfig}
              requiredEnvVars={requiredEnvVars}
            />
          </div>
          <div className="overflow-y-auto pl-2 hidden md:block">
            {currentStepInfo && <ChoiceImpact currentStepId={currentStepInfo.id} config={config} />}
          </div>
      </div>
      <div className="mt-6 flex justify-between">
        <button onClick={() => setCurrentStep(s => Math.max(0, s - 1))} disabled={currentStep === 0} className="bg-gunmetal hover:bg-gray-700 text-light-gray font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">
          Previous
        </button>
        <button onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))} disabled={currentStep === steps.length - 1} className="bg-sky-blue hover:bg-blue-400 text-raisin-black font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">
          Next
        </button>
      </div>
    </div>
  );
};