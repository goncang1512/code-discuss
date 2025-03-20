<script lang="ts">
	import CardQuestion from '@components/template/CardQuestion.svelte';
	import type { PageProps } from './$types';
	import { Button } from 'flowbite-svelte';
	import { Search } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data }: PageProps = $props();
	let searchQuery = $state('');
	let originalQuery = '';

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		originalQuery = params.get('v') || '';

		searchQuery = originalQuery.startsWith('tag:') ? originalQuery.slice(4) : originalQuery;
	});

	function handleSearch(event: Event) {
		event.preventDefault();
		const params = new URLSearchParams(window.location.search);
		let queryValue = searchQuery.trim();

		params.set('v', queryValue);

		if (!queryValue) {
			params.delete('v');
		}

		goto(`?${params.toString()}`);
	}
</script>

<div class="flex w-full">
	<div class="flex min-h-screen flex-1 flex-col border-r border-gray-200">
		<form onsubmit={handleSearch} class="flex w-full items-center gap-3 p-3">
			<input
				bind:value={searchQuery}
				class="peer block w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-zinc-600 focus:ring-zinc-600"
				placeholder="search..."
			/>
			<Button color="dark" type="submit"><Search /></Button>
		</form>
		<div>
			{#each data.results as item}
				<CardQuestion question={item} />
			{/each}
		</div>
	</div>
	<div class="w-[40%] flex-none"></div>
</div>
