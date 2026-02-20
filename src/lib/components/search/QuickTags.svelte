<script lang="ts">
    interface Props {
        tags: string[];
        onTagClick: (tag: string) => void;
    }

    let { tags, onTagClick }: Props = $props();
</script>

<div class="flex flex-wrap gap-2 mt-4 justify-center">
    {#each tags as tag}
        <button
            onclick={() => onTagClick(tag)}
            class="px-3 py-1.5 rounded-md bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-400 hover:text-white text-xs font-medium transition-all border border-zinc-700/50 hover:bg-zinc-700/50"
        >
            #{tag}
        </button>
    {/each}
</div>
