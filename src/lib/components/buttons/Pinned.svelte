<script lang="ts">
    import { Pin } from "lucide-svelte";
    import { pinnedRepos } from "$lib/stores";

    interface Props {
        onPinnedClick?: () => void;
    }

    let { onPinnedClick }: Props = $props();

    let pinnedCount = $state(0);

    pinnedRepos.subscribe((repos) => {
        pinnedCount = repos.length;
    });
</script>

<button
    onclick={onPinnedClick}
    class="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-sm hover:bg-zinc-800 rounded-lg px-3 py-1.5 border border-zinc-800 transition-colors group"
>
    <Pin
        class="w-4 h-4 text-red-400 group-hover:text-white transition-colors"
    />
    <span
        class="text-sm text-zinc-400 group-hover:text-white transition-colors hidden sm:inline"
    >
        Pinned
    </span>
    {#if pinnedCount > 0}
        <span
            class="text-xs bg-red-400/50 text-zinc-300 px-1.5 py-0.5 rounded-md font-medium"
        >
            {pinnedCount}
        </span>
    {/if}
</button>
