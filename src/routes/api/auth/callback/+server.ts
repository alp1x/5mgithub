import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';

export const GET: RequestHandler = async ({ url, cookies }) => {
    const code = url.searchParams.get('code');

    if (!code) {
        throw redirect(302, '/?error=no_code');
    }

    try {
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            console.error('OAuth error:', tokenData.error);
            throw redirect(302, '/?error=oauth_failed');
        }

        const accessToken = tokenData.access_token;

        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        const user = await userResponse.json();

        const session = {
            user: {
                id: user.id,
                login: user.login,
                avatar_url: user.avatar_url,
                name: user.name,
            },
            accessToken,
        };

        const isProduction = url.origin.includes('vercel.app') || !url.origin.includes('localhost');

        cookies.set('session', JSON.stringify(session), {
            path: '/',
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        throw redirect(302, '/');
    } catch (error) {
        if ((error as { status?: number })?.status === 302) throw error;
        console.error('Callback error:', error);
        throw redirect(302, '/?error=callback_failed');
    }
};
