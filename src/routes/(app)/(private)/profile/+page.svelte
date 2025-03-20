<script lang="ts">
	import type { LayoutProps } from '../$types';
	let { data }: LayoutProps = $props();

	const user = data?.session?.user;
</script>

<div>
	<h1>{user?.name}</h1>
</div>
