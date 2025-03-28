<script lang="ts">
	import QuestionGroup from '@components/layout/QuestionGroup.svelte';
	import type { PageProps } from './$types';
	import CardQuestion from '@components/template/CardQuestion.svelte';
	import { derived, writable } from 'svelte/store';
	import { page } from '$app/stores';
	import TagGroup from '@components/layout/TagGroup.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { pusherClient } from '@lib/pusher-client';
	import type { QuestionType } from '@lib/utils/types';

	let { data }: PageProps = $props();

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

	onMount(() => {
		pusherClient.subscribe('chat-app');

		const handler = (newData: { result: QuestionType }) => {
			console.log(newData.result);
			if (newData.result) {
				data = {
					...data,
					results: {
						...(data?.results as any),
						Question: [newData.result, ...(data?.results?.Question || [])]
					}
				};
			}
		};

		const deleteQuestion = (prevData: { result: { id: string } }) => {
			data = {
				...data,
				results: {
					...(data.results as any),
					Question: data.results?.Question?.filter((q) => q.id !== prevData.result.id) || []
				}
			};
		};

		pusherClient.bind('question-group', handler);
		pusherClient.bind('delete-question', deleteQuestion);

		onDestroy(() => {
			pusherClient.unbind('question-group', handler);
			pusherClient.unbind('delete-question', deleteQuestion);
			pusherClient.unsubscribe('chat-app');
		});
	});
</script>

<div class="flex w-full">
	<div class="flex min-h-screen flex-1 flex-col border-r border-gray-200">
		{#if $urlQuery}
			<TagGroup question={data?.question} />
		{:else}
			<QuestionGroup community={data?.results} />
			{#each data?.results?.Question || [] as question (question?.id)}
				<CardQuestion {question} />
			{/each}
		{/if}
	</div>
</div>
