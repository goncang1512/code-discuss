import prisma from '@lib/utils/prisma';
import type { LayoutServerLoad } from './$types';
import { auth } from '@lib/auth';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ url, params, request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	const data = await prisma.community.findFirst({
		where: {
			slug: params.community_id
		},
		include: {
			Member: {
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

	const pathname = url.pathname;
	const pathParts = pathname.split('/'); // Membagi path berdasarkan '/'
	const thirdSegment = pathParts[3];

	if (!inCommunity && thirdSegment !== 'invite') {
		throw redirect(302, '/communities');
	}

	return {
		status: true,
		statusCode: 200,
		message: 'Success get data member',
		results: data
	};
};
