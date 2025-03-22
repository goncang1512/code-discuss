<script lang="ts">
	import AddQuestion from '@components/layout/AddQuestion.svelte';
	import CardQuestion from '@components/template/CardQuestion.svelte';
	import type { PageProps } from './$types';
	import LayoutDiv from '@components/template/LayoutDiv.svelte';

	let { data }: PageProps = $props();
</script>

<div class="flex w-full">
	<LayoutDiv>
		<AddQuestion />
		<dir>
			{#each data.results as item (item.id)}
				<CardQuestion question={item} />
			{/each}
		</dir>
	</LayoutDiv>
</div>
