/**
 * @param {number} prevMs Текущий интервал (или прошлый backoff)
 * @param {'success'|'failure'} outcome Результат последнего запроса
 * @param {number} baseMs Базовый interval (атрибут `interval`)
 * @param {number} [maxMs=60000] Потолок
 */
export function computeNextBackoff(prevMs, outcome, baseMs, maxMs = 60000) {
  const prev = Math.max(0 | prevMs, 0 | baseMs);
  if (outcome === 'success') return baseMs;
  return Math.min(Math.max(prev, baseMs) * 2, maxMs);
}
