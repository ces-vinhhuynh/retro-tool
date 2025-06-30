'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const TeamPage = () => {
  const { id: teamId } = useParams<{ id: string }>();
  const router = useRouter();

  // Redirect to dashboard page
  useEffect(() => {
    if (teamId) {
      router.replace(`/teams/${teamId}/dashboard`);
    }
  }, [teamId, router]);

  return null; // Component will redirect, no UI needed
};

export default TeamPage;
