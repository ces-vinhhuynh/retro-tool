import { Card, CardContent } from '@/components/ui/card';

const EntryWrapper = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
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

export default EntryWrapper;
