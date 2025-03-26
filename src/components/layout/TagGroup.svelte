<script lang="ts">
	import CardQuestion from '@components/template/CardQuestion.svelte';
	import { page } from '$app/stores';
	import { writable, derived } from 'svelte/store';
	import type { QuestionType } from '@lib/utils/types';

	let { question }: { question: QuestionType[] | undefined | null } = $props();

	const searchQuery = writable('');

	const urlQuery = derived(page, ($page) => {
		const params = new URLSearchParams($page.url?.search || '');
		let query = params.get('v') || '';
		query = query.replace('%3A', ':');
		return query.startsWith('tag:') ? `#${query.slice(4)}` : query;
	});

	urlQuery.subscribe((value) => {
		searchQuery.set(value);
	});
</script>

<div class="w-full">
	<div>
		{#each question || [] as item (item?.id)}
			<CardQuestion question={item} />
		{/each}
	</div>
</div>
