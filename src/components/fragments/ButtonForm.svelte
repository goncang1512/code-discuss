<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	interface ButtonFormProps extends HTMLAttributes<HTMLFormElement> {
		children: Snippet;
		classButton?: string;
		useEnhance?: (form: HTMLFormElement) => void;
	}
	let { children, classButton, useEnhance, ...props } = $props();
</script>

<form {...props} use:enhance={useEnhance}>
	<button type="submit" class={`${twMerge('inline', classButton)}`}>{@render children()}</button>
</form>
