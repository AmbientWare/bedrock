// project imports
import { getOrCreateSession } from '../helpers'
import { redirect } from '$lib/components/notification/server.svelte.ts'
import * as db from '$lib/server/database'
import { app_settings } from '$lib/server/config'
import { ConstructionIcon } from 'lucide-svelte'

export const actions = {
    default: async ({ cookies, request }) => {

        // Check if the user is already logged in
        const sessionId = cookies?.get('sessionId')
        if (sessionId) {
            const validSession = await db.validateSession(sessionId)
            if (validSession) {
                redirect(302, '/dashboard')
            }
        }

        // if dev mode, print the token for the admin user
        let access_token = null
        if (app_settings.ENV === 'dev') {
            const user = await db.userByEmail('admin@example.com')
            access_token = user?.access_token
        } else {
            // get access code from request
            const formData = await request.formData()
            access_token = formData.get('access-token')
        }

        if (!access_token) {
            redirect(302, '/', { type: 'error', message: 'Access token not found in request.' }, cookies)
        }

        // get user from access code
        const user = await db.userByAccessToken(access_token as string)

        if (!user) {
            redirect(302, '/', { type: 'error', message: 'User not found.' }, cookies)
        }

        const [session, message] = await getOrCreateSession({ access_token: user.access_token })

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
}
