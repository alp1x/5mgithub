<script lang="ts">
    import { Frown, Clock } from "lucide-svelte";

    interface Props {
        rateLimited?: boolean;
    }

    let { rateLimited = false }: Props = $props();
</script>

<div class="text-center py-16">
    <div
        class="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center"
    >
        {#if rateLimited}
            <Clock class="w-8 h-8 text-amber-500" />
        {:else}
            <Frown class="w-8 h-8 text-zinc-600" />
        {/if}
    </div>
    {#if rateLimited}
        <p class="text-amber-400 text-lg mb-2">Rate Limited</p>
        <p class="text-zinc-600 text-sm">
            GitHub API rate limit exceeded. Please try again in a few minutes.
        </p>
    {:else}
        <p class="text-zinc-400 text-lg mb-2">No Results</p>
        <p class="text-zinc-600 text-sm">
            No scripts found. Try different keywords.
        </p>
    {/if}
</div>
