import { ArrowRightToLine } from 'lucide-react';
import React, { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { useSubMenuStore } from '../stores/sub-menu-store';

interface SubMenuWrapperProps {
  Icon: React.ComponentType<{ size: number; className?: string }>;
  title: string;
  children: ReactNode;
  isOpen: boolean;
  className?: string;
}

const SubMenuWrapper = ({
  Icon,
  title,
  children,
  isOpen,
  className,
}: SubMenuWrapperProps) => {
  const { setSelectedSubmenu } = useSubMenuStore();

  return (
    <div className="fixed top-20 right-24 border border-gray-200">
      <div
        className={cn(
          'sticky top-0 h-[85vh] overflow-hidden rounded-2xl bg-white transition-all duration-500 ease-in-out',
          isOpen ? 'right-0 w-100' : 'right-80 w-0',
          className,
        )}
      >
        <div className="flex h-full flex-col rounded-2xl p-6">
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
            <div className="h-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubMenuWrapper;
