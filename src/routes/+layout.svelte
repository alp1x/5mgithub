<script lang="ts">
	import "../app.css";
	import {
		AuthButton,
		PinnedRepos,
		PinnedButton,
		CoffeeButton,
	} from "$lib/components";
	import { page } from "$app/state";
	import { onMount } from "svelte";
	import { pinnedRepos } from "$lib/stores";

	let { children, data } = $props();

	let showPinned = $state(false);

	onMount(() => {
		pinnedRepos.load();
	});

	function togglePinned() {
		showPinned = !showPinned;
	}
</script>

<svelte:head>
	<link rel="canonical" href={page.url.href} />
	<meta property="og:url" content={page.url.href} />
	<meta name="twitter:url" content={page.url.href} />
</svelte:head>

<div class="fixed top-4 right-4 z-50 flex items-center gap-2 sm:fixed">
	<CoffeeButton />
	<PinnedButton onPinnedClick={togglePinned} />
	<AuthButton session={data.session} />
</div>

{#if showPinned}
	<div
		class="fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-sm overflow-y-auto pt-20"
	>
		<PinnedRepos isOpen={showPinned} onClose={togglePinned} />
	</div>
{/if}

{@render children()}
