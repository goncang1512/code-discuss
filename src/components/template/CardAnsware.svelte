<script lang="ts">
	import type { AnswerType, User } from '@lib/utils/types';
	import { shortTimeAgo } from '@lib/utils/time';
	import { useSession } from '@lib/context/userContext';
	import { enhance } from '$app/forms';
	import { Check, EllipsisVertical, Trash2 } from '@lucide/svelte';
	import { Popover } from 'flowbite-svelte';
	import AnswerServices from '@lib/services/answer.services';
	import { Submit } from 'mogora-ui';

	interface CardAnswerProps {
		answer: AnswerType | null;
		quest: {
			userId: string;
			id: string;
		};
	}

	let { answer, quest: qna }: CardAnswerProps = $props();
	const user = useSession();
	const quest = new AnswerServices(answer, $user);

	const paragrafs = answer?.content.split('\n') || [];
	const avatarSrc =
		answer?.user?.image !== 'image'
			? answer?.user?.image
			: answer?.user?.avatar === 'avatar'
				? 'https://i.pinimg.com/474x/4b/58/21/4b5821d29726276fe811ce1136270236.jpg'
				: answer?.user?.avatar;
</script>

<div class="flex gap-2 border-b border-gray-300 p-5 shadow-sm">
	<div class="w-[10%] flex-none md:w-[6%]">
		<img class="size-10 rounded-full" src={avatarSrc} alt="" />
	</div>
	<div class="flex-1">
		<div class="flex items-center justify-between pt-2">
			<div class="flex items-center gap-2">
				<p class="text-sm font-semibold text-zinc-600">{answer?.user?.name}</p>
				<p class="text-sm text-gray-400">{shortTimeAgo(answer?.createdAt)}</p>
			</div>
			{#if $user.id === answer?.user?.id || qna.userId === $user.id}
				<button id={`popover-${answer?.id}`} type="button" class="rounded-md p-1 hover:bg-gray-200">
					<EllipsisVertical size={20} />
				</button>
				<Popover triggeredBy={`#popover-${answer?.id}`}>
					{#if answer?.user?.id === $user?.id}
						<Submit
							method="POST"
							action={`/question/${qna?.id}?/deleteQna`}
							useEnhance={quest.handleDelete}
							classButton="flex w-full items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-200"
						>
							<Trash2 size={20} /> delete
						</Submit>
					{/if}
					{#if qna?.userId === $user?.id}
						<Submit
							useEnhance={quest.handleSolved}
							action={`/question/${qna?.id}?/solvedQna`}
							method="POST"
							classButton="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-200"
						>
							<Check size={20} /> the answer
						</Submit>
					{/if}
				</Popover>
			{/if}
		</div>
		<div>
			<div class="flex flex-col gap-2">
				{#each paragrafs as paragraf}
					<p class="text-base">{'  '}{paragraf}</p>
				{/each}
			</div>

			<div class="flex items-center pt-2">
				<form
					action={`/question/${qna?.id}?/upvote`}
					method="POST"
					use:enhance={quest.handleUpvote}
				>
					<button class={`flex gap-1 rounded-md p-1 hover:bg-gray-200`}>
						{@render thumbLike(answer?.upvotes ?? [], $user)}
						<span>{answer?.upvotes.length !== 0 ? answer?.upvotes.length : ''}</span>
					</button>
				</form>
				<form
					action={`/question/${qna.id}?/downVote`}
					method="POST"
					use:enhance={quest.handleDownVote}
				>
					<button class="flex gap-1 rounded-md p-1 hover:bg-gray-200">
						<span class="-scale-x-100 rotate-180"
							>{@render thumbLike(answer?.downvotes ?? [], $user)}</span
						>
						<span>{answer?.downvotes.length !== 0 ? answer?.downvotes.length : ''}</span>
					</button>
				</form>
				{#if answer?.is_answer}
					<span class="rounded-md bg-[#77B255] text-white">
						<Check size={20} />
					</span>
				{/if}
			</div>
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
