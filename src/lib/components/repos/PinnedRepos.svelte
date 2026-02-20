<script lang="ts">
    import { pinnedRepos } from "$lib/stores";
    import RepoCard from "../search/RepoCard.svelte";
    import { Pin, X } from "lucide-svelte";
    import type { Repo } from "$lib/types";

    interface Props {
        isOpen: boolean;
        onClose: () => void;
    }

    let { isOpen, onClose }: Props = $props();

    let repos = $state<Repo[]>([]);

    pinnedRepos.subscribe((value) => {
        repos = value;
    });
</script>

{#if isOpen}
    <div class="w-full max-w-4xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
                <Pin class="w-5 h-5 text-red-400" />
                <h2 class="text-lg font-semibold text-white">
                    Pinned Repositories
                </h2>
                <span class="text-sm text-zinc-500">({repos.length})</span>
            </div>
            <button
                onclick={onClose}
                class="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
                <X class="w-5 h-5 text-zinc-400" />
            </button>
        </div>

        {#if repos.length === 0}
            <div
                class="flex flex-col items-center justify-center py-12 text-center"
            >
                <Pin class="w-12 h-12 text-zinc-700 mb-4" />
                <p class="text-zinc-500 text-sm">No pinned repositories yet</p>
                <p class="text-zinc-600 text-xs mt-1">
                    Click the pin icon on any repository to save it here
                </p>
            </div>
        {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {#each repos as repo (repo.id)}
                    <RepoCard {repo} />
                {/each}
            </div>
        {/if}
    </div>
{/if}
