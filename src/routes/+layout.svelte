<script lang="ts">
	import { createUserContext } from '@lib/context/userContext';
	import '../app.css';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	createUserContext(data.session?.user);
</script>

<svelte:head>
	<title>Akademi Kita</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>

{@render children()}
