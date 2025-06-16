import { ReactNode } from 'react';

interface SectionWrapperProps {
  title: string;
  children: ReactNode;
}

export const SectionWrapper = ({ title, children }: SectionWrapperProps) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-xl font-bold text-[#222] sm:text-[1.35rem]">
        {title}
      </h2>
      <div className="flex flex-col">{children}</div>
    </div>
  );
};
