<script lang="ts">
    import { Button } from "bits-ui";
    import { Coffee } from "lucide-svelte";

    const KOFI_URL = "https://ko-fi.com/qbox";
</script>

<Button.Root
    href={KOFI_URL}
    target="_blank"
    class="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-sm hover:bg-zinc-800 rounded-lg px-3 py-1.5 border border-zinc-800 transition-colors group"
>
    <Coffee
        class="w-4 h-4 text-amber-500 group-hover:text-white transition-colors"
    />
    <span
        class="text-sm text-zinc-400 group-hover:text-white transition-colors hidden sm:inline"
    >
        Coffee
    </span>
</Button.Root>
