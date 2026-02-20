import type { Repo } from '$lib/types';
import { FRAMEWORKS, MIN_STARS, VERIFIED_FRAMEWORKS, VERIFIED_USERS, VERIFIED_ORGS } from '$lib/constants';
import { getFromCache, saveToCache } from './cache';
import {
    getHeaders,
    checkReadme,
    hasValidTopics,
    hasValidDescription,
    hasValidName,
    hasValidOwner,
    hasValidLanguage,
    isRelevantToQuery,
    isBlacklisted,
    isFromVerifiedFramework,
} from './validators';

export class RateLimitError extends Error {
    constructor(message = 'GitHub API rate limit exceeded') {
        super(message);
        this.name = 'RateLimitError';
    }
}

const GITHUB_SEARCH_API = 'https://api.github.com/search/repositories';

const ALL_VERIFIED_USERS = new Set(
    VERIFIED_USERS.map(s => s.toLowerCase())
);

const ALL_VERIFIED_ORGS = new Set([
    ...VERIFIED_FRAMEWORKS.map(s => s.toLowerCase()),
    ...VERIFIED_ORGS.map(s => s.toLowerCase()),
]);

function isFromVerifiedUser(repo: Repo): boolean {
    return ALL_VERIFIED_USERS.has(repo.owner.login.toLowerCase());
}

function isFromVerifiedOrg(repo: Repo): boolean {
    return ALL_VERIFIED_ORGS.has(repo.owner.login.toLowerCase());
}

function deduplicateRepos(repos: Repo[]): Repo[] {
    const seen = new Map<number, Repo>();
    for (const repo of repos) {
        if (!seen.has(repo.id)) {
            seen.set(repo.id, repo);
        }
    }
    return Array.from(seen.values());
}

function applyBaseFilters(repos: Repo[]): Repo[] {
    const result: Repo[] = [];
    for (const repo of repos) {
        if (
            repo.stargazers_count >= MIN_STARS &&
            !repo.fork &&
            hasValidLanguage(repo.language) &&
            !isBlacklisted(repo)
        ) {
            result.push(repo);
        }
    }
    return result;
}

async function parallelFetch(
    requests: Array<{ url: string; headers: HeadersInit }>
): Promise<Repo[]> {
    if (requests.length === 0) return [];

    const results = await Promise.allSettled(
        requests.map(async ({ url, headers }) => {
            const response = await fetch(url, { headers });

            if (response.status === 403 || response.status === 429) {
                throw new RateLimitError();
            }

            if (!response.ok) return [];

            const data = await response.json();
            return (data as { items?: Repo[] }).items || [];
        })
    );

    const repos: Repo[] = [];
    for (const result of results) {
        if (result.status === 'fulfilled') {
            repos.push(...result.value);
        } else if (result.reason instanceof RateLimitError) {
            throw result.reason;
        }
    }

    return repos;
}

function buildSearchUrl(query: string, perPage: number): string {
    return `${GITHUB_SEARCH_API}?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${perPage}`;
}

export async function searchGithubRepos(query: string, token?: string): Promise<Repo[]> {
    if (!query.trim()) {
        return [];
    }

    const trimmedQuery = query.trim();

    const cached = await getFromCache(trimmedQuery);
    if (cached) {
        return cached;
    }

    const headers = getHeaders(token);

    const searchTerms: string[] = [trimmedQuery];

    if (trimmedQuery.includes(' ')) {
        searchTerms.push(trimmedQuery.replace(/\s+/g, ''));
        searchTerms.push(trimmedQuery.replace(/\s+/g, '-'));
    } else if (trimmedQuery.includes('-')) {
        searchTerms.push(trimmedQuery.replace(/-/g, ''));
    }

    const frameworkRequests: Array<{ url: string; headers: HeadersInit }> = [];

    for (const q of searchTerms) {
        for (const framework of FRAMEWORKS) {
            frameworkRequests.push({
                url: buildSearchUrl(`${q} ${framework}`, 100),
                headers
            });
        }
    }

    const frameworkResults = await parallelFetch(frameworkRequests);

    const uniqueRepos = deduplicateRepos(frameworkResults);
    const filteredRepos = applyBaseFilters(uniqueRepos);

    const queryLower = trimmedQuery.toLowerCase();

    const relevantRepos: Repo[] = [];
    for (const repo of filteredRepos) {
        if (isRelevantToQuery(repo, queryLower)) {
            relevantRepos.push(repo);
        }
    }

    const verifiedOrgRepos: Repo[] = [];
    const verifiedUserRepos: Repo[] = [];
    const remainingRepos: Repo[] = [];

    for (const repo of relevantRepos) {
        if (isFromVerifiedFramework(repo) || isFromVerifiedOrg(repo)) {
            verifiedOrgRepos.push(repo);
        } else if (isFromVerifiedUser(repo)) {
            verifiedUserRepos.push(repo);
        } else {
            remainingRepos.push(repo);
        }
    }

    const validByTopics: Repo[] = [];
    const remainingAfterTopics: Repo[] = [];

    for (const repo of remainingRepos) {
        if (hasValidTopics(repo.topics || [])) {
            validByTopics.push(repo);
        } else {
            remainingAfterTopics.push(repo);
        }
    }

    const validByOwner: Repo[] = [];
    const remainingAfterOwner: Repo[] = [];

    for (const repo of remainingAfterTopics) {
        if (hasValidOwner(repo.owner.login)) {
            validByOwner.push(repo);
        } else {
            remainingAfterOwner.push(repo);
        }
    }

    const validByDescription: Repo[] = [];
    const remainingAfterDesc: Repo[] = [];

    for (const repo of remainingAfterOwner) {
        if (hasValidDescription(repo.description)) {
            validByDescription.push(repo);
        } else {
            remainingAfterDesc.push(repo);
        }
    }

    const validByName: Repo[] = [];
    const remainingForReadme: Repo[] = [];

    for (const repo of remainingAfterDesc) {
        if (hasValidName(repo.name)) {
            validByName.push(repo);
        } else {
            remainingForReadme.push(repo);
        }
    }

    const readmeCandidates = remainingForReadme
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 3);

    const readmeResults = await Promise.allSettled(
        readmeCandidates.map(async repo => {
            const isValid = await checkReadme(repo.owner.login, repo.name, token);
            return { repo, isValid };
        })
    );

    const validByReadme: Repo[] = [];
    for (const result of readmeResults) {
        if (result.status === 'fulfilled' && result.value.isValid) {
            validByReadme.push(result.value.repo);
        }
    }

    const allValidRepos = [
        ...verifiedOrgRepos,
        ...verifiedUserRepos,
        ...validByTopics,
        ...validByOwner,
        ...validByDescription,
        ...validByName,
        ...validByReadme,
    ];

    const sortedRepos = deduplicateRepos(allValidRepos)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 50);

    const finalRepos = sortedRepos.map(repo => ({
        ...repo,
        isVerified: isFromVerifiedFramework(repo) || isFromVerifiedOrg(repo) || isFromVerifiedUser(repo)
    }));

    await saveToCache(trimmedQuery, finalRepos);

    return finalRepos;
}
