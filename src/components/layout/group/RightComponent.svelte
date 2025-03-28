<script lang="ts">
	import { Button, Toast } from 'flowbite-svelte';
	import { PUBLIC_BETTER_AUTH_URL } from '$env/static/public';
	import type { EnhanceType, ReturnEnhanceType } from '@lib/utils/types';
	import { CircleCheck, LogOut } from '@lucide/svelte';
	import ButtonForm from '@components/fragments/ButtonForm.svelte';
	import { useSession } from '@lib/context/userContext';
	import { fly } from 'svelte/transition';

	let { data, toastStatus }: { data: any; toastStatus: boolean } = $props();
	const user = useSession();
</script>

<div
	in:fly={{ y: 200, delay: 200, duration: 200 }}
	out:fly={{ y: -200, duration: 200 }}
	class="fixed top-2 left-1/2 z-50 -translate-x-1/2"
>
	<Toast color="green" class="rounded-md border border-gray-200" bind:toastStatus>
		<svelte:fragment slot="icon">
			<CircleCheck size={20} />
			<span class="sr-only">Check icon</span>
		</svelte:fragment>
		<p class="text-center">Text has been copied to clipboard</p>
	</Toast>
</div>

<div class="hidden w-[40%] flex-none flex-col items-start justify-between p-5 md:flex">
	<div class="flex w-full flex-col">
		{#each data?.results?.Member || [] as member (member.id)}
			{@const avatarScr =
				member?.user?.image !== 'image'
					? member?.user?.image
					: member?.user?.avatar === 'avatar'
						? 'https://i.pinimg.com/474x/4b/58/21/4b5821d29726276fe811ce1136270236.jpg'
						: member?.user?.avatar}
			<div class="flex w-full items-center gap-1 border-b border-gray-300 py-2">
				<img class="size-10 rounded-full" src={avatarScr} alt="" />
				<div class="flex flex-col leading-4">
					<h1 class="font-medium">{member.user?.name}</h1>
					<p class="text-sm text-gray-400 capitalize">{member.role}</p>
				</div>
			</div>
		{/each}
	</div>

	<div class="flex w-full items-center gap-2">
		<Button
			color="dark"
			class="w-full"
			on:click={() => {
				const url = `${PUBLIC_BETTER_AUTH_URL}/communities/${data?.results?.slug}/invite`;
				navigator.clipboard
					.writeText(url)
					.then(() => {
						toastStatus = true;
						setTimeout(() => {
							toastStatus = false;
						}, 3000);
					})
					.catch((err) => {
						console.error('Failed to copy:', err);
					});
			}}>invite to group</Button
		>
		<ButtonForm
			useEnhance={({ formElement, formData }: EnhanceType) => {
				formData.append('user_id', String($user?.id));
				formData.append('community_id', String(data?.results?.id));
				return async ({ update }: ReturnEnhanceType) => {
					update();
					formElement.reset();
				};
			}}
			action={`?/leaveGroup`}
			method="POST"
			classButton="bg-red-500 px-2 py-2 h-full w-full rounded-md"><LogOut size={20} /></ButtonForm
		>
	</div>
</div>
