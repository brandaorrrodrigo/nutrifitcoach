import React from 'react';

interface ProgressStep {
  label: string;
  completed: boolean;
}

interface ProgressBarProps {
  steps: ProgressStep[];
  currentStep: number;
}

export default function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      {/* Desktop: Horizontal */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step Circle */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all
                  ${
                    index < currentStep
                      ? 'bg-gradient-to-r from-nutrifit-green-500 to-nutrifit-green-600 text-white'
                      : index === currentStep
                      ? 'bg-gradient-to-r from-nutrifit-pink-500 to-nutrifit-purple-600 text-white ring-4 ring-nutrifit-purple-200'
                      : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              <p
                className={`mt-3 text-sm font-semibold text-center ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {step.label}
              </p>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 transition-all ${
                  index < currentStep ? 'bg-nutrifit-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile: Vertical Compact */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-900">
            Etapa {currentStep + 1} de {steps.length}
          </p>
          <p className="text-sm text-gray-600">{steps[currentStep].label}</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-nutrifit-pink-500 to-nutrifit-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
