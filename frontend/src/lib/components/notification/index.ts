import type { Page } from '@sveltejs/kit'
import { toast } from 'svelte-sonner'

export function addToast(type: 'success' | 'error' | 'info', message: string): void {
	// first letter uppercase
	let upperType = type.charAt(0).toUpperCase() + type.slice(1)
	if (type === 'success') {
		toast.success(upperType, {
			description: message
		})
	} else if (type === 'error') {
		toast.error(upperType, {
			description: message
		})
	} else if (type === 'info') {
		toast.info(upperType, {
			description: message
		})
	} else {
		toast(upperType), {
			description: message
		}
	}
}

export function monitorFlash(page: Page): void {
	const flash = page.data.flash
	if (flash) {
		addToast(flash.type, flash.message)
		page.data.flash = undefined
	}
}
