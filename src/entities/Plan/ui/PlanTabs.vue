<template>
	<TabsMain default-value="account">
		<TabsList>
			<TabsTrigger value="account">
				{{ t('collections') }}
			</TabsTrigger>
			<TabsTrigger value="password">
				{{ t('recipes') }}
			</TabsTrigger>
		</TabsList>
		<TabsContent value="account">
			<DragAndDrop :items="dragAndDropItems" />
		</TabsContent>
		<TabsContent value="password">
			Change your password here.
		</TabsContent>
	</TabsMain>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DragAndDrop } from 'shared/components/DragAndDrop'
import { DragTypes } from 'shared/components/DragAndDrop/types'
import { TabsMain, TabsContent, TabsList, TabsTrigger } from 'shared/components/ui/tabs'

import { useTranslation } from '@/shared/lib/i18n'
import Localization from './PlanTabs.localization.json'
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