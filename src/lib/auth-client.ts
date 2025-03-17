import { createAuthClient } from 'better-auth/svelte';
import { PUBLIC_BETTER_AUTH_URL } from '$env/static/public';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import type { auth } from './auth';

export const authClient = createAuthClient({
	baseURL: PUBLIC_BETTER_AUTH_URL,
	plugins: [inferAdditionalFields<typeof auth>()]
});
