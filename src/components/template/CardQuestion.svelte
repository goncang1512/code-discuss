<script lang="ts">
	import type { QuestionType, User } from '@lib/utils/types';
	import { shortTimeAgo } from '@lib/utils/time';
	import { useSession } from '@lib/context/userContext';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { Check, EllipsisVertical, LoaderCircle, Trash2 } from '@lucide/svelte';
	import { Popover } from 'flowbite-svelte';
	import { Submit } from 'mogora-ui';
	import QnaServices from '@lib/services/question.services';

	interface CardQuestProps {
		question: QuestionType | null;
	}

	let loadingDelete = $state(false);
	let { question: qna }: CardQuestProps = $props();
	const user = useSession();
	const quest = new QnaServices(qna, $user);

	const query = derived(page, ($page) => {
		const data = $page.url.searchParams.get('v') || '';
		return data.split('tag:')[1];
	});

	const paragrafs = qna?.content.split('\n') || [];
	const avatarSrc =
		qna?.user?.image !== 'image'
			? qna?.user?.image
			: qna?.user?.avatar === 'avatar'
				? 'https://i.pinimg.com/474x/4b/58/21/4b5821d29726276fe811ce1136270236.jpg'
				: qna?.user?.avatar;

	const tagSearch = $page.url.pathname.startsWith('/communities')
		? `${$page.url.pathname}/question/${qna?.id}`
		: `/question/${qna?.id}`;
</script>

<div class="flex gap-2 border-b border-gray-300 p-5 shadow-sm">
	<div class="w-[10%] flex-none md:w-[6%]">
		<img class="size-10 rounded-full" src={avatarSrc} alt="profile_picture" />
	</div>
	<div class="flex-1">
		<div class="flex items-center justify-between pt-2">
			<div class="flex items-center gap-2">
				<p class="text-sm font-semibold text-zinc-600">{qna?.user.name}</p>
				<p class="text-sm text-gray-400">{shortTimeAgo(qna?.createdAt)}</p>
			</div>
			{#if qna?.user.id === $user?.id}
				<button id={`popover-${qna?.id}`} type="button" class="rounded-md p-1 hover:bg-gray-200">
					<EllipsisVertical size={20} />
				</button>
				<Popover triggeredBy={`#popover-${qna?.id}`}>
					<form
						action="/?/deleteQna"
						method="POST"
						use:enhance={(data) =>
							quest.handleDelete(data, {
								onRequest: () => {
									loadingDelete = true;
								},
								onSuccess: () => {
									loadingDelete = false;
								},
								onError: () => {
									loadingDelete = false;
								}
							})}
					>
						<button
							disabled={loadingDelete}
							type="submit"
							class="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-200 disabled:cursor-default"
						>
							{#if loadingDelete}
								<LoaderCircle size={20} class="animate-spin" />
							{:else}
								<Trash2 size={20} />
							{/if}
							{loadingDelete ? 'loading' : 'delete'}
						</button>
					</form>
					<Submit
						useEnhance={quest.handleSolved}
						action="/?/solvedQna"
						method="POST"
						classButton="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-200"
					>
						<Check size={20} /> solved
					</Submit>
				</Popover>
			{/if}
		</div>
		<div class="border-b-2 border-gray-300 pb-2">
			<a href={tagSearch}>
				<div class="flex items-center gap-3">
					<h1 class="font-semibold">{qna?.title}</h1>
					{#if qna?.is_accepted}
						<span class="rounded-md bg-[#77B255] text-white">
							<Check size={20} />
						</span>
					{/if}
				</div>
				<div class="flex flex-col gap-2">
					{#each paragrafs as paragraf}
						<p class="text-base">{'  '}{paragraf}</p>
					{/each}
				</div>
			</a>

			<div class="flex items-center pt-2">
				<form action="/?/upvote" method="POST" use:enhance={quest.handleUpvote}>
					<button class={`flex gap-1 rounded-md p-1 hover:bg-gray-200`}>
						{@render thumbLike(qna?.upvotes ?? [], $user)}
						<span>{qna?.upvotes.length !== 0 ? qna?.upvotes.length : ''}</span>
					</button>
				</form>
				<form action="/?/downVote" method="POST" use:enhance={quest.handleDownVote}>
					<button class="flex gap-1 rounded-md p-1 hover:bg-gray-200">
						<span class="-scale-x-100 rotate-180"
							>{@render thumbLike(qna?.downvotes ?? [], $user)}</span
						>
						<span>{qna?.downvotes.length !== 0 ? qna?.downvotes.length : ''}</span>
					</button>
				</form>
			</div>
		</div>
		<div class="flex flex-wrap gap-2 pt-2">
			{#each qna?.tags ?? [] as tag}
				{@const tagSearch = $page.url.pathname.startsWith('/communities')
					? `?v=tag:${tag}`
					: `/search?v=tag:${tag}`}
				<a
					href={`${tagSearch}`}
					class={`${$query === tag && 'bg-gray-200'} rounded-md px-1 hover:bg-gray-200`}>#{tag}</a
				>
			{/each}
		</div>
	</div>
</div>

{#snippet thumbLike(upvote: string[], user: User)}
	<svg
		class="h-6 w-6 text-gray-800 dark:text-white"
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill={upvote.includes(user?.id) ? '#3b82f6' : 'currentCuller'}
		viewBox="0 0 24 24"
	>
		<path
			fill-rule="evenodd"
			d="M15.03 9.684h3.965c.322 0 .64.08.925.232.286.153.532.374.717.645a2.109 2.109 0 0 1 .242 1.883l-2.36 7.201c-.288.814-.48 1.355-1.884 1.355-2.072 0-4.276-.677-6.157-1.256-.472-.145-.924-.284-1.348-.404h-.115V9.478a25.485 25.485 0 0 0 4.238-5.514 1.8 1.8 0 0 1 .901-.83 1.74 1.74 0 0 1 1.21-.048c.396.13.736.397.96.757.225.36.32.788.269 1.211l-1.562 4.63ZM4.177 10H7v8a2 2 0 1 1-4 0v-6.823C3 10.527 3.527 10 4.176 10Z"
			clip-rule="evenodd"
		/>
	</svg>
{/snippet}
