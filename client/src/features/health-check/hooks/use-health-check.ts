'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import useUserStore from '@/stores/user-store';

import { healthCheckService } from '../api/health-check';
import {
  HealthCheck,
  HealthCheckInsert,
  HealthCheckUpdate,
} from '../types/health-check';

export function useHealthChecks() {
  return useQuery({
    queryKey: ['healthChecks'],
    queryFn: healthCheckService.getHealthChecks,
  });
}

export function useHealthCheck(id: string) {
  return useQuery({
    queryKey: ['healthCheck', id],
    queryFn: () => healthCheckService.getHealthCheck(id),
    enabled: !!id,
  });
}

export function useHealthCheckWithTemplate(id: string) {
  const getHealthCheck = async () => {
    const response = await healthCheckService.getWithTemplateById(id);

    return response;
  };

  return useQuery({
    queryKey: ['healthCheck', id],
    queryFn: getHealthCheck,
    enabled: !!id,
  });
}

export function useHealthCheckMutations() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: createHealthCheck, isPending: isCreating } = useMutation({
    mutationFn: (healthCheck: HealthCheckInsert) =>
      healthCheckService.create(healthCheck),
    onSuccess: (data: HealthCheck) => {
      queryClient.invalidateQueries({ queryKey: ['healthChecks'] });
      router.push(`/health-checks/${data.id}`);
    },
    onError: (error) => {
      // TODO: Handle show toast notification
      console.error('Error creating health check:', error);
    },
  });

  const { mutate: updateHealthCheck, isPending: isUpdating } = useMutation({
    mutationFn: ({
      id,
      healthCheck,
    }: {
      id: string;
      healthCheck: HealthCheckUpdate;
    }) => healthCheckService.update(id, healthCheck),
    onSuccess: (data: HealthCheck) => {
      queryClient.invalidateQueries({ queryKey: ['healthCheck', data.id] });
      queryClient.invalidateQueries({ queryKey: ['healthChecks'] });
      queryClient.invalidateQueries({
        queryKey: [
          'health-check-by-team-and-template',
          data.template_id,
          data.team_id,
        ],
      });
    },
    onError: (error) => {
      // TODO: Handle show toast notification
      console.error('Error updating health check:', error);
    },
  });

  const { mutate: deleteHealthCheck, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => healthCheckService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthChecks'] });
      router.push('/health-checks');
    },
    onError: (error) => {
      // TODO: Handle show toast notification
      console.error('Error deleting health check:', error);
    },
  });

  return {
    createHealthCheck,
    updateHealthCheck,
    deleteHealthCheck,
    isLoading: isCreating || isUpdating || isDeleting,
  };
}
