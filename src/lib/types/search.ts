import type { Repo } from "./github";

export interface SearchResult {
    repos: Repo[];
    error?: string;
}