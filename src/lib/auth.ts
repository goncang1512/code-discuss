import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from './utils/prisma';

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'postgresql'
	}),
	emailAndPassword: {
		enabled: true
	},
	user: {
		modelName: 'user',
		additionalFields: {
			role: {
				type: 'string',
				input: true,
				defaultValue: 'user',
				required: true
			},
			avatar: {
				type: 'string',
				input: true,
				defaultValue: 'avatar',
				required: false
			},
			avatarId: {
				type: 'string',
				input: true,
				defaultValue: 'default_id',
				required: false
			}
		}
	}
});

export type Session = typeof auth.$Infer.Session;
