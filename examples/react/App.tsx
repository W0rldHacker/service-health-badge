import React from 'react';
import { HealthBadge } from './HealthBadge';

export default function App() {
  const [endpoint, setEndpoint] = React.useState(
    'http://localhost:8080/health?status=ok&latency=60'
  );
  return (
    <div style={{ padding: 16 }}>
      <h3>React demo</h3>
      <input
        value={endpoint}
        onChange={(e) => setEndpoint(e.target.value)}
        style={{ width: 480 }}
      />
      <div style={{ marginTop: 12 }}>
        <HealthBadge endpoint={endpoint} variant="badge" degradedThresholdMs={150} />
      </div>
    </div>
  );
}
