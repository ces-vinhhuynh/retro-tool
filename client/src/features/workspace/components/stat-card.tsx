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
}

const StatCard = ({
  title,
  description,
  children,
  className,
  headerContent,
}: StatCardProps) => {
  return (
    <Card className={cn('rounded-xl border shadow-sm', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          {headerContent}
        </div>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </CardHeader>
      <CardContent className={cn(className)}>{children}</CardContent>
    </Card>
  );
};

export default StatCard;
