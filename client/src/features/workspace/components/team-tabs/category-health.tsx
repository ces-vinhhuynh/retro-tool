'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ScrumHealthCheck from '@/features/health-check/components/scrum-health-check';
import {
  HealthCheck,
  HealthCheckWithTemplate,
} from '@/features/health-check/types/health-check';
import { cn } from '@/lib/utils';

interface CategoryHealthProps {
  healthChecks: HealthCheck[];
}

const CategoryHealth = ({ healthChecks }: CategoryHealthProps) => {
  return (
    <Card className="w-full">
      <CardHeader className={cn("px-3 py-4 md:px-6 md:py-6")}>
        <CardTitle className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-xl md:text-2xl font-semibold text-transparent">
          Category Health
        </CardTitle>
      </CardHeader>
      <CardContent className="px-1 pt-2 md:px-6 md:pt-4">
        {healthChecks?.length > 0 ? (
          <ScrumHealthCheck
            scrumHealthChecks={healthChecks as HealthCheckWithTemplate[]}
            isShowAddNew={false}
            isShowTitle={false}
          />
        ) : (
          <div className="flex h-[200px] w-full items-center justify-center text-center">
            <p className="text-muted-foreground text-sm md:text-base">
              No health check data available for this category
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryHealth;