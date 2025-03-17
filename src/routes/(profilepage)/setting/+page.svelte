<script lang="ts">
	import { onMount } from 'svelte';
	import type { UserType } from '@lib/utils/types';

	let user: UserType[] = $state([]);

	onMount(async () => {
		const response = await fetch('/profile');
		const data = await response.json();
		user = data;
	});
</script>

<h1>User list</h1>
<ul>
	{#each user as item}
		<li>{item.name} x {item.email}</li>
	{/each}
</ul>
