import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import * as fs from 'fs'
import * as path from 'path'

import { ENV } from '$lib/server/config'

export const POST: RequestHandler = async ({ request }) => {
    try {
        const data = await request.formData()
        const files = data.getAll('files')
        const mainDir = data.get('project') as string

        const uploadDir = path.join(ENV.DATAROOM_PATH, mainDir)

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        } else {
            // delete all files in the directory if it exists
            fs.rmSync(uploadDir, { recursive: true, force: true })
        }

        const uploadedFiles = []

        for (const file of files) {
            if (file instanceof File) {
                const buffer = await file.arrayBuffer()
                const filePath = path.join(uploadDir, file.name)

                const dir = path.dirname(filePath)
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true })
                }

                fs.writeFileSync(filePath, Buffer.from(buffer))
                uploadedFiles.push(filePath)
            }
        }

        // trigger bedrock script by sending a post request to the api
        const response = await fetch(`${ENV.API_URL}/agents/testharness`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ project_name: mainDir })
        })

        const res_data = await response.json()
        console.log(res_data)

        return json({
            message: 'Files uploaded successfully',
            uploadedFiles
        })

    } catch (err) {
        console.error('Error uploading files:', err)
        return json({ error: 'Internal server error' }, { status: 500 })
    }
}
