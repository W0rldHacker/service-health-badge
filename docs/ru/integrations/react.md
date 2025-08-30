# Интеграция с React

[English version](../en/integrations/react.md)

Компонент — нативный Web Component, поэтому его можно использовать напрямую или через небольшую обёртку.

## Обёртка (TypeScript)

```tsx
import React from 'react';
import '@worldhacker/service-health-badge';

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
```

## Пример использования

```tsx
<HealthBadge endpoint="/health" variant="badge" degradedThresholdMs={150} />
```

См. готовый пример: `examples/react/`.
