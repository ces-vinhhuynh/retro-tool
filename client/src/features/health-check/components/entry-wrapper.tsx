import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils/cn';

export const EntryWrapper = ({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <Card
    className={cn(
      'relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg',
      className,
    )}
  >
    <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent" />
    <CardContent className="space-y-6 p-3 sm:space-y-8 sm:p-4 md:p-6">
      <div className="space-y-3 sm:space-y-4">
        <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 sm:text-base">
          {title}
        </h2>
        {children}
      </div>
    </CardContent>
  </Card>
);
