import type { RequestHandler } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'

import * as db from '$lib/server/database'

export const GET: RequestHandler = async ({ cookies }) => {
	const sessionId = cookies.get('sessionId')
	if (sessionId) {
		// Delete the session from DynamoDB
		await db.deleteSession(sessionId)

		// Delete the cookie
		cookies.delete('sessionId', { path: '/' })
	}
	// Redirect to home page
	redirect(302, '/')
}
