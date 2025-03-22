import prisma from '@lib/utils/prisma';
import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }: { params: { quest_id: string } }) => {
	try {
		const data = await prisma.question.findFirst({
			where: {
				id: String(params.quest_id)
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
			messaeg: 'Success get questin data',
			results: data
		};
	} catch (error) {
		return {
			status: false,
			statusCode: 200,
			messaeg: 'Success get questin data',
			results: null
		};
	}
};

export const actions: Actions = {
	answer: async ({ request }: { request: Request }) => {
		const data = await request.formData();
		const content = data.get('content') as string;
		const user_id = data.get('user_id') as string;
		const quest_id = data.get('quest_id') as string;
		try {
			const result = await prisma.answer.create({
				data: {
					content,
					userId: user_id,
					questionId: quest_id
				}
			});
			return {
				status: true,
				statusCode: 200,
				message: 'Success answer question',
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
	upvote: async ({ request }: { request: Request }) => {
		const formData = await request.formData();
		const user_id = formData.get('user_id') as string;
		const answer_id = formData.get('answer_id') as string;
		try {
			const question = await prisma.answer.findUnique({
				where: { id: answer_id },
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
			const result = await prisma.answer.update({
				where: { id: answer_id },
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
		const answer_id = formData.get('answer_id') as string;
		try {
			const question = await prisma.answer.findUnique({
				where: { id: answer_id },
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
			const result = await prisma.answer.update({
				where: { id: answer_id },
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
		const answer_id = formData.get('answer_id') as string;
		try {
			const result = await prisma.answer.delete({
				where: {
					id: answer_id
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
		const answer_id = formData.get('answer_id') as string;
		const solved = formData.get('solved') as string;
		try {
			const newSolved: boolean = solved === 'true' ? false : true;
			const result = await prisma.answer.update({
				where: {
					id: answer_id
				},
				data: {
					is_answer: newSolved
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
