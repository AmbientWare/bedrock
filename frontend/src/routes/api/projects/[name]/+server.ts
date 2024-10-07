import type { RequestHandler } from '@sveltejs/kit'
import { json } from '@sveltejs/kit'
import fs from 'fs'

import { app_settings } from '$lib/server/config'

export const DELETE: RequestHandler = async ({ params, fetch }) => {
    const project = params.name
    const projectPath = `${app_settings.DATAROOM_PATH}/${project}`

    // make a request to the backend API to delete the project
    const response = await fetch(`${app_settings.API_URL}/projects/${project}`, { method: 'DELETE' })
    if (response.ok) {
        // delete the project directory
        fs.rmdirSync(projectPath, { recursive: true })
        return json({ message: 'Project deleted successfully' })
    }

    return json({ message: 'Failed to delete project' }, { status: 500 })
}
