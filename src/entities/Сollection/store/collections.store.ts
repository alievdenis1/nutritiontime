import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { DragTypes } from 'shared/components/DragAndDrop/types'

export const useModalStore = defineStore('modal', () => {
  const isModalOpen = ref<boolean>(false)
  const titleModal = ref<string>('')
  const descModal = ref<string>('')
  const inputValue = ref<string>('')
  const initialInputValue = ref<string>('')
  const collectionId = ref<number | null>(null)
  const savedCollections = ref<DragTypes[]>(JSON.parse(localStorage.getItem('collections') || 'null'))

  const dragAndDropItems = ref<DragTypes[]>(
    savedCollections.value || [{ id: 1, label: 'Мне понравилось', isActiveEdit: false, count: 5 }]
  )

  const currentCollection = computed(() =>
    dragAndDropItems.value.find(item => item.id === collectionId.value)
  )

  const openModal = (mode: 'create' | 'edit') => {
    isModalOpen.value = true
    if (mode === 'create') {
      titleModal.value = 'Создание коллекции'
      descModal.value = 'В коллекцию можно добавлять рецепты с помощью иконки'
      inputValue.value = ''
      initialInputValue.value = ''
      collectionId.value = null
    } else if (mode === 'edit' && currentCollection.value) {
      titleModal.value = 'Редактирование коллекции'
      descModal.value = ''
      inputValue.value = currentCollection.value.label
      initialInputValue.value = currentCollection.value.label
    }
  }

  const closeModal = () => {
    isModalOpen.value = false
    collectionId.value = null
    inputValue.value = ''
  }

  const saveCollection = () => {
    if (inputValue.value.trim()) {
      if (collectionId.value === null) {
        const newId = Math.max(...dragAndDropItems.value.map(item => item.id), 0) + 1
        dragAndDropItems.value.push({
          id: newId,
          label: inputValue.value.trim(),
          isActiveEdit: true,
          count: 0
        })

        localStorage.setItem('collections', JSON.stringify(dragAndDropItems.value))
      } else {
        const index = dragAndDropItems.value.findIndex(item => item.id === collectionId.value)
        if (index !== -1) {
          dragAndDropItems.value[index].label = inputValue.value.trim()
        }
      }
      closeModal()
    }
  }

  const deleteCollection = () => {
      dragAndDropItems.value = dragAndDropItems.value.filter(item => item.id !== collectionId.value)
      localStorage.setItem('collections', JSON.stringify(dragAndDropItems.value))
      collectionId.value = null
  }

  return {
    isModalOpen,
    openModal,
    closeModal,
    titleModal,
    descModal,
    inputValue,
    initialInputValue,
    dragAndDropItems,
    saveCollection,
    deleteCollection,
    collectionId,
    currentCollection
  }
})