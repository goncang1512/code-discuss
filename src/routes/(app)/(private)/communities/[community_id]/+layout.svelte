<script lang="ts">
	import RightComponent from '@components/layout/group/RightComponent.svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
	let toastStatus = $state(false);
</script>

<div class="flex w-full">
	<div class="flex min-h-screen flex-1 flex-col border-r border-gray-200">
		{@render children()}
	</div>
	<RightComponent {data} {toastStatus} />
</div>
