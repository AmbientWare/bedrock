import { app_settings } from '$lib/server/config'
import { getDirectories, getFiles, getTemplates } from '$lib/server/utils'

export const load = async () => {
    const dataDirectories = getDirectories(app_settings.DATAROOM_PATH)
    const projectTemplates = await getTemplates()

    // create a dict with the directory name as the key and the files as the value
    const projectList = dataDirectories?.map((directory) => {
        return {
            name: directory,
            files: getFiles(app_settings.DATAROOM_PATH + `/${directory}/results`)
        }
    })

    return { projectList, projectTemplates }
}

