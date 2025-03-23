<script lang="ts">
	import type { LayoutProps } from './$types';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import Layout from '@components/layout/Layout.svelte';

	let { children }: LayoutProps = $props();
	const hideLayout = derived(page, ($page) => {
		const segments = $page.url.pathname.split('/');
		return segments.length === 4 && segments[1] === 'communities' && segments[3] === 'invite';
	});
</script>

{#if $hideLayout}
	{@render children()}
{:else}
	<Layout>
		{@render children()}
	</Layout>
{/if}
