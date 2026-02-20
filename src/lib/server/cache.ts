import { Redis } from '@upstash/redis';
import { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } from '$env/static/private';
import type { Repo } from '$lib/types';
import { QUICK_TAGS } from '$lib/constants';

const redis = new Redis({
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN,
});

const CACHE_TTL_SECONDS = 60 * 60 * 24;
const POPULAR_CACHE_TTL = 60 * 60 * 24 * 3;
const MIN_QUERY_LENGTH = 3;
const CACHE_PREFIX = 'search:';

export async function getFromCache(query: string): Promise<Repo[] | null> {
    const key = CACHE_PREFIX + query.toLowerCase().trim();

    if (query.trim().length < MIN_QUERY_LENGTH) return null;

    try {
        const data = await redis.get<Repo[]>(key);
        return data;
    } catch (error) {
        console.error('[REDIS ERROR] getFromCache:', error);
        return null;
    }
}


export async function saveToCache(query: string, data: Repo[]): Promise<void> {
    const normalizedQuery = query.toLowerCase().trim();
    const key = CACHE_PREFIX + normalizedQuery;

    if (normalizedQuery.length < MIN_QUERY_LENGTH) return;

    if (data.length === 0) return;

    const isPopular = QUICK_TAGS.some(q => normalizedQuery === q || normalizedQuery.includes(q));
    const ttl = isPopular ? POPULAR_CACHE_TTL : CACHE_TTL_SECONDS;

    try {
        await redis.set(key, data, { ex: ttl });
    } catch (error) {
        console.error('[REDIS ERROR] saveToCache:', error);
    }
}