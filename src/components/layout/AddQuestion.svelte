<script lang="ts">
	import { enhance } from '$app/forms';
	import { useSession } from '@lib/context/userContext';
	import type { EnhanceType, ReturnEnhanceType } from '@lib/utils/types';
	import InputFloat from '@components/fragments/InputFloat.svelte';
	import { CircleX, X } from '@lucide/svelte';
	import { Button, Toast } from 'flowbite-svelte';
	import { slide } from 'svelte/transition';

	const user = useSession();

	let tags: string[] = $state([]);
	let tagInput = $state('');
	let loading = $state(false);
	let message = $state();
	let inputRef: HTMLInputElement;

	const deleteTag = (tag_name: string) => {
		tags = tags.filter((t) => t !== tag_name);
	};

	const handleEnhance = async ({ formElement, formData }: EnhanceType) => {
		loading = true;
		message = '';
		if (formData.get('content') === '') {
			loading = false;
			showToastError('Not have content');
			return;
		}
		formData.append('tag_content', JSON.stringify(tags));
		formData.append('user_id', $user?.id);
		return async ({ result, update }: ReturnEnhanceType) => {
			if (result.type === 'failure') {
				message = result.data?.message || '';
			}

			if (result.type === 'success') {
				formElement.reset();
				tags = [];
			}
			loading = false;
			update();
		};
	};

	let toastStatus = $state(false);
	let messageError = $state('');
	let counter = 6;

	function addTag() {
		const trimmedInput = tagInput.trim();

		if (trimmedInput.includes(' ')) {
			showToastError('Space not allowed');
			return;
		}

		tags.push(trimmedInput);
		tagInput = '';
		inputRef.focus();
	}

	function showToastError(message: string) {
		toastStatus = true;
		messageError = message;
		counter = 6;

		const timeout = setInterval(() => {
			counter--;
			if (counter <= 0) {
				toastStatus = false;
				clearInterval(timeout);
			}
		}, 1000);
	}
</script>

<Toast
	color="red"
	class="fixed right-3 bottom-3 rounded-md border border-gray-200"
	transition={slide}
	bind:toastStatus
>
	<svelte:fragment slot="icon">
		<CircleX class="size-5" />
		<span class="sr-only">Error icon</span>
	</svelte:fragment>
	{messageError}
</Toast>

{#if message}
	<p class="pt-5 text-center text-sm text-red-500 italic">{message}</p>
{/if}
<form
	method="POST"
	action="?/question"
	use:enhance={handleEnhance}
	class="flex flex-col gap-2 border-b border-gray-200 p-4"
>
	<InputFloat name="title" type="text">Title</InputFloat>
	<textarea
		id="message"
		name="content"
		rows="4"
		class="block h-32 w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-zinc-600 focus:ring-zinc-600"
		placeholder="Write your question here..."
	></textarea>
	<div class="flex items-center gap-3">
		<input
			type="text"
			bind:value={tagInput}
			bind:this={inputRef}
			id="first_name"
			name="tags"
			class="block w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-zinc-600 focus:ring-zinc-600"
			placeholder="javascript"
		/>
		<Button type="button" color="dark" onclick={addTag}>Tag</Button>
	</div>
	<div class="flex flex-wrap gap-2">
		{#each tags as tag}
			<div class="flex items-center gap-1 rounded-md bg-gray-200 px-1">
				<p>#{tag}</p>
				<button onclick={() => deleteTag(tag)} type="button" class="hover:bg-gray-300"
					><X size={17} /></button
				>
			</div>
		{/each}
	</div>
	<Button disabled={!$user} type="submit" color="dark" class="w-max"
		>{loading ? 'loading...' : 'Send'}</Button
	>
</form>
