<script lang="ts">
	import QuestionGroup from '@components/layout/QuestionGroup.svelte';
	import type { PageProps } from './$types';
	import CardQuestion from '@components/template/CardQuestion.svelte';
	import { Button } from 'flowbite-svelte';
	import { PUBLIC_BETTER_AUTH_URL } from '$env/static/public';

	const { data }: PageProps = $props();
</script>

<div class="flex w-full">
	<div class="flex min-h-screen flex-1 flex-col border-r border-gray-200">
		<QuestionGroup community={data?.results} />
		{#each data?.results?.Question || [] as question (question?.id)}
			<CardQuestion {question} />
		{/each}
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

		<div class="w-full">
			<Button
				color="dark"
				class="w-full"
				on:click={() => {
					const url = `${PUBLIC_BETTER_AUTH_URL}/communities/${data?.results?.slug}/invite`;
					navigator.clipboard
						.writeText(url)
						.then(() => {
							alert('Link copied to clipboard!');
						})
						.catch((err) => {
							console.error('Failed to copy:', err);
						});
				}}>invite group</Button
			>
		</div>
	</div>
</div>
