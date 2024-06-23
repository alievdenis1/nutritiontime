<template>
	<div class="tabs">
		<VTabs @update:label="handleTabChange">
			Коллекции
		</VTabs>
		<VTabs @update:label="handleTabChange">
			Мои рецепты
		</VTabs>
	</div>
	<DragAndDrop
		v-if="selectedLabel === 'Коллекции' || selectedLabel === 'Collections'"
		class="mt-[16px] mb-[24px]"
		:items="dragAndDropItems"
	/>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { VTabs } from 'shared/components/Tabs'
import { DragAndDrop } from 'shared/components/DragAndDrop'
import { DragTypes } from 'shared/components/DragAndDrop/types'
import { CategoriesTypes } from 'shared/components/Tabs/types'

import { useTranslation } from '@/shared/lib/i18n'
import Localization from './PlanTabs.localization.json'
const { t } = useTranslation(Localization)

const emit = defineEmits(['update:label'])
const selectedLabel = ref('Коллекции')

const handleTabChange = (label: string) => {
	selectedLabel.value = label
	emit('update:label', label)
}

const categoryTabs = ref<CategoriesTypes[]>([
	{ name: 'collections', label: t('collections'), isActiveTab: true },
	{ name: 'my-recipes', label: t('recipes'), isActiveTab: false }
])

const dragAndDropItems = ref<DragTypes[]>([
	{ id: 1, label: 'Мне понравилось', isActiveEdit: false, count: 5 },
	{ id: 2, label: 'Вкусняшки', isActiveEdit: true, count: 5 },
	{ id: 3, label: 'Красивое', isActiveEdit: true, count: 5 },
])

watchEffect(() => {
	const newTabs = [
		{ name: 'collections', label: t('collections'), isActiveTab: categoryTabs.value[0].isActiveTab },
		{ name: 'my-recipes', label: t('recipes'), isActiveTab: categoryTabs.value[1].isActiveTab }
	]

	categoryTabs.value = newTabs

	if (selectedLabel.value === 'Коллекции') {
		selectedLabel.value = t('collections')
	} else if (selectedLabel.value === 'Мои рецепты') {
		selectedLabel.value = t('recipes')
	}
})
</script>

<style scoped lang="scss">
.tabs {
	display: flex;
	justify-content: space-around;
	background-color: #f3f3f3;
	border-radius: 28px;
	padding: 8px;
	gap: 5px;
}
</style>