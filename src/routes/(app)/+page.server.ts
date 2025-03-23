import prisma from '@lib/utils/prisma';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const data = await prisma.question.findMany({
		where: {
			type: 'public'
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
		},
		orderBy: {
			createdAt: 'desc' // Mengurutkan dari yang paling lama ke terbaru
		}
	});

	return {
		status: true,
		statusCode: 200,
		message: 'Success get all data',
		results: data
	};
};

export const actions = {
	question: async ({ request }: { request: Request }) => {
		const data = await request.formData();
		const content = data.get('content') as string;
		const tag_content = data.get('tag_content') as string;
		const user_id = data.get('user_id') as string;
		const title = data.get('title') as string;

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
					title,
					content,
					tags: artag_content,
					userId: user_id,
					type: 'public'
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
	},
	upvote: async ({ request }: { request: Request }) => {
		const formData = await request.formData();
		const user_id = formData.get('user_id') as string;
		const question_id = formData.get('quest_id') as string;
		try {
			const question = await prisma.question.findUnique({
				where: { id: question_id },
				select: { upvotes: true } // Hanya mengambil kolom upvotes
			});

			if (!question) {
				return {
					status: false,
					statusCode: 404,
					message: 'Question not found'
				};
			}

			let updatedUpvotes;

			// Cek apakah user_id sudah ada dalam upvotes
			if (question.upvotes.includes(user_id)) {
				// Jika sudah ada, hapus dari array
				updatedUpvotes = question.upvotes.filter((id) => id !== user_id);
			} else {
				// Jika belum ada, tambahkan ke array
				updatedUpvotes = [...question.upvotes, user_id];
			}

			// Update data upvotes di database
			const result = await prisma.question.update({
				where: { id: question_id },
				data: { upvotes: updatedUpvotes }
			});

			return {
				status: true,
				statusCode: 201,
				message: 'Success upvote',
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
	},
	downVote: async ({ request }: { request: Request }) => {
		const formData = await request.formData();
		const user_id = formData.get('user_id') as string;
		const question_id = formData.get('quest_id') as string;
		try {
			const question = await prisma.question.findUnique({
				where: { id: question_id },
				select: { downvotes: true } // Hanya mengambil kolom upvotes
			});

			if (!question) {
				return {
					status: false,
					statusCode: 404,
					message: 'Question not found'
				};
			}

			let updatedDownvotes;

			// Cek apakah user_id sudah ada dalam upvotes
			if (question.downvotes.includes(user_id)) {
				// Jika sudah ada, hapus dari array
				updatedDownvotes = question.downvotes.filter((id) => id !== user_id);
			} else {
				// Jika belum ada, tambahkan ke array
				updatedDownvotes = [...question.downvotes, user_id];
			}

			// Update data upvotes di database
			const result = await prisma.question.update({
				where: { id: question_id },
				data: { downvotes: updatedDownvotes }
			});

			return {
				status: true,
				statusCode: 201,
				message: 'Success upvote',
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
	},
	deleteQna: async ({ request }: { request: Request }) => {
		const formData = await request.formData();
		const quest_id = formData.get('quest_id') as string;
		try {
			const result = await prisma.question.delete({
				where: {
					id: quest_id
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
	},
	solvedQna: async ({ request }: { request: Request }) => {
		const formData = await request.formData();
		const quest_id = formData.get('quest_id') as string;
		const solved = formData.get('solved') as string;
		try {
			const newSolved: boolean = solved === 'true' ? false : true;
			const result = await prisma.question.update({
				where: {
					id: quest_id
				},
				data: {
					is_accepted: newSolved
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
