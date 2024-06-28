<template>
	<TabsMain default-value="collections">
		<TabsList>
			<TabsTrigger value="collections">
				{{ t('collections') }}
			</TabsTrigger>
			<TabsTrigger value="recipes">
				{{ t('recipes') }}
			</TabsTrigger>
		</TabsList>
		<TabsContent value="collections">
			<DragAndDrop :items="dragAndDropItems" />
			<RecipesList :recipes-data="mockRecipes" />
			<ContentBlock
				v-if="mockRecipes.length === 0"
				:image="addPrefix('/image/start-screen-image.webp')"
				:text="t('liked')"
				:button-text="t('buttonCollection')"
				button-class="bg-green-500 text-white"
				:button-icon="IconArrowRight"
			/>
		</TabsContent>
		<TabsContent value="recipes">
			<ContentBlock
				class="mt-[65px]"
				:image="addPrefix('/image/CatIllustration.png')"
				:text="t('create')"
				:button-text="t('buttonCreate')"
				button-class="bg-orange text-white flex-row-reverse"
				:button-icon="IconPlus"
			/>
		</TabsContent>
	</TabsMain>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RecipesList from 'entities/Recipe/ui/RecipesList.vue'
import { ContentBlock } from 'shared/components/ContentBlock'
import { mockRecipes, addPrefix } from '../mocks/mock-recipes'
import { useTranslation } from '@/shared/lib/i18n'
import Localization from './Collection.localization.json'
import { DragAndDrop } from 'shared/components/DragAndDrop'
import { DragTypes } from 'shared/components/DragAndDrop/types'
import { TabsMain, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { IconArrowRight, IconPlus } from '@/shared/components/Icon'

const { t } = useTranslation(Localization)

const dragAndDropItems = ref<DragTypes[]>([
    { id: 1, label: 'Мне понравилось', isActiveEdit: false, count: 5 },
    { id: 2, label: 'Вкусняшки', isActiveEdit: true, count: 5 },
    { id: 3, label: 'Красивое', isActiveEdit: true, count: 5 },
    { id: 4, label: 'Красивое', isActiveEdit: true, count: 5 },
    { id: 5, label: 'Красивое', isActiveEdit: true, count: 5 },
    { id: 6, label: 'Красивое', isActiveEdit: true, count: 5 },
])
</script>

<style lang="scss" scoped></style>