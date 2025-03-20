<script>
	import Navbar from './Navbar.svelte';

	let { children } = $props();
</script>

<div class="font-poppins flex">
	<div>
		<Navbar />
	</div>

	<div class="w-full pl-[20rem]">
		{@render children()}
	</div>
</div>
