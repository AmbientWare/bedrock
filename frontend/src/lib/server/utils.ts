import * as fs from 'fs'

import { app_settings } from './config'
import type { SummaryTemplate } from '../interfaces/interfaces'

export function getDirectories(dataroomPath: string) {
    // get all directories in the dataroom path
    const directories = fs.readdirSync(dataroomPath, { withFileTypes: true })
    return directories.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name)
}

export function getFiles(dataroomPath: string) {
    // check if the dataroom path is a directory
    if (fs.existsSync(dataroomPath) && fs.statSync(dataroomPath).isDirectory()) {
        // get all files in the dataroom path
        const files = fs.readdirSync(dataroomPath, { withFileTypes: true })
        return files.filter((file) => file.isFile()).map((file) => file.name)
    } else {
        return []
    }
}

export function getResultFile(project: string, name: string) {
    // get the contents of a file
    const dataroomPath = `${app_settings.DATAROOM_PATH}/${project}/results/${name}`
    return fs.readFileSync(dataroomPath, 'utf8')
}

export async function getTemplates() {
    try {
        // fetch all the summary templates from the api
        const response = await fetch(`${app_settings.API_URL}/templates`)
        const data = await response.json()
        const templates = data.templates

        // Check if the response is an array
        if (!Array.isArray(templates)) {
            console.error('API response is not an array:', templates)
            return []
        }

        // add an id field to each template
        const templatesWithId = templates.map((template: SummaryTemplate) => ({
            id: crypto.randomUUID(),
            ...template
        }))

        return templatesWithId

    } catch (error) {
        console.error('Error fetching templates:', error)
        return []
    }
}
