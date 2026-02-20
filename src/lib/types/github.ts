export interface Repo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    language: string | null;
    fork: boolean;
    archived: boolean;
    topics: string[];
    owner: {
        login: string;
        avatar_url: string;
    };
    isVerified?: boolean;
}


export interface GitHubUser {
    id: number;
    login: string;
    avatar_url: string;
    name: string | null;
}

export interface Session {
    user: GitHubUser;
    accessToken: string;
}

export interface ClientSession {
    user: GitHubUser;
}
