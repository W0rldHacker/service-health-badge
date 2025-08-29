import React from 'react';
import '../../dist/service-health-badge.js';

type Variant = 'dot' | 'chip' | 'badge';

type Props = React.HTMLAttributes<HTMLElement> & {
  endpoint: string;
  interval?: number;
  timeout?: number;
  labels?: Record<string, string>;
  variant?: Variant;
  showLatency?: boolean;
  degradedThresholdMs?: number;
  focusable?: boolean;
};

export function HealthBadge(props: Props) {
  return React.createElement('service-health-badge', props as any);
}
