import { Check } from 'lucide-react';

import { cn } from '@/utils/cn';

interface HealthCheckStepsProps {
  currentStep: number;
  healthCheckId: string;
  isFacilitator: boolean;
  updateHealthCheck: (data: { id: string; healthCheck: { current_step: number } }) => void;
}

const steps = [
  { id: 1, label: 'Survey' },
  { id: 2, label: 'Discuss' },
  { id: 3, label: 'Review' },
  { id: 4, label: 'Close' },
];

const HealthCheckSteps: React.FC<HealthCheckStepsProps> = ({
  currentStep,
  healthCheckId,
  isFacilitator,
  updateHealthCheck,
}) => {
  return (
    <div className="w-[50%]">
      <div className="relative flex">
        {steps.map((step) => (
          <div key={step.id} className="flex w-full flex-col items-center">
            <button
              className={cn(
                'z-10 flex min-h-8 min-w-8 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-gray-200',
                {
                  'border-orange-500 bg-orange-500 text-white':
                    step.id < currentStep,
                  'border-orange-500 text-orange-500': step.id === currentStep,
                },
              )}
              onClick={() => {
                if (isFacilitator) {
                  updateHealthCheck({ id: healthCheckId, healthCheck: { current_step: step.id } });
                }
              }}
              disabled={!isFacilitator}
            >
              {step.id < currentStep ? <Check /> : step.id}
            </button>
            <p
              className={cn('text-sm', {
                'text-gray-500': step.id > currentStep,
              })}
            >
              {step.label}
            </p>
            {/* {index < steps.length - 1 && (
              <div className="h-1 w-full bg-green-800" />
            )} */}
          </div>
        ))}
        <div className="absolute top-[14px] left-[100px] h-1 w-[490px] bg-gray-200" />
      </div>
    </div>
  );
};

export default HealthCheckSteps;
