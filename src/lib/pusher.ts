import { PUSHER_APP_ID, PUSHER_CLUSTER, PUSHER_KEY, PUSHER_SECRET } from '$env/static/private';
import PusherServer from 'pusher';

// reusable pusher client
export const pusherServer = new PusherServer({
	appId: PUSHER_APP_ID,
	key: PUSHER_KEY,
	secret: PUSHER_SECRET,
	cluster: PUSHER_CLUSTER
});
