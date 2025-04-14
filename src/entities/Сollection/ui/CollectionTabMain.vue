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
				:active-tab-key="store.collectionId"
				class="mt-[16px]"
				@edit="onEdit"
				@delete="onDelete"
				@adding="onAdding"
				@change="onCollectionSelected"
			/>

			<RecipesList
				:recipes-data="recipeList.data"
				:like-loading-states="likeLoadingStates"
			>
				<template #addToCollection="{ recipe }">
					<AddRecipeToCollectionButton
						:recipe="recipe"
						@click="onStartAddRecipeToCollectionFlow(recipe)"
					/>
				</template>

				<template #toggleFavourite="{ recipe }">
					<ToggleFavoriteButton
						v-model="recipe.is_favorited"
						:recipe-id="recipe.id"
						:likes="recipe.likes_count"
						@success="onRecipeSuccesfullyToggledFavourite"
					/>
				</template>
			</RecipesList>

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
			<RecipesList
				v-if="myRecipeList.length"
				v-loading="isLoadingMyRecipes"
				:recipes-data="myRecipeList"
				:like-loading-states="likeLoadingStates"
			>
				<template #addToCollection="{ recipe }">
					<AddRecipeToCollectionButton
						:recipe="recipe"
						@click="onStartAddRecipeToCollectionFlow(recipe)"
					/>
				</template>

				<template #toggleFavourite="{ recipe }">
					<ToggleFavoriteButton
						v-model="recipe.is_favorited"
						:recipe-id="recipe.id"
						:likes="recipe.likes_count"
						@success="onRecipeSuccesfullyToggledFavourite"
					/>
				</template>

				<template #deleteRecipe="{ recipe }">
					<DeleteRecipe
						:recipe-id="recipe.id"
						@recipe-deleted="onRecipeDeleted"
						@delete-error="onRecipeDeleteError"
					/>
				</template>
			</RecipesList>

			<VContentBlock
				v-else
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

	<EditCollection
		v-if="editCollectionDialogConfig.collection"
		:model-value="editCollectionDialogConfig.isVisible"
		:collection="editCollectionDialogConfig.collection"
		@update:model-value="onEditCollectionDialogClose"
		@success="onEditCollectionSuccess"
	/>

	<CreateCollection
		v-model="isCreateCollectionModalVisible"
		@success="onCreateCollectionSuccess"
	/>

	<AddRecipeToCollectionFlow
		ref="addRecipeToCollectionFlowRef"
		@success="onRecipeSuccessfullyAddedToCollection"
	/>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
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
import { useMyRecipeList } from 'entities/Recipe/model/use-my-recipe-list.ts'
import { ToggleFavoriteButton } from 'features/Recipe/toggle-favourite'
import AddRecipeToCollectionButton from 'features/Recipe/add-to-collection/ui/AddRecipeToCollectionButton.vue'
import AddRecipeToCollectionFlow from 'features/Recipe/add-to-collection/ui/AddRecipeToCollectionFlow.vue'
import { DeleteRecipe } from 'features/Recipe/delete/ui'
import { RecipeItem } from 'entities/Recipe/RecipesList'
import { Collection } from 'entities/Сollection/types/typesCollection.ts'
import { EditCollection } from 'features/Collection/edit'
import { CreateCollection } from 'features/Collection/create'

const queryClient = useQueryClient()

const modalCreateStore = useModalCreateStore()

const store = useModalStore()
const { t } = useTranslation(Localization)

const recipeStore = useRecipeStore()

const editCollectionDialogConfig = reactive<{
	isVisible: boolean,
	collection: Pick<Collection, 'id' | 'name'> | null
}>({
	isVisible: false,
	collection: null
})

const onEdit = (tab: DragTypes) => {
	editCollectionDialogConfig.collection = { id: tab.id, name: tab.label }
	editCollectionDialogConfig.isVisible = true
}

const onEditCollectionDialogClose = () => {
	editCollectionDialogConfig.collection = null
	editCollectionDialogConfig.isVisible = false
}

const isCreateCollectionModalVisible = ref(false)

const openCreateCollectionModal = () => {
	isCreateCollectionModalVisible.value = true
}

async function onEditCollectionSuccess(collection: Collection) {
	await store.getCollections()
}

async function onCreateCollectionSuccess(collection: Collection) {
	await store.getCollections()
}

const {
	myRecipeList,
	isLoadingMyRecipes
} = useMyRecipeList()

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
		await store.getCollections()
		await store.getAllCollectionsRecipes(store.collectionList.map(({ id }) => id))
	}
}

const onAdding = () => {
	openCreateCollectionModal()
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

async function onRecipeSuccesfullyToggledFavourite(data: { isFavourited: boolean, recipeId: number }) {
	/** Перезапрашиваем кэш */
	await Promise.all([
		await queryClient.invalidateQueries({
			queryKey: ['recipes/favourite'],
		}),
		await queryClient.invalidateQueries({
			queryKey: ['recipes/my']
		}),
		await store.getAllCollectionsRecipes(store.collectionList.map(({ id }) => id))
	])
}

const addRecipeToCollectionFlowRef = ref<InstanceType<typeof AddRecipeToCollectionFlow>>()

const onRecipeSuccessfullyAddedToCollection = async (data: { recipeId: number, collectionId: number }) => {
	await Promise.all([
		await queryClient.invalidateQueries({
			queryKey: ['recipes/my']
		}),
		await queryClient.invalidateQueries({
			queryKey: ['recipes/favourite'],
		}),
		await store.getCollections().then(() => store.getCollectionRecipeList(data.collectionId))
	])
}

const onStartAddRecipeToCollectionFlow = (recipe: RecipeItem) => {
	addRecipeToCollectionFlowRef.value?.start(recipe)
}

const onRecipeDeleted = async () => {
	await queryClient.invalidateQueries({
		queryKey: ['recipes/my']
	})
}

const onRecipeDeleteError = (error: any) => {
	ElMessage.error(error.message)
}
</script>

<style lang="scss" scoped></style>
