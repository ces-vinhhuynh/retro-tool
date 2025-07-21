import { useRouter } from 'next/navigation';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HealthCheckCardProps {
  healthCheck: {
    id: string;
    title: string;
    description?: string | null;
    created_at?: string | null;
    status?: string | null;
  };
}

export const HealthCheckCard = ({ healthCheck }: HealthCheckCardProps) => {
  const router = useRouter();

  const getStatusText = () => {
    return healthCheck.status?.replace('_', ' ') || 'in progress';
  };

  const getFormattedDate = () => {
    return healthCheck.created_at
      ? new Date(healthCheck.created_at).toLocaleDateString()
      : 'Unknown date';
  };

  const statusClassName = cn(
    'text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800',
    {
      'bg-green-100 text-green-800': healthCheck.status === 'done',
    },
  );

  return (
    <Card
      key={healthCheck.id}
      className="hover:border-primary cursor-pointer transition-colors"
      onClick={() => router.push(`/health-checks/${healthCheck.id}`)}
    >
      <CardHeader>
        <CardTitle className="text-lg">{healthCheck.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {healthCheck.description && (
          <p className="text-muted-foreground text-sm">
            {healthCheck.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-muted-foreground text-xs">{getFormattedDate()}</p>
        <span className={statusClassName}>{getStatusText()}</span>
      </CardFooter>
    </Card>
  );
};
