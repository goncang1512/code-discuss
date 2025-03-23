<script lang="ts">
	import type { EnhanceType, ReturnEnhanceType } from '@lib/utils/types';
	import type { PageProps } from './$types';
	import { Button, Card } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import { useSession } from '@lib/context/userContext';
	import { goto } from '$app/navigation';

	const { data }: PageProps = $props();
	const user = useSession();

	let loading = $state(false);
	const handleJoinGroup = async ({ formData }: EnhanceType) => {
		loading = true;
		formData.append('user_id', $user?.id);
		formData.append('community_id', String(data?.results?.id));
		return async ({ result, update }: ReturnEnhanceType) => {
			if (result.type === 'success') {
				goto(`/communities/${data?.results?.slug}`, { replaceState: true, invalidateAll: true });
			}
		};
	};
</script>

<div class="fixed top-0 bottom-0 z-[50] flex h-full w-full items-center justify-center bg-white">
	<Card>
		<form action="" method="POST" use:enhance={handleJoinGroup} class="flex flex-col gap-4">
			<h1 class="text-center text-2xl font-semibold text-zinc-900">{data?.results?.name}</h1>
			<Button type="submit" disabled={loading} color="dark"
				>{loading ? 'loading...' : 'Join'}</Button
			>
		</form>
	</Card>
</div>
