import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GITHUB_CLIENT_ID } from '$env/static/private';

export const GET: RequestHandler = async ({ url }) => {
    const baseUrl = url.origin;

    const params = new URLSearchParams({
        client_id: GITHUB_CLIENT_ID,
        redirect_uri: `${baseUrl}/api/auth/callback`,
    });

    throw redirect(302, `https://github.com/login/oauth/authorize?${params}`);
};
