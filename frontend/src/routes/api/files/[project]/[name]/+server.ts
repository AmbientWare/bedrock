import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { getResultFile } from '$lib/server/utils'


export const GET: RequestHandler = async ({ params }) => {
    const { project, name } = params

    // get the contents of a file
    const fileContents = getResultFile(project, name)
    return json({ fileContents })
}

