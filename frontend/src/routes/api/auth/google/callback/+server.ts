import { googleOAuth2Client } from '$lib/server/config'
import type { RequestHandler } from '@sveltejs/kit'

// project imports
import { getOrCreateSession } from '../../helpers'
import { redirect } from '$lib/components/notification/server.svelte.ts'

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code')

	if (!code) {
		redirect(302, '/', { type: 'error', message: 'Failed to get access token' }, cookies)
	}

	const { tokens } = await googleOAuth2Client.getToken(code)
	googleOAuth2Client.setCredentials(tokens)

	const ticket = await googleOAuth2Client.verifyIdToken({
		idToken: tokens.id_token!,
		audience: process.env.GOOGLE_CLIENT_ID
	})
	const payload = ticket.getPayload()

	if (!payload) {
		redirect(302, '/', { type: 'error', message: 'Failed to get access token' }, cookies)
	}

	const email = payload.email || null
	const name = payload.name || null
	const oauth_id = payload.sub.toString() || null

	if (!email || !name || !oauth_id) {
		redirect(302, '/', { type: 'error', message: 'Failed to get access token' }, cookies)
	}

	const [session, message] = await getOrCreateSession({ name, email, oauth_id })

	if (!session) {
		redirect(302, '/', { type: 'error', message: message || 'Session not found.' }, cookies)
	}

	// Set the sessionid cookie for the user
	cookies.set('sessionId', session.id, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: session.expires_at
	})

	redirect(302, '/dashboard')
}
