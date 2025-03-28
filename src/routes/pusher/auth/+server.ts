import { json, type RequestHandler } from '@sveltejs/kit';
import { pusherServer } from '$lib/pusher';
import { auth } from '@lib/auth';

export const POST: RequestHandler = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session?.user) {
		return new Response('Unauthorized', { status: 403 });
	}

	// 🛠️ FIX: Parsing form-urlencoded
	const formData = await request.text();
	const params = new URLSearchParams(formData);
	const socket_id = params.get('socket_id');
	const channel_name = params.get('channel_name');

	if (!socket_id || !channel_name) {
		return new Response('Invalid request', { status: 400 });
	}

	const authResponse = pusherServer.authorizeChannel(socket_id, channel_name, {
		user_id: session.user.id
	});

	console.log('YOUR ARE ONLINE : ', session?.user?.name);

	return json(authResponse);
};
