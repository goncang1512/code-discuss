<script lang="ts">
	import CardQuestion from '@components/template/CardQuestion.svelte';
	import type { PageProps } from './$types';
	import { Button } from 'flowbite-svelte';
	import { Search } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { writable, derived } from 'svelte/store';
	import LayoutDiv from '@components/template/LayoutDiv.svelte';

	let { data }: PageProps = $props();
	const searchQuery = writable('');

	// Ambil query dari URL dan pastikan tampilan input tetap menggunakan #
	const urlQuery = derived(page, ($page) => {
		const params = new URLSearchParams($page.url?.search || '');
		let query = params.get('v') || '';

		// Pastikan ":" tetap ada di URL
		query = query.replace('%3A', ':');

		// Jika query adalah "tag:", tampilkan sebagai "#"
		return query.startsWith('tag:') ? `#${query.slice(4)}` : query;
	});

	// Pastikan input selalu sesuai dengan nilai yang diformat dari URL
	urlQuery.subscribe((value) => {
		searchQuery.set(value);
	});

	function handleSearch(event: Event) {
		event.preventDefault();
		const params = new URLSearchParams($page.url?.search || '');

		searchQuery.update((queryValue) => {
			queryValue = queryValue.trim();

			let urlValue = queryValue;

			// Jika input dimulai dengan "#", ubah ke "tag:"
			if (queryValue.startsWith('#')) {
				urlValue = `tag:${queryValue.slice(1)}`;
			}

			// Update URL tanpa mengubah nilai input
			if (urlValue) {
				params.set('v', urlValue);
			} else {
				params.delete('v');
			}

			// Gunakan replace agar ":" tetap ada di URL
			goto(`?${params.toString().replace('%3A', ':')}`);

			// Kembalikan nilai yang benar untuk input agar tetap "#"
			return queryValue.startsWith('tag:') ? `#${queryValue.slice(4)}` : queryValue;
		});
	}
</script>

<div class="flex w-full">
	<LayoutDiv>
		<form onsubmit={handleSearch} class="flex w-full items-center gap-3 p-3">
			<input
				bind:value={$searchQuery}
				class="peer block w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-zinc-600 focus:ring-zinc-600"
				placeholder="search..."
			/>
			<Button color="dark" type="submit"><Search /></Button>
		</form>
		<div>
			{#each data.results as item (item.id)}
				<CardQuestion question={item} />
			{/each}
		</div>
	</LayoutDiv>
</div>
