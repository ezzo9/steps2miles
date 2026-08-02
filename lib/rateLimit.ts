const RATE_LIMIT = 100;
const WINDOW_MS = 60 * 60 * 1000;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

function sweepExpired(now: number) {
  buckets.forEach((bucket, key) => {
    if (now >= bucket.resetAt) buckets.delete(key);
  });
}

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();

  // Opportunistic cleanup so the map doesn't grow unbounded over a long
  // server lifetime. Fine for an in-memory, single-instance limiter.
  if (Math.random() < 0.01) sweepExpired(now);

  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    const resetAt = now + WINDOW_MS;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, limit: RATE_LIMIT, remaining: RATE_LIMIT - 1, resetAt };
  }

  if (bucket.count >= RATE_LIMIT) {
    return { allowed: false, limit: RATE_LIMIT, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return {
    allowed: true,
    limit: RATE_LIMIT,
    remaining: RATE_LIMIT - bucket.count,
    resetAt: bucket.resetAt,
  };
}
