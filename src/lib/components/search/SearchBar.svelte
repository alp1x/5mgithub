<script lang="ts">
    import { Search, Loader2 } from "lucide-svelte";

    interface Props {
        value: string;
        loading: boolean;
        onSearch: (query: string) => void;
    }

    let { value = $bindable(), loading, onSearch }: Props = $props();
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const MIN_SEARCH_LENGTH = 3;

    function handleInput() {
        if (debounceTimer) clearTimeout(debounceTimer);

        if (
            value.trim().length > 0 &&
            value.trim().length < MIN_SEARCH_LENGTH
        ) {
            return;
        }

        debounceTimer = setTimeout(() => {
            onSearch(value);
        }, 400);
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            if (debounceTimer) clearTimeout(debounceTimer);
            if (
                value.trim().length >= MIN_SEARCH_LENGTH ||
                value.trim().length === 0
            ) {
                onSearch(value);
            }
        }
    }
</script>

<div class="w-full max-w-xl">
    <div class="relative">
        <Search
            class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 z-10 pointer-events-none"
        />
        <input
            type="text"
            name="query"
            bind:value
            oninput={handleInput}
            onkeydown={handleKeydown}
            placeholder="Search for scripts... (e.g., garage, hud, inventory)"
            class="w-full h-12 pl-12 pr-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:bg-zinc-900/80 focus:ring-1 focus:ring-zinc-900/90 transition-all backdrop-blur-sm relative"
        />
        {#if loading}
            <div class="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 class="animate-spin h-5 w-5 text-amber-600" />
            </div>
        {/if}
    </div>
</div>
