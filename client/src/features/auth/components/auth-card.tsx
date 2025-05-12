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
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="gap-y-3">
          <Image
            src={logo}
            alt="logo"
            width={200}
            height={200}
            className="mx-auto"
          />

          <CardTitle className="text-ces-orange-500 text-center text-xl font-bold uppercase">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-secondary text-center">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        {children}
      </Card>
    </div>
  );
}
