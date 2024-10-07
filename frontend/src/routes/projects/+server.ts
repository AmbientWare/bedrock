
import { json } from '@sveltejs/kit'

import { getDirectories, getFiles } from '$lib/server/utils'
import { app_settings } from '$lib/server/config'


export const GET = async () => {
    const dataDirectories = getDirectories(app_settings.DATAROOM_PATH)

    const projectList = dataDirectories.map((directory: string) => {
        return {
            name: directory,
            files: getFiles(app_settings.DATAROOM_PATH + `/${directory}/results`)
        }
    })

    return json(projectList)
}

export const POST = async ({ request, fetch }) => {
    const data = await request.json()

    // Make a request to the backend API to create the new project
    const response = await fetch(`${app_settings.BACKEND_URL}/projects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    const responseData = await response.json()

    if (response.ok) {
        return json({ data: responseData })
    } else {
        return json({ error: responseData.error }, { status: 500 })
    }
}


