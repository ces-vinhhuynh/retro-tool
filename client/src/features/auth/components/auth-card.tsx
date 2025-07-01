import Image from 'next/image';

import logo from '@/assets/images/logo.png';
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
    <div className="sm:bg-background flex min-h-screen items-center justify-center bg-white p-4">
      <Card className="flex w-full max-w-md flex-col gap-8 border-none shadow-none sm:gap-3 sm:border sm:shadow">
        <CardHeader className="space-y-3">
          <Image
            src={logo}
            alt="logo"
            width={200}
            height={200}
            className="mx-auto"
          />

          <CardTitle className="text-primary-text text-center text-xl font-bold uppercase">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-secondary-text text-center">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        {children}
      </Card>
    </div>
  );
}
