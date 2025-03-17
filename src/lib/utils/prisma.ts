import { PrismaClient } from '@prisma/client';
import { env } from '$env/dynamic/private';

const prismaClientSingleton = () => new PrismaClient();

const globalForPrisma = globalThis as unknown as {
	prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}

export default prisma;
