import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AuthCard({ children, title, description }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F7F7] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold text-[#E15D2F] uppercase">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-center text-[#555555]">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        {children}
      </Card>
    </div>
  );
}
