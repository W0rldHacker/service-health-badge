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

export class ServiceHealthBadge extends HTMLElement {
  constructor();
  get focusable(): boolean;
  set focusable(v: boolean);

  get endpoint(): string | null;
  set endpoint(v: string | null);

  get interval(): number;
  set interval(v: number);

  get timeout(): number;
  set timeout(v: number);

  get labels(): Labels;
  set labels(v: Labels);

  get variant(): Variant;
  set variant(v: Variant);

  get showLatency(): boolean;
  set showLatency(v: boolean);

  get degradedThresholdMs(): number;
  set degradedThresholdMs(v: number);

  setState(status: HealthStatus, latencyMs?: number | null): void;
  refresh(): Promise<boolean>;
}

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
