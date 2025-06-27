import prisma from '$lib/prisma';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32, encodeHexLowerCase } from '@oslojs/encoding';
import type { Session } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set('session', token, {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		expires: expiresAt
	});
}

export function generateSessionToken(): string {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	const token = encodeBase32(tokenBytes).toLowerCase();
	return token;
}

export async function createSession(token: string, userId: string): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

	// You need to generate or provide a secretHash value here
	const secretHash = encodeHexLowerCase(sha256(new TextEncoder().encode(token + userId)));

	const session = await prisma.session.create({
		data: {
			id: sessionId,
			userId,
			secretHash,
			expiresAt
		}
	});

	return session;
}

export const getSessionById = async (id: string): Promise<Session | null> => {
	return prisma.session.findUnique({
		where: { id }
	});
};

export const deleteSessionById = async (id: string): Promise<void> => {
	await prisma.session.delete({
		where: { id }
	});
};
