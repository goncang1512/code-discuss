import { auth } from '@lib/auth';
import { type Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }: { request: Request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		try {
			const result = await auth.api.signInEmail({
				body: {
					email,
					password
				}
			});

			return {
				status: true,
				statusCode: 200,
				message: 'Success login',
				results: result
			};
		} catch (error) {
			return {
				status: false,
				statusCode: 500,
				message: 'Internal Server Error',
				results: error
			};
		}
	}
} satisfies Actions;
