import * as db from '$lib/server/database'
import * as models from '$lib/server/models'

export async function getOrCreateSession({
	access_token,
	name,
	email,
	oauth_id
}: {
	access_token?: string
	name?: string
	email?: string
	oauth_id?: string
}): Promise<[models.Session | null, string | null]> {
	let session: models.Session | null = null
	let user_id: string | null = null
	let token: string | null = null

	if (access_token) {
		const user = await db.userByAccessToken(access_token)
		if (!user) {
			return [null, 'Failed to login user. Invalid access token.']
		}
		user_id = user.id
		token = user.access_token || null
	} else {

		if (!oauth_id || !name || !email) {
			return [null, 'Failed to login user. Missing OAuth ID, name, or email.']
		}

		if (!db.checkAllowedUserEmail(email)) {
			return [null, 'Account denied. Please request access.']
		}

		const existingUser = await db.userByOauthId(oauth_id)
		if (existingUser) {
			// if there is an existing session for this user, delete it
			await db.deleteSessionByUserId(existingUser.id)
			user_id = existingUser.id
			token = existingUser.access_token || null
		} else {
			const newUser = await db.createUser(name, email, oauth_id)
			user_id = newUser?.id || null

			token = newUser?.access_token || null
		}
	}

	if (!user_id) {
		return [null, 'Failed to login user.']
	}

	// check if the user has a session
	const existingSession = await db.sessionByUserId(user_id)
	if (existingSession) {
		return [existingSession, null]
	}

	// generate session for the user
	const expires_at = Date.now() + 60 * 60 * 24 * 1000 // 1 day

	if (!user_id || !token || !expires_at) {
		return [null, 'Failed to login user.']
	}

	session = await db.createSession(user_id, token, expires_at)

	return [session, null]
}
