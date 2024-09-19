import * as fs from 'fs'

import { ENV } from './config'

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
    const dataroomPath = `${ENV.DATAROOM_PATH}/${project}/results/${name}`
    return fs.readFileSync(dataroomPath, 'utf8')
}
