import { json } from '@sveltejs/kit'

import { setFlashMessage } from '$lib/components/notification/server.svelte'
import { deleteAllowedUserEmails } from '$lib/server/database'

export const DELETE = async ({ request, cookies }) => {
    const { ids } = await request.json()

    const success = await deleteAllowedUserEmails(ids)

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
