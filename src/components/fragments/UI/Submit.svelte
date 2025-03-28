<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	interface ButtonFormProps extends HTMLFormAttributes {
		children: Snippet;
		classButton?: string;
		useEnhance?: SubmitFunction<
			Record<string, unknown> | undefined,
			Record<string, unknown> | undefined
		>;
	}
	let { children, classButton, useEnhance, ...props }: ButtonFormProps = $props();
</script>

<form {...props} use:enhance={useEnhance}>
	<button type="submit" class={`${twMerge('inline', classButton)}`}>{@render children()}</button>
</form>
