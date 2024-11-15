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
				:items="store.dragAndDropItems"
				class="mt-[16px]"
				@edit="onEdit"
				@delete="onDelete"
				@adding="onAdding"
				@change="onChangeCollection"
			/>
			<RecipesList :recipes-data="recipesList" />
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
import { ref, onMounted } from 'vue'
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
const modalCreateStore = useModalCreateStore()

const store = useModalStore()
const { t } = useTranslation(Localization)
const recipesList = ref(mockRecipes)

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
		store.deleteCollection()
	}
}

const onAdding = () => {
	store.openModal('create')
}

const onChangeCollection = (id:number) => {
	recipesList.value = mockRecipes.filter(recipe => recipe.collectionId === id)
}

onMounted(() => {
	onChangeCollection(1)
})
</script>

<style lang="scss" scoped></style>