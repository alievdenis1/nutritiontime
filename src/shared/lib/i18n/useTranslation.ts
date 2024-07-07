import { computed } from 'vue'
import { useLocaleStore } from './store'
import type { LocaleMessages } from './types'

export function useTranslation<T extends LocaleMessages>(localization: T) {
	const store = useLocaleStore()

	const messages = computed(() => localization[store.currentLocale])

	const t = (key: keyof typeof messages.value, params?: Record<string, string | number>): string => {
		let message = messages.value[key]

		if (typeof message === 'string' && params) {
			message = message.replace(/\{\{(\w+)\}\}/g, (_, match) => {
				return params[match] !== undefined ? String(params[match]) : `{{${match}}}`
			})
		}

		return (typeof message === 'string')
			? message
			: key as string
	}

	return {
		t,
		messages
	}
}