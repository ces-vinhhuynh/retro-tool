import { CardContent } from '@/components/ui/card';
import { AuthCard } from '@/features/auth/components/auth-card';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthCard title="Error" description="Sorry, something went wrong.">
      <CardContent>
        {params?.error ? (
          <p className="text-muted-foreground text-sm">
            Code error: {params.error}
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            An unspecified error occurred.
          </p>
        )}
      </CardContent>
    </AuthCard>
  );
}
