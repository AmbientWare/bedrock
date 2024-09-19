import { ENV } from '$lib/server/config'
import { getDirectories, getFiles } from '$lib/server/utils'

export const load = async () => {
    const dataDirectories = getDirectories(ENV.DATAROOM_PATH)

    // create a dict with the directory name as the key and the files as the value
    const dataDirectoryDict = dataDirectories.map((directory) => {
        return {
            directory,
            files: getFiles(ENV.DATAROOM_PATH + `/${directory}/results`)
        }
    })

    return { dataDirectoryDict }
}
