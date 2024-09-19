
import { json } from '@sveltejs/kit'
import fs from 'fs'

import { ENV } from '$lib/server/config'


export const DELETE = async ({ params }) => {
    const project = params.name
    const projectPath = `${ENV.DATAROOM_PATH}/${project}`
    // delete the project directory
    fs.rmdirSync(projectPath, { recursive: true })

    console.log(`Deleted project: ${project}`)

    return json({ success: true })
}



