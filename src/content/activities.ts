import type { ActivityKind } from './types';

export const activityNames: Record<ActivityKind, string> = {
  sequence: 'Procedural sequencing',
  errors: 'Error recognition',
  quiz: 'Knowledge check',
};
