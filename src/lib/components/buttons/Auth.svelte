<script lang="ts">
    import { Button } from "bits-ui";
    import { Github, Zap, LogOut } from "lucide-svelte";
    import type { ClientSession } from "$lib/types";

    interface Props {
        session: ClientSession | null;
    }

    let { session }: Props = $props();
</script>

{#if session}
    <div
        class="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-sm rounded-lg pl-2 pr-1 py-1 border border-zinc-800"
    >
        <div class="flex items-center gap-2">
            <Zap class="w-4 h-4 text-green-500" />
            <span class="text-xs text-green-500 font-medium">3x</span>
        </div>
        <div class="w-px h-4 bg-zinc-700"></div>
        <img
            src={session.user.avatar_url}
            alt={session.user.login}
            class="w-6 h-6 rounded-full"
        />
        <span class="text-sm text-zinc-300">{session.user.login}</span>
        <Button.Root
            href="/api/auth/logout"
            class="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors"
        >
            <LogOut class="w-4 h-4 text-zinc-400" />
        </Button.Root>
    </div>
{:else}
    <Button.Root
        href="/api/auth/login"
        class="flex items-center justify-center gap-2 bg-zinc-900/80 backdrop-blur-sm hover:bg-zinc-800 rounded-lg px-3 py-1.5 border border-zinc-800 transition-colors group"
    >
        <Github
            class="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors"
        />
        <span
            class="text-sm text-zinc-400 group-hover:text-white transition-colors"
        >
            Login
        </span>
        <div class="flex items-center gap-1 text-xs text-purple-400">
            <Zap class="w-3 h-3" />
            <span>3x</span>
        </div>
    </Button.Root>
{/if}
