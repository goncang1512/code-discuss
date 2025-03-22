import type { PageServerLoad } from '../$types';
import prisma from '@lib/utils/prisma';

export const load: PageServerLoad = async ({ url }) => {
	try {
		const searchParams = url.searchParams.get('v');
		let result;
		if (searchParams?.startsWith('tag:')) {
			const query = searchParams.split('tag:')[1] || '';

			result = await prisma.question.findMany({
				where: {
					tags: {
						has: query
					}
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
		} else {
			result = await prisma.question.findMany({
				where: {
					OR: [
						{
							content: {
								contains: String(searchParams),
								mode: 'insensitive'
							}
						},
						{
							title: {
								contains: String(searchParams),
								mode: 'insensitive'
							}
						}
					]
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
			message: 'Success get all data',
			results: result
		};
	} catch (error) {
		return {
			status: false,
			statusCode: 500,
			message: 'Internal Server Error',
			results: []
		};
	}
};
