<script lang="ts">
	import { Eye, EyeClosed } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let { children, name, type, value = $bindable(''), ...props }: FloatProps = $props();

	interface FloatProps extends HTMLInputAttributes {
		children: Snippet;
		name?: string;
		value?: string;
	}

	let seePassword = $state(false);
</script>

{#if type === 'password'}
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
			class="peer block w-full rounded-lg border-2 border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-zinc-600 focus:ring-zinc-600"
			placeholder=" "
			type={seePassword ? 'text' : 'password'}
			{...props}
			id={name}
			bind:value
			{name}
		/>
		<label
			for={name}
			class="absolute start-1 top-2 z-10 origin-[0] -translate-y-5 transform bg-white px-2 text-[0.9rem] font-[500] text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:px-2 peer-focus:text-zinc-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 peer-focus:dark:text-zinc-500"
		>
			{@render children()}
		</label>
	</div>
{:else}
	<div class="relative">
		<input
			class="peer block w-full rounded-lg border-2 border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-zinc-600 focus:ring-zinc-600"
			placeholder=" "
			{...props}
			id={name}
			{type}
			bind:value
			{name}
		/>
		<label
			for={name}
			class="absolute start-1 top-2 z-10 origin-[0] -translate-y-5 transform bg-white px-2 text-[0.9rem] font-[500] text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:px-2 peer-focus:text-zinc-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 peer-focus:dark:text-zinc-500"
		>
			{@render children()}
		</label>
	</div>
{/if}
