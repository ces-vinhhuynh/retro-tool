import _groupBy from 'lodash.groupby';

import { HealthCheck } from '../types/health-check';
import { Template } from '../types/templates';

// Pure function to split health checks by template ID
export const splitHealthChecksByTemplateId = (
  templates: Template[],
  healthChecks: HealthCheck[],
): Record<string, HealthCheck[]> => {
  if (!templates || templates?.length === 0 || healthChecks?.length === 0) {
    return {};
  }
  // Get the set of valid template IDs
  const validTemplateIds = new Set(templates.map((template) => template.id));

  // Group health checks by template_id
  const grouped = _groupBy(healthChecks, 'template_id');

  // Filter grouped results to only include valid template IDs, defaulting to empty arrays
  const result: Record<string, HealthCheck[]> = {};
  for (const templateId of validTemplateIds) {
    result[templateId] = grouped[templateId] || [];
  }

  return result;
};
