<script lang="ts">
	import LayoutDiv from '@components/template/LayoutDiv.svelte';
	import type { PageProps } from './$types';
	import CardQuestion from '@components/template/CardQuestion.svelte';
	import { error } from '@sveltejs/kit';
	import type { EnhanceType, ReturnEnhanceType } from '@lib/utils/types';
	import { useSession } from '@lib/context/userContext';
	import { enhance } from '$app/forms';
	import { Button } from 'flowbite-svelte';
	import CardAnswer from '@components/template/CardAnsware.svelte';

	let { data }: PageProps = $props();
	const user = useSession();

	if (!data?.results) {
		throw error(404, 'Data not found');
	}

	let loading = $state(false);
	let message = $state();
	const handleEnhance = async ({ formElement, formData }: EnhanceType) => {
		loading = true;
		message = '';
		formData.append('user_id', $user?.id);
		formData.append('quest_id', String(data?.results?.id));
		return async ({ result, update }: ReturnEnhanceType) => {
			if (result.type === 'failure') {
				message = result.data?.message || '';
			}

			if (result.type === 'success') {
				formElement.reset();
			}
			loading = false;
			update();
		};
	};
</script>

<LayoutDiv>
	<CardQuestion question={data?.results} />
	{#if message}
		<p class="pt-5 text-center text-sm text-red-500 italic">{message}</p>
	{/if}
	<form
		method="POST"
		action="?/answer"
		use:enhance={handleEnhance}
		class="flex flex-col gap-2 border-b border-gray-200 p-4"
	>
		<textarea
			id="message"
			name="content"
			rows="4"
			class="block h-32 w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-zinc-600 focus:ring-zinc-600"
			placeholder="Write your answer here..."
		></textarea>
		<Button disabled={!$user || loading} type="submit" color="dark" class="w-max self-end"
			>{loading ? 'loading...' : 'Send'}</Button
		>
	</form>
	{#each data?.results?.answer || [] as answer (answer.id)}
		<CardAnswer {answer} quest={{ userId: String(data?.results?.userId) }} />
	{/each}
</LayoutDiv>
