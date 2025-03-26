<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import InputFloat from '@components/fragments/InputFloat.svelte';
	import { useSession } from '@lib/context/userContext';
	import type { CommunityMember, EnhanceType, ReturnEnhanceType } from '@lib/utils/types';
	import { Button, Modal, Select } from 'flowbite-svelte';
	import { derived } from 'svelte/store';

	interface CommunitiesSideProps {
		community: CommunityMember[];
	}

	const { community }: CommunitiesSideProps = $props();

	const pathname = derived(page, ($page) => $page.url.pathname);
	const communitiesPage = derived(pathname, ($pathname) => $pathname.startsWith('/communities'));
	const user = useSession();

	let defaultModal = $state(false);
	let selected: string = $state('');

	let visibility = [
		{ value: 'public', name: 'Public' },
		{ value: 'private', name: 'Private' }
	];

	const handleCreateGroup = async ({ formElement, formData }: EnhanceType) => {
		formData.append('user_id', String($user?.id));

		return async ({ result, update }: ReturnEnhanceType) => {
			if (result.type === 'success') {
				defaultModal = false;
				formElement.reset();
				update();
			}
		};
	};
</script>

<div
	class={`${communitiesPage ? 'translate-x-0 ' : '-translate-x-[130%]'} fixed left-[88px] h-screen w-[230px] transform  shadow-md duration-200 max-md:hidden`}
>
	<div class="flex h-full flex-col items-start justify-between py-2 pl-5">
		<div class="flex w-full flex-col">
			{#each community as commu (commu.id)}
				<a href={`/communities/${commu.community.slug}`} class="border-b border-gray-300 py-1 pr-1">
					<h1 class="rounded-md py-2 pl-2 hover:bg-gray-200">
						{commu.community.name}
					</h1>
				</a>
			{/each}
		</div>
		<button
			onclick={() => (defaultModal = true)}
			class="rounded-md bg-zinc-700 px-3 py-1 text-white">Default modal</button
		>
	</div>
</div>

<Modal title="Create group" bind:open={defaultModal}>
	<form action="/communities?/createGroup" method="POST" use:enhance={handleCreateGroup}>
		<div class="flex flex-col gap-3 pb-3">
			<InputFloat name="name" required>Name</InputFloat>
			<textarea
				id="message"
				name="description"
				rows="4"
				class="block h-32 w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-zinc-600 focus:ring-zinc-600"
				placeholder="Write your description group here..."
				required
			></textarea>
			<Select
				name="visibility"
				class="mt-2 focus:border-zinc-600 focus:ring-zinc-600"
				items={visibility}
				bind:value={selected}
				required
			/>
		</div>
		<div class="flex items-center gap-4 border-t border-gray-300 pt-2">
			<Button type="submit" color="dark">Create</Button>
			<Button
				type="button"
				on:click={() => (defaultModal = false)}
				color="alternative"
				class="hover:text-black">Decline</Button
			>
		</div>
	</form>
</Modal>
