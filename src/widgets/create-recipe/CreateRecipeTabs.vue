<template>
	<TabsMain
		v-model="activeTab"
		:default-value="store.defaultValueTabs"
		class="p-[16px]"
	>
		<div class="flex justify-center items-center mb-[16px] min-h-[44px]">
			<h2 class="text-center text-lg text-darkGray">
				{{ t('addRecipe') }}
			</h2>
		</div>
		<TabsList>
			<TabsTrigger
				value="ownRecepie"
			>
				{{ t('manualCreation') }}
			</TabsTrigger>
			<TabsTrigger
				value="aiRecepie"
				class="flex gap-[8px] items-center"
			>
				{{ t('aiCreation') }}
				<IconAi :icon-color="activeTab === 'aiRecepie' ? '#319A6E' : '#E1E1E1'" />
			</TabsTrigger>
		</TabsList>
		<TabsContent value="ownRecepie">
			<CreateOwn />
		</TabsContent>
		<TabsContent value="aiRecepie">
			<CreateAi />
		</TabsContent>
	</TabsMain>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CreateOwn, CreateAi } from 'features/create-recipe'
import { TabsMain, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useModalCreateStore } from 'entities/Recipe/CreateRecipe/modal-create/model/model-store'
import { useTranslation } from '@/shared/lib/i18n'
import localizations from './CreateRecipeTabs.localization.json'
import { IconAi } from 'shared/components/Icon'

const store = useModalCreateStore()
const { t } = useTranslation(localizations)

const activeTab = computed({
	get: () => store.defaultValueTabs,
	set: (value) => {
		store.defaultValueTabs = value
	}
})
</script>

<style scoped></style>