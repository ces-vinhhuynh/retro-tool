'use client';

import { ReactNode } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerContent?: ReactNode;
  isMobile?: boolean;
}

export const StatCard = ({
  title,
  description,
  children,
  className,
  headerContent,
}: StatCardProps) => {
  return (
    <Card
      className={cn('rounded-md border shadow-sm md:rounded-xl', className)}
    >
      <CardHeader className="mr-4 ml-4 p-2 md:p-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          {headerContent}
        </div>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </CardHeader>
      <CardContent className={cn(className, 'mr-4 ml-4 p-2 md:p-3')}>
        {children}
      </CardContent>
    </Card>
  );
};
