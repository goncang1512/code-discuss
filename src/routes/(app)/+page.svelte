<script lang="ts">
	import AddQuestion from '@components/layout/AddQuestion.svelte';
	import CardQuestion from '@components/template/CardQuestion.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="flex w-full">
	<div class="flex min-h-screen flex-1 flex-col border-r border-gray-200">
		<AddQuestion />
		<dir>
			{#each data.results as item}
				<CardQuestion question={item} />
			{/each}
		</dir>
	</div>
	<div class="w-[40%] flex-none"></div>
</div>
