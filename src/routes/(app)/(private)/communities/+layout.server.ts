import prisma from '@lib/utils/prisma';
import type { PageServerLoad } from './$types';
import { auth } from '@lib/auth';

export const load: PageServerLoad = async ({ request }: { request: Request }) => {
	try {
		const session = await auth.api.getSession({
			headers: request.headers
		});

		const data = await prisma.member.findMany({
			where: {
				userId: session?.user?.id
			},
			include: {
				community: true
			},
			orderBy: {
				joinedAt: 'desc'
			}
		});
		return {
			status: true,
			statusCode: 200,
			message: 'Success get group member',
			results: data
		};
	} catch (error) {
		return {
			status: false,
			statusCode: 500,
			message: 'Internal server error',
			results: []
		};
	}
};
