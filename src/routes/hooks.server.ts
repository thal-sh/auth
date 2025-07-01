import type { Handle } from '@sveltejs/kit';
import {
	deleteSessionTokenCookie,
	setSessionTokenCookie,
	validateSessionToken
} from '$lib/server/session';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('session') ?? null;
	if (sessionToken === null) {
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(sessionToken);
	if (session !== null) {
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		deleteSessionTokenCookie(event);
	}
	event.locals.session = session;
	return resolve(event);
};
