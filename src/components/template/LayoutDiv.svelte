<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Layout {
		children: Snippet;
	}
	let { children }: Layout = $props();
</script>

<div class="flex w-full">
	<div class="flex min-h-screen flex-1 flex-col border-r border-gray-200">
		{@render children()}
	</div>
	<div class="hidden w-[40%] flex-none md:flex"></div>
</div>
