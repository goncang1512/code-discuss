import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from './utils/prisma';
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from '$env/static/private';

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'postgresql'
	}),
	socialProviders: {
		discord: {
			clientId: DISCORD_CLIENT_ID as string,
			clientSecret: DISCORD_CLIENT_SECRET as string
		}
	},
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
