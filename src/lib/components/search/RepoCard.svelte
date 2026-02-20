<script lang="ts">
    import { Avatar } from "bits-ui";
    import { Star, BadgeCheck, BookLock, Pin } from "lucide-svelte";
    import type { Repo } from "$lib/types";
    import {
        VERIFIED_FRAMEWORKS,
        VERIFIED_USERS,
        VERIFIED_ORGS,
    } from "$lib/constants";
    import { pinnedRepos } from "$lib/stores";

    interface Props {
        repo: Repo;
    }

    let { repo }: Props = $props();

    let isPinned = $state(false);

    pinnedRepos.subscribe((repos) => {
        isPinned = repos.some((r) => r.id === repo.id);
    });

    function handlePin(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        pinnedRepos.toggle(repo);
    }

    function formatStars(count: number): string {
        if (count >= 1000) {
            return (count / 1000).toFixed(1) + "k";
        }
        return count.toString();
    }

    const verifiedSet = new Set([
        ...VERIFIED_FRAMEWORKS.map((s) => s.toLowerCase()),
        ...VERIFIED_USERS.map((s) => s.toLowerCase()),
        ...VERIFIED_ORGS.map((s) => s.toLowerCase()),
    ]);

    const isVerified = $derived(
        repo.isVerified ?? verifiedSet.has(repo.owner.login.toLowerCase()),
    );
</script>

<a
    href={repo.html_url}
    target="_blank"
    rel="noopener noreferrer"
    class="group relative p-4 rounded-lg bg-zinc-900/30 border border-zinc-800/50 hover:border-purple-500/40 hover:bg-zinc-800/30 transition-all duration-200"
>
    <button
        onclick={handlePin}
        class="absolute -top-2 -right-2 p-1.5 rounded-md transition-all z-10 {isPinned
            ? 'bg-red-400/20 text-red-400'
            : 'bg-zinc-800/80 text-zinc-500 hover:bg-red-400/20 hover:text-red-400 opacity-0 group-hover:opacity-100'}"
        title={isPinned ? "Unpin repository" : "Pin repository"}
    >
        <Pin class="w-3.5 h-3.5" />
    </button>
    <div class="flex items-start gap-3 mb-3">
        <Avatar.Root
            class="w-9 h-9 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0"
        >
            <Avatar.Image
                src={repo.owner.avatar_url}
                alt={repo.owner.login}
                class="w-full h-full object-cover"
            />
            <Avatar.Fallback
                class="w-full h-full flex items-center justify-center text-xs text-zinc-500 uppercase"
            >
                {repo.owner.login.slice(0, 2)}
            </Avatar.Fallback>
        </Avatar.Root>
        <div class="flex-1 min-w-0">
            <h3
                class="font-medium text-white group-hover:text-purple-400 transition-colors truncate text-sm"
            >
                {repo.name}
            </h3>
            <p class="text-xs text-zinc-500 truncate flex items-center gap-1">
                {repo.owner.login}
                {#if isVerified}
                    <BadgeCheck
                        class="w-3.5 h-3.5 text-blue-500 flex-shrink-0"
                    />
                {/if}
            </p>
        </div>
        <div class="flex items-center gap-2">
            {#if repo.archived}
                <div
                    class="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/10 text-amber-500"
                >
                    <BookLock class="w-3.5 h-3.5" />
                    <span class="text-xs font-medium">Archived</span>
                </div>
            {/if}
            <div
                class="flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-500"
            >
                <Star class="w-3.5 h-3.5 fill-current" />
                <span class="text-xs font-medium"
                    >{formatStars(repo.stargazers_count)}</span
                >
            </div>
        </div>
    </div>
    {#if repo.description}
        <p class="text-xs text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
            {repo.description}
        </p>
    {/if}
    {#if repo.topics && repo.topics.length > 0}
        <div class="flex flex-wrap gap-1">
            {#each repo.topics.slice(0, 3) as topic}
                <span
                    class="px-2 py-0.5 rounded-md bg-zinc-800/50 text-zinc-500 text-[10px] font-medium"
                >
                    {topic}
                </span>
            {/each}
            {#if repo.topics.length > 3}
                <span
                    class="px-2 py-0.5 rounded-md bg-zinc-800/50 text-zinc-500 text-[10px] font-medium"
                >
                    +{repo.topics.length - 3}
                </span>
            {/if}
        </div>
    {/if}
</a>
