import { writable } from 'svelte/store';
import type { Repo } from '$lib/types';

function createPinnedReposStore() {
    const { subscribe, set, update } = writable<Repo[]>([]);

    // Load from localStorage on initialization
    function load() {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('pinnedRepos');
            if (stored) {
                try {
                    set(JSON.parse(stored));
                } catch {
                    set([]);
                }
            }
        }
    }

    // Save to localStorage
    function save(repos: Repo[]) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('pinnedRepos', JSON.stringify(repos));
        }
    }

    return {
        subscribe,
        load,
        pin: (repo: Repo) => {
            update(repos => {
                if (repos.some(r => r.id === repo.id)) {
                    return repos;
                }
                const newRepos = [...repos, repo];
                save(newRepos);
                return newRepos;
            });
        },
        unpin: (repoId: number) => {
            update(repos => {
                const newRepos = repos.filter(r => r.id !== repoId);
                save(newRepos);
                return newRepos;
            });
        },
        toggle: (repo: Repo) => {
            update(repos => {
                const isPinned = repos.some(r => r.id === repo.id);
                let newRepos: Repo[];
                if (isPinned) {
                    newRepos = repos.filter(r => r.id !== repo.id);
                } else {
                    newRepos = [...repos, repo];
                }
                save(newRepos);
                return newRepos;
            });
        },
        isPinned: (repoId: number, repos: Repo[]) => {
            return repos.some(r => r.id === repoId);
        }
    };
}

export const pinnedRepos = createPinnedReposStore();
