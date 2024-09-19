
import { json } from '@sveltejs/kit'

import { getDirectories, getFiles } from '$lib/server/utils'
import { ENV } from '$lib/server/config'


export const GET = async () => {
    const dataDirectories = getDirectories(ENV.DATAROOM_PATH)

    const projectList = dataDirectories.map((directory: string) => {
        return {
            name: directory,
            files: getFiles(ENV.DATAROOM_PATH + `/${directory}/results`)
        }
    })

    return json(projectList)
}



