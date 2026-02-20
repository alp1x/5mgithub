<script lang="ts">
    import { Separator } from "bits-ui";
    import {
        Header,
        SearchBar,
        QuickTags,
        ResultsGrid,
        Footer,
    } from "$lib/components";
    import { QUICK_TAGS } from "$lib/constants";
    import type { Repo } from "$lib/types";

    let searchQuery = $state("");
    let repos = $state<Repo[]>([]);
    let loading = $state(false);
    let searched = $state(false);
    let rateLimited = $state(false);
    let abortController: AbortController | null = null;

    async function handleSearch(query: string) {
        if (!query.trim()) {
            abortController?.abort();
            abortController = null;
            repos = [];
            searched = false;
            rateLimited = false;
            loading = false;
            return;
        }

        abortController?.abort();
        abortController = new AbortController();
        const signal = abortController.signal;

        loading = true;
        searched = true;
        rateLimited = false;

        try {
            const response = await fetch("/api/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
                signal,
            });

            const data = await response.json();

            if (signal.aborted) return;

            if (data.error === "rate_limit") {
                rateLimited = true;
                repos = [];
            } else {
                repos = data.repos || [];
            }
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                return;
            }
            console.error("Search error:", error);
            repos = [];
        } finally {
            if (!signal.aborted) {
                loading = false;
            }
        }
    }

    function handleTagClick(tag: string) {
        searchQuery = tag;
        handleSearch(tag);
    }
</script>

<div class="min-h-screen bg-zinc-950 flex flex-col">
    <div
        class="flex flex-col items-center justify-center px-4 transition-all duration-300"
        class:flex-1={!searched}
        class:py-10={searched}
    >
        <Header {searched} />
        <SearchBar bind:value={searchQuery} {loading} onSearch={handleSearch} />
        <QuickTags tags={QUICK_TAGS} onTagClick={handleTagClick} />

        {#if loading}
            <span class="mt-4 text-zinc-500 text-sm">
                Hmm, <b>{searchQuery}</b> seems to be a new word, so filtering it
                might take a while. Please be patient.
            </span>
        {/if}
    </div>

    {#if searched}
        <Separator.Root class="w-full h-px bg-zinc-800/50" />
    {/if}

    {#if searched}
        <ResultsGrid {repos} {loading} {rateLimited} />
    {/if}

    <Footer />
</div>
