import { defineStore } from 'pinia'
import type { Locales } from './types'
import i18n from './i18n.config'
import { computed, ref , Ref, ComputedRef } from 'vue'

type State = {
	currentLocale: Ref<Locales>,
    selectedLocale: ComputedRef<Locales>,
    setLocale: (newLocale: Locales) => void,
    initializeLocale: (initialLocale?: Locales) => void
}

export const useLocaleStore = defineStore('locale', (): State => {
    const currentLocale = ref<Locales>('ru')

    const selectedLocale = computed((): Locales => currentLocale.value || 'ru')

    const setLocale = (newLocale: Locales): void => {
        currentLocale.value = newLocale
        i18n.global.locale.value = newLocale
    }

    const initializeLocale = (initialLocale?: Locales): void => {
        const initLocale = initialLocale || selectedLocale.value

        currentLocale.value = initLocale
        i18n.global.locale.value = initLocale
    }

    return {
        currentLocale,
        selectedLocale,
        setLocale,
        initializeLocale
    }
}, {
    persist: {
        storage: localStorage,
        paths: ['currentLocale']
    }
})
