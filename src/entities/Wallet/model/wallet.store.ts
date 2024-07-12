import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWalletStore = defineStore('wallet', () => {

    const defaultValueTabs = ref<string>('balance')

    return {
        defaultValueTabs,
    }
})