import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalCreateStore = defineStore('modalCreate', () => {

    const isModalCreateOpen = ref<boolean>(false)
    const defaultValueTabs = ref<string>('ownRecepie')

    const openModalRecipe = () => {
        isModalCreateOpen.value = true
    }

    const closeModalRecipe = () => {
        isModalCreateOpen.value = false
    }

    return {
        isModalCreateOpen,
        defaultValueTabs,
        openModalRecipe,
        closeModalRecipe
    }
})