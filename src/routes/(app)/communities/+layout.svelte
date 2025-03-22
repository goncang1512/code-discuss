<script lang="ts">
	import CommunitiesSide from '@components/layout/CommunitiesSide.svelte';
	import type { LayoutProps } from './$types';

	const { children, data }: LayoutProps = $props();
</script>

<CommunitiesSide community={data?.results} />

{@render children()}
