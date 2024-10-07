import { sequence } from '@sveltejs/kit/hooks'
import { redirect } from '@sveltejs/kit'
import type { Handle } from '@sveltejs/kit'
import { initDb } from '$lib/server/database'
import type { User } from '$lib/server/models'

export interface Locals {
    user: User | null
}

declare global {
    interface App {
        Locals: Locals
    }
}

// Database initialization handle
const dbInitHandle: Handle = async ({ event, resolve }) => {
    await initDb()

    return await resolve(event)
}

// Route protection handle
const routeProtectionHandle: Handle = async ({ event, resolve }) => {
    const { pathname } = event.url
    const cookies = event.cookies

    const publicPathPatterns = [
        /^\/$/,
        /^\/login$/,
        /^\/news$/,
        /^\/privacy-policy$/,
        /^\/terms-and-conditions$/,
        /^\/about$/,
        /^\/api\/auth\/.*/
    ]
    const isPublicPath = publicPathPatterns.some((pattern) => pattern.test(pathname))
    const isAsset = pathname.startsWith('/assets/') || pathname.startsWith('/static/')

    if (!isPublicPath && !isAsset && !cookies.get('sessionId')) {
        redirect(302, '/')
    }

    return await resolve(event)
}

// Combine handles
export const handle = sequence(dbInitHandle, routeProtectionHandle)
