import prisma from '@lib/utils/prisma';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '@lib/auth';

export const load: PageServerLoad = async ({
	params,
	request
}: {
	params: { community_id: string };
	request: Request;
}) => {
	try {
		const session = await auth.api.getSession({
			headers: request.headers
		});

		const data = await prisma.community.findFirst({
			where: {
				slug: params.community_id
			},
			include: {
				Question: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								avatar: true,
								image: true
							}
						}
					},
					orderBy: {
						createdAt: 'desc'
					}
				},
				Member: {
					orderBy: [
						{
							role: 'asc'
						},
						{
							createdAt: 'asc'
						}
					],
					select: {
						id: true,
						role: true,
						user: {
							select: {
								id: true,
								name: true,
								avatar: true,
								image: true
							}
						}
					}
				}
			}
		});

		const inCommunity = data?.Member.some(
			(data) => String(data?.user.id) === String(session?.user?.id)
		);

		if (!inCommunity) {
			throw new Error('Not in community');
		}

		return {
			status: true,
			statusCode: 200,
			message: 'Success get community data',
			results: data
		};
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === 'Not in community') {
				redirect(302, '/communities');
			}
		}

		return {
			status: false,
			statusCode: 500,
			message: 'Internal Server Error',
			results: null
		};
	}
};

export const actions = {
	questionGroup: async ({ request }: { request: Request }) => {
		const data = await request.formData();
		const content = data.get('content') as string;
		const tag_content = data.get('tag_content') as string;
		const user_id = data.get('user_id') as string;
		const title = data.get('title') as string;
		const communityId = data.get('community_id') as string;

		if (!content || content === '') {
			return fail(422, {
				status: false,
				statusCode: 422,
				message: 'Not have content'
			});
		}

		const artag_content = JSON.parse(tag_content);
		try {
			const result = await prisma.question.create({
				data: {
					content,
					title,
					tags: artag_content,
					userId: user_id,
					type: 'group',
					communityId
				}
			});

			return {
				status: true,
				statusCode: 201,
				message: 'Success question in group',
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
