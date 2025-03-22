<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '@lib/auth-client';
	import { useSession } from '@lib/context/userContext';
	import { House, LogOut, Inbox, UsersRound, User, Search } from '@lucide/svelte';
	import { page } from '$app/stores';

	$: pathname = $page.url.pathname;
	$: communitiesPage = pathname.startsWith('/communities');

	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					goto('/login');
				}
			}
		});
	};

	const user = useSession();
	const links = [
		{
			name: 'Home',
			href: '/',
			icon: House
		},
		{
			name: 'Inbox',
			href: '/inbox',
			icon: Inbox
		},
		{
			name: 'Community',
			href: '/communities',
			icon: UsersRound
		},
		{
			name: 'Search',
			href: '/search',
			icon: Search
		},
		{
			name: 'Profile',
			href: '/profile',
			icon: User
		}
	];
</script>

<div
	class={`${communitiesPage ? 'translate-x-0 ' : '-translate-x-[130%]'} fixed left-[88px] h-screen w-[230px] transform bg-red-500 shadow-md duration-200`}
>
	<h1>COmmunitas</h1>
</div>

<div
	class={`${communitiesPage ? 'w-22' : 'w-xs'} fixed top-0 hidden h-screen flex-col justify-between bg-white px-5 py-4 shadow-lg duration-200 md:flex`}
>
	<div class={`${communitiesPage ? 'pl-2' : 'pl-10'} flex h-full flex-col justify-between`}>
		<div class="flex flex-col gap-2">
			{#each links as link}
				<a
					href={link.href}
					class={`${pathname === link.href && 'bg-gray-100'} group flex items-center rounded-lg p-2 font-[490] text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`}
				>
					<svelte:component this={link.icon} size={20} /><span
						class={`${communitiesPage ? 'hidden' : 'flex'} ms-3`}>{link.name}</span
					>
				</a>
			{/each}
		</div>

		{#if $user}
			<div class="flex items-center gap-3">
				<h1 class={`${communitiesPage && 'hidden'}`}>{$user?.name}</h1>
				<button onclick={handleLogout} class="cursor-pointer rounded-md p-1 hover:bg-gray-200">
					<LogOut />
				</button>
			</div>
		{:else}
			<div class="flex items-center gap-3">
				<a href="/login" class="rounded-md bg-zinc-800 px-3 py-1 text-center text-white">Login</a>
				<a
					href="/register"
					class="rounded-md border-2 border-black bg-white px-3 py-1 text-center text-black"
					>Register</a
				>
			</div>
		{/if}
	</div>
</div>
