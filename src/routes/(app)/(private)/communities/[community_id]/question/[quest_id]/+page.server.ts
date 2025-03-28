import prisma from '@lib/utils/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const data = await prisma.question.findFirst({
			where: {
				id: params.quest_id
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						avatar: true,
						image: true
					}
				},
				answer: {
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
					orderBy: [{ is_answer: 'desc' }, { createdAt: 'desc' }]
				}
			}
		});

		return {
			status: true,
			statusCode: 200,
			message: 'Success get data question',
			results: data
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
