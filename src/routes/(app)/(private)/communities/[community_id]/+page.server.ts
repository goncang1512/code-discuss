import prisma from '@lib/utils/prisma';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '@lib/auth';
import { pusherServer } from '@lib/pusher';

export const load: PageServerLoad = async ({
	params,
	url
}: {
	params: { community_id: string };
	url: URL;
}) => {
	try {
		const searchParams = url.searchParams.get('v');

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
				}
			}
		});

		let result;
		if (searchParams) {
			const query = searchParams.split('tag:')[1] || '';
			result = await prisma.question.findMany({
				where: {
					tags: {
						has: query
					},
					communityId: data?.id,
					type: 'group'
				},
				include: {
					user: {
						select: {
							id: true,
							name: true,
							avatar: true,
							image: true
						}
					}
				}
			});
		}

		return {
			status: true,
			statusCode: 200,
			message: 'Success get community data',
			results: data,
			question: result
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
				},
				include: {
					user: {
						select: {
							id: true,
							name: true,
							avatar: true,
							image: true
						}
					}
				}
			});

			await pusherServer.trigger('chat-app', 'question-group', { result });
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
	},
	leaveGroup: async ({ request }) => {
		const data = await request.formData();
		const community_id = data.get('community_id') as string;
		const user_id = data.get('user_id') as string;
		try {
			await prisma.member.deleteMany({
				where: {
					communityId: community_id,
					userId: user_id
				}
			});

			return redirect(307, '/communities');
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
