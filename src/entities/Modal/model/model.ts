import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('features', () => {

    const isModalCreateOpen = ref(false)

    const openModal = () => {
        isModalCreateOpen.value = true
    }

    const closeModal = () => {
        isModalCreateOpen.value = false
    }

    return {
        isModalCreateOpen,
        openModal,
        closeModal
    }
})