import prisma from '$lib/prisma';
import type { User } from '@prisma/client';

export const getUserByOAuth = async (provider: string, oauthId: string): Promise<User | null> => {
	return prisma.user.findFirst({
		where: {
			oauthProvider: provider,
			oauthId: String(oauthId)
		}
	});
};

export const createUser = async ({
	email,
	username,
	oauthProvider,
	oauthId
}: {
	email?: string;
	username?: string;
	oauthProvider: string;
	oauthId: string;
}): Promise<User> => {
	return prisma.user.create({
		data: {
			email,
			username,
			oauthProvider,
			oauthId: String(oauthId)
		}
	});
};
