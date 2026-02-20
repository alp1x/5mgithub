<script lang="ts">
    import { Star } from "lucide-svelte";
    import type { Repo } from "$lib/types";
    import RepoCard from "./RepoCard.svelte";
    import LoadingSkeleton from "../ui/LoadingSkeleton.svelte";
    import EmptyState from "../ui/EmptyState.svelte";

    interface Props {
        repos: Repo[];
        loading: boolean;
        rateLimited?: boolean;
    }

    let { repos, loading, rateLimited = false }: Props = $props();
</script>

<div class="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
    {#if loading}
        <LoadingSkeleton />
    {:else if repos.length === 0}
        <EmptyState {rateLimited} />
    {:else}
        <div class="flex items-center justify-between mb-6">
            <p class="text-zinc-400 text-sm">
                <b>{repos.length}</b> scripts found
            </p>
            <div class="flex items-center gap-2 text-xs text-zinc-500">
                <Star class="w-4 h-4 fill-current" />
                Sorted by stars
            </div>
        </div>

        <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {#each repos as repo (repo.id)}
                <RepoCard {repo} />
            {/each}
        </div>
    {/if}
</div>
