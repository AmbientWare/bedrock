import { redirect } from '$lib/components/notification/server.svelte'

// project imports
import * as db from '$lib/server/database'
import { googleOAuth2Client } from '$lib/server/config'

export const actions = {
	default: async ({ cookies }) => {
		// Check if the user is already logged in
		const sessionId = cookies?.get('sessionId')
		if (sessionId) {
			const validSession = await db.validateSession(sessionId)
			if (validSession) {
				redirect(302, '/dashboard')
			}
		}

		const scopes = ['email', 'profile']
		const url = googleOAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: scopes
		})

		redirect(302, url)
	}
}
