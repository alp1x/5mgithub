import type { Repo } from '$lib/types';
import { FIVEM_KEYWORDS, BLACKLIST_KEYWORDS, BLACKLISTED_OWNERS, VALID_LANGUAGES, VERIFIED_FRAMEWORKS } from '$lib/constants';


export function getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
        Accept: "application/vnd.github.v3+json",
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return headers;
}


export async function checkReadme(owner: string, repo: string, token?: string): Promise<boolean> {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/readme`,
            {
                headers: getHeaders(token),
            }
        );

        if (!response.ok) return false;

        const data = await response.json();

        const content = Buffer.from(data.content, 'base64').toString('utf-8').toLowerCase();

        return FIVEM_KEYWORDS.some(keyword => content.includes(keyword));
    } catch {
        return false;
    }
}


export function hasValidTopics(topics: string[]): boolean {
    const lowerTopics = topics.map(t => t.toLowerCase());
    return FIVEM_KEYWORDS.some(keyword =>
        lowerTopics.some(topic => topic.includes(keyword))
    );
}

export function hasValidDescription(description: string | null): boolean {
    if (!description) return false;
    const desc = description.toLowerCase();

    if (BLACKLIST_KEYWORDS.some(keyword => desc.includes(keyword))) {
        return false;
    }

    return FIVEM_KEYWORDS.some(keyword => desc.includes(keyword));
}


export function hasValidName(name: string): boolean {
    const lowerName = name.toLowerCase();
    return FIVEM_KEYWORDS.some(keyword => lowerName.includes(keyword));
}


export function hasValidOwner(ownerLogin: string): boolean {
    const lowerOwner = ownerLogin.toLowerCase();
    return VERIFIED_FRAMEWORKS.some(org => lowerOwner.includes(org) || org.includes(lowerOwner));
}


export function isFromVerifiedFramework(repo: Repo): boolean {
    const owner = repo.owner.login.toLowerCase();

    if (repo.fork) {
        return false;
    }

    return VERIFIED_FRAMEWORKS.some(framework => owner === framework);
}

export function isRelevantToQuery(repo: Repo, query: string): boolean {
    const q = query.toLowerCase();
    const name = repo.name.toLowerCase();
    const description = (repo.description || "").toLowerCase();
    const topics = (repo.topics || []).map(t => t.toLowerCase());
    const owner = repo.owner.login.toLowerCase();

    const qNoSpace = q.replace(/[\s-_]/g, "");
    const nameNoSpace = name.replace(/[\s-_]/g, "");


    if (name.includes(q) || name.includes(qNoSpace) || nameNoSpace.includes(qNoSpace)) {
        return true;
    }


    if (owner.includes(q)) {
        return true;
    }


    if (description.includes(q) || description.includes(qNoSpace)) {
        return true;
    }


    if (topics.some(topic => topic.includes(q) || topic.includes(qNoSpace))) {
        return true;
    }

    return false;
}


export function isBlacklisted(repo: Repo): boolean {
    const desc = (repo.description || "").toLowerCase();
    const owner = repo.owner.login.toLowerCase();
    const name = repo.name.toLowerCase();

    if (BLACKLISTED_OWNERS.some(blocked => owner === blocked)) {
        return true;
    }

    return BLACKLIST_KEYWORDS.some(keyword =>
        desc.includes(keyword) || owner.includes(keyword) || name.includes(keyword)
    );
}

export function hasValidLanguage(language: string | null): boolean {
    if (language === null) return true;
    const lowerLang = language.toLowerCase();
    return VALID_LANGUAGES.some(valid => valid === null || valid === lowerLang);
}
