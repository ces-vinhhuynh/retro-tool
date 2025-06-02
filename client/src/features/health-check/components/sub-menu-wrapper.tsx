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
    <div
      className={cn(
        'absolute top-0 right-[100%] h-screen w-[300px] overflow-hidden border border-gray-200 bg-white transition-all duration-500 ease-in-out xl:w-[400px]',
        className,
      )}
    >
      <div className="flex h-full flex-col p-6">
        <div className="flex h-full flex-col gap-2">
          <div className="flex items-center justify-between">
            <Icon size={30} className="text-ces-orange-500" />
            <ArrowRightToLine
              size={25}
              className="hover:text-ces-orange-500 cursor-pointer"
              onClick={() => setSelectedSubmenu('')}
            />
          </div>
          <h1 className="text-xl font-bold">{title}</h1>
          <div className="h-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default SubMenuWrapper;
