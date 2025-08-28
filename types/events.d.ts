export type HealthStatus = 'unknown' | 'ok' | 'degraded' | 'down' | 'offline';

export interface HealthChangeDetail {
  status: HealthStatus;
  latencyMs: number | null;
  /** ISO8601 timestamp */
  at: string;
}

export interface HealthErrorDetail {
  error: string;
}

declare global {
  interface ServiceHealthBadge extends HTMLElement {}

  interface HTMLElementTagNameMap {
    'service-health-badge': ServiceHealthBadge;
  }

  interface GlobalEventHandlersEventMap {
    'health-change': CustomEvent<HealthChangeDetail>;
    'health-error': CustomEvent<HealthErrorDetail>;
  }
}

export {};
