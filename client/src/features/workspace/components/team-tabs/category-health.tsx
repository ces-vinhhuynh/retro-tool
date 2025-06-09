'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ScrumHealthCheck from '@/features/health-check/components/scrum-health-check';
import {
  HealthCheck,
  HealthCheckWithTemplate,
} from '@/features/health-check/types/health-check';

interface CategoryHealthProps {
  healthChecks: HealthCheck[];
}

const CategoryHealth = ({ healthChecks }: CategoryHealthProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-2xl font-semibold text-transparent">
          Category Health
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {healthChecks?.length > 0 ? (
          <ScrumHealthCheck
            scrumHealthChecks={healthChecks as HealthCheckWithTemplate[]}
            isShowAddNew={false}
            isShowTitle={false}
          />
        ) : (
          <div className="flex h-[200px] w-full items-center justify-center text-center">
            <p className="text-muted-foreground">
              No health check data available for this category
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryHealth;
