import type { Handle } from '@sveltejs/kit';
import type { Session } from '$lib/types/github';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionCookie = event.cookies.get('session');

    if (sessionCookie) {
        try {
            const session: Session = JSON.parse(sessionCookie);
            event.locals.session = session;
        } catch {
            event.cookies.delete('session', { path: '/' });
        }
    }

    return resolve(event);
};