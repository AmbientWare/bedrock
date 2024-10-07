import { json } from '@sveltejs/kit'

import { setFlashMessage } from '$lib/components/notification/server.svelte'
import * as db from '$lib/server/database'

// delete users given ids
export const DELETE = async ({ request, cookies }) => {
    const { ids } = await request.json()
    const success = await db.deleteUsers(ids)

    if (success) {
        setFlashMessage({
            type: 'success',
            message: 'Users deleted'
        }, cookies)
    } else {
        setFlashMessage({
            type: 'error',
            message: 'Failed to delete users'
        }, cookies)
    }

    return json({ success })
}
