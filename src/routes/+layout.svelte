<script lang="ts">
	import { createUserContext, createUserOnline } from '@lib/context/userContext';
	import '../app.css';
	import type { LayoutProps } from './$types';
	import { pusherClient } from '@lib/pusher-client';
	import type Pusher from 'pusher-js';
	import type { Channel } from 'pusher-js';

	let { children, data }: LayoutProps = $props();

	createUserContext(data.session?.user);
	const { addUser, removeUser } = createUserOnline();

	const channel: any = pusherClient.subscribe('presence-quickstart');
	channel.bind('pusher:subscription_succeeded', () => {
		if (channel.members) {
			channel.members.each((member: any) => addUser(member.id));
		}
	});

	channel.bind('pusher:member_added', (member: any) => {
		addUser(member.id);
	});

	channel.bind('pusher:member_removed', (member: any) => {
		removeUser(member.id);
	});
</script>

<svelte:head>
	<title>Akademi Kita</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>

{@render children()}
