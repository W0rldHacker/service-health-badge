export type HealthStatus = 'unknown' | 'ok' | 'degraded' | 'down' | 'offline';
export interface HealthChangeDetail {
  status: HealthStatus;
  latencyMs: number | null;
  at: string;
}
export interface HealthErrorDetail {
  error: string;
}
export type Variant = 'dot' | 'chip' | 'badge';
export interface Labels {
  ok?: string;
  degraded?: string;
  down?: string;
  unknown?: string;
  offline?: string;
}

export type { ServiceHealthBadge } from './index.js';

declare global {
  interface HTMLElementTagNameMap {
    'service-health-badge': ServiceHealthBadge;
  }
  interface HTMLElementEventMap {
    'health-change': CustomEvent<HealthChangeDetail>;
    'health-error': CustomEvent<HealthErrorDetail>;
  }
}

export {};
