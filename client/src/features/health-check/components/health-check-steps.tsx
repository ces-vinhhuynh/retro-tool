import { Check } from 'lucide-react';

import { cn } from '@/utils/cn';

import { STEPS } from '../utils/constants';

interface HealthCheckStepsProps {
  currentStep: number;
  isFacilitator: boolean;
  handleChangeStep: (step: keyof typeof STEPS) => void;
}

const HealthCheckSteps = ({
  currentStep,
  isFacilitator,
  handleChangeStep,
}: HealthCheckStepsProps) => {
  return (
    <div className="mx-auto w-full sm:w-[80%] md:w-[60%]">
      <div className="no-scrollbar relative flex overflow-x-auto px-2 sm:px-0">
        {Object.values(STEPS).map(({ key, value }, index) => (
          <div
            key={key}
            className="flex min-w-[70px] flex-1 flex-col items-center gap-1.5"
          >
            <button
              className={cn(
                'z-10 flex min-h-8 min-w-8 cursor-default items-center justify-center rounded-full border-2 border-gray-200 bg-white text-sm font-semibold text-gray-400/80 transition-colors duration-150 sm:min-h-10 sm:min-w-10 sm:text-base',
                {
                  'border-orange-500 bg-orange-500 text-white':
                    key < currentStep,
                  'border-orange-500 text-orange-500': key === currentStep,
                  'cursor-pointer': isFacilitator,
                },
              )}
              onClick={() => {
                if (isFacilitator) {
                  handleChangeStep(
                    Object.keys(STEPS)[index] as keyof typeof STEPS,
                  );
                }
              }}
              disabled={!isFacilitator}
            >
              {key < currentStep ? (
                <Check className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                key
              )}
            </button>
            <p
              className={cn(
                'max-w-[80px] truncate text-center text-xs sm:text-sm',
                {
                  'text-gray-500': key > currentStep,
                },
              )}
              title={value}
            >
              {value}
            </p>
          </div>
        ))}
        <div className="absolute top-1/3 left-[12%] z-0 h-1 w-[75%] bg-gray-200" />
      </div>
    </div>
  );
};

export default HealthCheckSteps;
