import prisma from '@lib/utils/prisma';
import type { Actions } from '@sveltejs/kit';
import slugify from 'slugify';
import type { PageServerLoad } from './$types';
import { auth } from '@lib/auth';
import type { CommunityMember } from '@lib/utils/types';

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

export const actions: Actions = {
	createGroup: async ({ request }: { request: Request }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const description = data.get('description') as string;
		const visibility = data.get('visibility') as 'public' | 'private';
		const user_id = data.get('user_id') as string;
		const slug = slugify(name, { lower: true, strict: true });
		try {
			const result = await prisma.community.create({
				data: {
					ownerId: user_id,
					name,
					slug,
					description,
					visibility
				}
			});

			const member = await prisma.member.create({
				data: {
					userId: user_id,
					communityId: result.id,
					role: 'owner',
					joinedAt: new Date(),
					status: 'approved'
				}
			});

			return {
				status: true,
				statusCode: 201,
				message: 'Success create group',
				results: { result, member }
			};
		} catch (error) {
			console.log('ERROR : ', error);
			return {
				status: false,
				statusCode: 500,
				message: 'Internal Server Error',
				results: error
			};
		}
	}
} satisfies Actions;
