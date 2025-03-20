<script lang="ts">
	import { Eye, EyeClosed } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface FloatProps extends HTMLInputAttributes {
		children: Snippet;
		name?: string;
		value?: string;
	}

	let seePassword = $state(false);

	let { children, name, value = $bindable(''), ...props }: FloatProps = $props();
</script>

<div class="relative h-full">
	<button
		type="button"
		class="absolute top-1/2 right-0 -translate-y-1/2 transform pr-2"
		onclick={() => (seePassword = !seePassword)}
	>
		{#if !seePassword}
			<EyeClosed />
		{:else}
			<Eye />
		{/if}
	</button>
	<input
		class="peer h-full w-full rounded-md border-2 border-slate-300 py-2 text-black focus:border-blue-600 focus:ring-0"
		placeholder=" "
		type={seePassword ? 'text' : 'password'}
		{...props}
		id={name}
		bind:value
		{name}
	/>
	<label
		for={name}
		class="absolute start-1 top-2 z-10 origin-[0] -translate-y-5 transform bg-white px-2 text-[0.9rem] font-[500] text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:px-2 peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:bg-gray-900 dark:text-gray-400 peer-focus:dark:text-blue-500"
	>
		{@render children()}
	</label>
</div>
