<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each [1, 2, 3, 4, 5, 6] as _}
        <div
            class="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50 animate-pulse"
        >
            <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-full bg-zinc-800"></div>
                <div class="flex-1">
                    <div class="h-4 bg-zinc-800 rounded w-3/4 mb-2"></div>
                    <div class="h-3 bg-zinc-800 rounded w-1/2"></div>
                </div>
            </div>
            <div class="h-3 bg-zinc-800 rounded w-full mb-2"></div>
            <div class="h-3 bg-zinc-800 rounded w-2/3"></div>
        </div>
    {/each}
</div>
