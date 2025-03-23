import prisma from '@lib/utils/prisma';
import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const result = await prisma.community.findFirst({
			where: {
				slug: params.community_id
			},
			select: {
				name: true,
				id: true,
				slug: true
			}
		});
		return {
			status: true,
			statusCode: 200,
			message: 'Success get community data',
			results: result
		};
	} catch (error) {
		return {
			status: false,
			statusCode: 500,
			message: 'Internal Server Error',
			results: null
		};
	}
};

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const user_id = formData.get('user_id') as string;
		const community_id = formData.get('community_id') as string;

		try {
			const result = await prisma.member.create({
				data: {
					userId: user_id,
					communityId: community_id,
					role: 'member',
					joinedAt: new Date(),
					status: 'approved'
				}
			});

			return {
				status: true,
				statusCode: 201,
				message: 'Success join group',
				results: result
			};
		} catch (error) {
			return {
				status: false,
				statusCode: 500,
				message: 'Internal Server Error',
				results: null
			};
		}
	}
} satisfies Actions;
