import { HealthCheck } from '../types/health-check';
import { Template } from '../types/templates';

export const sortTemplatesByLatestHealthCheck = (
  templates: Template[],
  healthChecks: HealthCheck[],
): Template[] => {
  const getLatestHealthCheckDate = (templateId: string): string | null => {
    return healthChecks
      .filter((hc) => hc.template_id === templateId)
      .reduce<string | null>((latest, hc) => {
        if (!hc.created_at) return latest;
        return !latest || hc.created_at > latest ? hc.created_at : latest;
      }, null);
  };

  return [...templates].sort((a, b) => {
    const aLatest = getLatestHealthCheckDate(a.id);
    const bLatest = getLatestHealthCheckDate(b.id);
    if (aLatest === bLatest) return 0;
    if (!aLatest) return 1;
    if (!bLatest) return -1;
    return aLatest > bLatest ? -1 : 1;
  });
};
