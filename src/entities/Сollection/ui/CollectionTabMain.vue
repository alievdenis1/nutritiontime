<template>
	<TabsMain
		default-value="collections"
		class="p-[16px]"
	>
		<TabsList>
			<TabsTrigger value="collections">
				{{ t('collections') }}
			</TabsTrigger>
			<TabsTrigger value="recipes">
				{{ t('recipes') }}
			</TabsTrigger>
		</TabsList>
		<TabsContent value="collections">
			<VDragAndDrop
				:items="collectionListForDragAndDrop"
				class="mt-[16px]"
				@edit="onEdit"
				@delete="onDelete"
				@adding="onAdding"
				@change="onCollectionSelected"
			/>

			<RecipesList
				:recipes-data="recipeList.data"
				:like-loading-states="likeLoadingStates"
				@toggle-like="onToggleRecipeLike($event, store.collectionId)"
				@change-collection="onToggleRecipeCollection($event, store.collectionId)"
			/>

			<VContentBlock
				v-if="mockRecipes.length === 0"
				:image="addPrefix('/image/start-screen-image.webp')"
				:text="t('liked')"
				:button-text="t('buttonCollection')"
				button-class="bg-forestGreen text-white"
				:button-icon="IconArrowRight"
			/>
		</TabsContent>
		<TabsContent value="recipes">
			<VContentBlock
				class="mt-[65px] mb-[80px]"
				:image="addPrefix('/image/CatIllustration.png')"
				:text="t('create')"
				:button-text="t('buttonCreate')"
				button-class="bg-orange text-white flex-row-reverse"
				:button-icon="IconPlus"
				@button-click="openModalCreateRecipe"
			/>
		</TabsContent>
	</TabsMain>
	<ModalCollection />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import RecipesList from '../../Recipe/RecipesList/RecipesList.vue'
import { VContentBlock } from 'shared/components/ContentBlock'
import { mockRecipes, addPrefix } from '../mocks/mock-recipes'
import { useTranslation } from '@/shared/lib/i18n'
import { TabsMain, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import Localization from './Collection.localization.json'
import { VDragAndDrop, DragTypes } from 'shared/components/DragAndDrop'
import { openConfirm } from 'shared/components/Confirm'
import { IconArrowRight, IconPlus, } from 'shared/components/Icon'
import { useModalStore } from '../store/collections.store'
import ModalCollection from '../../Сollection/modal/ModalCollection.vue'

import { useModalCreateStore } from '../../Recipe/CreateRecipe/modal-create/model/model-store'
import { useRecipeStore } from 'entities/Recipe/DetailedCardRecipe'
import { toggleFavourite } from 'entities/Recipe/api'
import { useQueryClient } from '@tanstack/vue-query'
import { ElMessage } from 'element-plus'
import { useRecipeLikeStore } from 'entities/Recipe/model/use-recipe-like-store.ts'

const queryClient = useQueryClient()

const modalCreateStore = useModalCreateStore()

const store = useModalStore()
const { t } = useTranslation(Localization)

const recipeStore = useRecipeStore()

const onEdit = (tab: DragTypes) => {
	store.collectionId = tab.id
	store.openModal('edit')
}

const openModalCreateRecipe = () => {
	modalCreateStore.openModalRecipe()
}

const onDelete = async (tab: DragTypes) => {
	store.collectionId = tab.id
	const isConfirmed = await openConfirm({
		title: t('confirmTitle'),
		description: t('confirmDescription'),
		confirmButtonText: t('confirmButton'),
	})

	if (isConfirmed) {
		await store.deleteCollection()
	}
}

const onAdding = () => {
	store.openModal('create')
}

// const onChangeCollection = (id:number) => {
//   if (store.savedCollections?.length) {
//    recipesList.value = store.savedCollections.filter(recipe => recipe.collectionId === id)
//   }
// }
const recipeList = computed(() => {
	if (typeof store.collectionId !== 'number') {
		return { data: recipeStore.recipes }
	}

	if (store.collectionId === 0) {
		return { data: recipeStore.favouriteRecipes }
	}

	return store.recipesByCollections.get(store.collectionId) ?? { data: [] }
})

const collectionListForDragAndDrop = computed(() => {
	return (store.collectionList)
		.filter(Boolean)
		.map(({ id, name }) => ({ id, label: name, isActiveEdit: true }))
})

onMounted(() => {
	store.getCollections().then(() => {
		if (store.savedCollections?.length > 0) {
			store.getAllCollectionsRecipes(store.savedCollections.map(({ id }) => id))
		}
	})
})

const onCollectionSelected = (id: number) => {
	store.collectionId = id
}

const likeStore = useRecipeLikeStore()

const likeLoadingStates = computed(() => {
	return new Set([...likeStore.recipesWithPendingLike.keys()])
})

async function onToggleRecipeLike(recipeId: number, collectionId: number) {
	await likeStore.likeRecipe(recipeId)

	/** Перезапрашиваем кэш */
	await Promise.all([
		await queryClient.invalidateQueries({
			queryKey: ['recipes/favourite'],
		}),
		await store.getAllCollectionsRecipes(store.collectionList.map(({ id }) => id))
	])
}

async function onToggleRecipeCollection(recipeId: number) {
	modalCreateStore.openModalRecipe()
}
</script>

<style lang="scss" scoped></style>
