import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { searchGithubRepos, RateLimitError } from '$lib/server';

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const { query } = await request.json();

        if (!query?.trim()) {
            return json({ repos: [] });
        }

        const token = locals.session?.accessToken;
        const repos = await searchGithubRepos(query, token);
        return json({ repos });
    } catch (error) {
        console.error('Search API error:', error);

        if (error instanceof RateLimitError) {
            return json({ repos: [], error: 'rate_limit' });
        }

        return json({ repos: [], error: 'Search failed' });
    }
};
