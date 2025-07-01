import { ArrowRightToLine } from 'lucide-react';
import React, { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { useSubMenuStore } from '../stores/sub-menu-store';

interface SubMenuWrapperProps {
  Icon: React.ComponentType<{ size: number; className?: string }>;
  title: string;
  children: ReactNode;
  className?: string;
}

const SubMenuWrapper = ({
  Icon,
  title,
  children,
  className,
}: SubMenuWrapperProps) => {
  const { setSelectedSubmenu } = useSubMenuStore();

  return (
    <div className="border border-gray-200">
      <div
        className={cn(
          'h-full w-100 overflow-hidden overflow-y-auto rounded-2xl bg-white transition-all duration-500 ease-in-out',
          className,
        )}
      >
        <div className="flex h-full flex-col rounded-2xl p-6">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between">
              <Icon size={30} className="text-rhino-500" />
              <ArrowRightToLine
                size={25}
                className="hover:text-rhino-500 cursor-pointer"
                onClick={() => setSelectedSubmenu('')}
              />
            </div>
            <h1 className="text-xl font-bold">{title}</h1>
            <div className="h-full">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubMenuWrapper;
