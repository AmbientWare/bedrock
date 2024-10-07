import type { RequestEvent, Cookies } from '@sveltejs/kit'
import * as db from '$lib/server/database'
import { catchFlash } from '$lib/components/notification/server.svelte'

export const load = catchFlash(async (event: RequestEvent) => {
    return {
        sessionInfo: await getSession(event.cookies)
    }
})

async function getSession(cookies: Cookies) {
    const sessionid = cookies.get('sessionId') || null

    const session = await db.getSession(sessionid)
    if (!session) {
        return {
            user: null
        }
    }

    if (!sessionid) {
        return {
            user: null
        }
    }

    const user = await db.userBySessionId(sessionid)

    return {
        user: user ? {
            id: user?.id,
            name: user?.name,
            email: user?.email,
            role: user?.role
        } : null
    }
}
