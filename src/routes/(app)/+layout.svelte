<script lang="ts">
	import type { LayoutProps } from './$types';
	import Layout from '@components/layout/Layout.svelte';

	let { children }: LayoutProps = $props();
</script>

<Layout>
	{@render children()}
</Layout>
