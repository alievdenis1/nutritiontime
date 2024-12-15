import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { DragTypes } from 'shared/components/DragAndDrop/types'
import {
  createCollection,
  deleteCollection as removeCollection,
  getCollectionList,
  getCollectionRecipes,
  updateCollection,
} from 'entities/Сollection/api'
import { Recipe } from 'entities/Recipe'

export const useModalStore = defineStore('modal', () => {
  const isModalOpen = ref<boolean>(false)
  const titleModal = ref<string>('')
  const descModal = ref<string>('')
  const inputValue = ref<string>('')
  const initialInputValue = ref<string>('')
  const collectionId = ref<number | null>(null)
  const savedCollections = ref<DragTypes[]>([])

  // TODO: мне понравилось - динамическое значение, надо забирать с бэка
  const collectionList = computed(() => {
    return [{ id: 0, name: 'Мне понравилось', isActiveEdit: false, count: 5 }].concat(savedCollections.value)
  })

  const currentCollection = computed(() =>
   savedCollections.value.find(item => item.id === collectionId.value)
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
      inputValue.value = currentCollection.value.name
      initialInputValue.value = currentCollection.value.name
    }
  }

  const closeModal = () => {
    isModalOpen.value = false
    collectionId.value = null
    inputValue.value = ''
  }

  const createCollectionApi = createCollection(() => ({
    name: inputValue.value
  }))

  const updateCollectionApi = updateCollection(() => ({
    id: collectionId.value,
    name: inputValue.value
  }))

  const saveCollection = async () => {
    if (inputValue.value.trim()) {
      if (collectionId.value === null) {
        await createCollectionApi.execute()

        if (createCollectionApi.data.value?.collection) {
          savedCollections.value.push(createCollectionApi.data.value.collection)
        }
      } else {
        await updateCollectionApi.execute()
        console.log(updateCollectionApi.data.value)

        const index = savedCollections.value.findIndex(item => item.id === collectionId.value)

        if (index !== -1) {
          savedCollections.value[index].name = inputValue.value.trim()
        }
      }
      closeModal()
    }
  }

  const deleteCollection = async () => {
    if (!collectionId.value) {
      return
    }

    const deleteCollectionApi = removeCollection(collectionId.value)
    await deleteCollectionApi.execute()

    const exactCollectionIndex = savedCollections.value
     .findIndex(item => item.id === collectionId.value)

    if (exactCollectionIndex !== -1) {
      savedCollections.value.splice(exactCollectionIndex, 1)
    }

    collectionId.value = null
  }

  const collectionListApi = getCollectionList()
  const isLoadingCollections = computed(() => collectionListApi.loading.value)
  const getCollections = async () => {
    await collectionListApi.execute()
    savedCollections.value = collectionListApi.data.value
  }

  const recipesByCollections = ref(new Map<number, Recipe[]>())

  const loadingCollectionsRecipesSet = ref(new Set<number>())

  const getCollectionRecipeList = async (id: number) => {
    const getCollectionRecipesApi = getCollectionRecipes(id)

    loadingCollectionsRecipesSet.value.add(id)
    await getCollectionRecipesApi.execute()

    if (getCollectionRecipesApi.data.value) {
      recipesByCollections.value.set(id, getCollectionRecipesApi.data.value)
    }

    loadingCollectionsRecipesSet.value.delete(id)
  }

  const getAllCollectionsRecipes = async (ids: number[]) => {
    await Promise.allSettled(ids.map(id => getCollectionRecipeList(id)))
  }

  return {
    isModalOpen,
    openModal,
    closeModal,
    titleModal,
    descModal,
    inputValue,
    initialInputValue,
    collectionList,
    saveCollection,
    savedCollections,
    deleteCollection,
    collectionId,
    currentCollection,

    getCollections,
    isLoadingCollections,
    getCollectionRecipeList,
    getAllCollectionsRecipes,
    recipesByCollections
  }
})
