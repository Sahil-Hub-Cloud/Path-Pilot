import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Lazy-initialize Redis and Ratelimit only when env vars are available
// This prevents build-time crashes when UPSTASH env vars are not set
let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
    if (ratelimit) return ratelimit;

    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        return null;
    }

    try {
        ratelimit = new Ratelimit({
            redis: new Redis({
                url: process.env.UPSTASH_REDIS_REST_URL,
                token: process.env.UPSTASH_REDIS_REST_TOKEN,
            }),
            limiter: Ratelimit.slidingWindow(30, "1 h"),
            analytics: true,
            prefix: "@upstash/ratelimit",
        });
        return ratelimit;
    } catch (e) {
        console.warn("Failed to initialize Upstash Redis:", e);
        return null;
    }
}

export async function checkRateLimit(identifier: string) {
    const limiter = getRatelimit();

    // If Redis is not configured, allow everything (fail-safe for dev)
    if (!limiter) {
        console.warn("Upstash Redis environment variables missing. Rate limiting disabled.");
        return { success: true, remaining: 30, reset: Date.now() };
    }

    const { success, remaining, reset } = await limiter.limit(identifier);
    return { success, remaining, reset };
}
