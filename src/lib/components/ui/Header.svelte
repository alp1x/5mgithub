<script lang="ts">
    import { Github } from "lucide-svelte";

    interface Props {
        searched: boolean;
    }

    let { searched }: Props = $props();
</script>

<div class="flex items-center gap-2 mb-3 text-center justify-center">
    <div
        class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center"
    >
        <Github class="w-6 h-6 text-zinc-900" strokeWidth={2.5} />
    </div>
    <h1 class="text-2xl font-bold font-sans text-white/90">5MGitHub</h1>
</div>

{#if !searched}
    <p class="max-sm:hidden text-zinc-600 text-xs mb-5 text-center max-w-1xl">
        This platform serves as a search and filtering utility for open-source
        FiveM scripts hosted on GitHub.
    </p>
{/if}
