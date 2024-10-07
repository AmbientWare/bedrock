import type { Cookies, RequestEvent } from '@sveltejs/kit'
import { redirect as redirectSvelteKit } from '@sveltejs/kit'
import { fail as failSvelteKit } from '@sveltejs/kit'

interface CookieOptions {
	path: string
	httpOnly: boolean
	secure: boolean
	sameSite: 'lax' | 'strict' | 'none'
	maxAge: number
}

export const cookieOptions: CookieOptions = $state({
	path: '/',
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'lax',
	maxAge: 10
})

function getFlash(cookies: Cookies) {
	const flash = cookies.get('flash')
	if (flash) {
		return JSON.parse(flash)
	}
	return null
}

export function catchFlash(loadFn: (event: RequestEvent) => Promise<any>) {
	return async (event: RequestEvent) => {
		const originalData = await loadFn(event)
		const flashMessage = getFlash(event.cookies)

		if (flashMessage) {
			event.cookies.delete('flash', { path: '/' })
		}

		return {
			...originalData,
			flash: flashMessage
		}
	}
}

export function setFlashMessage(message: App.PageData['flash'], cookies: Cookies) {
	cookies.set('flash', JSON.stringify(message), { ...cookieOptions })
}

export function fail(status: number, message: App.PageData['flash'], cookies: Cookies) {
	setFlashMessage(message, cookies)
	failSvelteKit(status)
}

export function redirect(
	status: number = 302,
	url: string = '/',
	message: App.PageData['flash'] | undefined = undefined,
	cookies: Cookies | undefined = undefined
): never {
	if (message && cookies) {
		setFlashMessage(message, cookies)
	} else if (message && !cookies) {
		throw new Error('Cookies are required to set flash message')
	}
	redirectSvelteKit(status, url)
}
