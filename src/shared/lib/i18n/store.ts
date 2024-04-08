import { defineStore } from 'pinia'
import type { Locales } from './types'
import { useI18n } from 'vue-i18n'

type State = {
	currentLocale: Locales
}

export const useLocaleStore = defineStore('locale', {
    state: (): State => ({
        currentLocale: 'ru',
    }),
    actions: {
        setLocale(newLocale: Locales) {
            this.currentLocale = newLocale
            const { locale } = useI18n()
            locale.value = newLocale
        },
        initializeLocale(initialLocale: Locales) {
            this.currentLocale = initialLocale
            const { locale } = useI18n()
            locale.value = initialLocale
        },
    },
})
