<template>
	<TabsMain
		v-model="mode"
		:default-value="RECIPE_CREATION_VARIANTS.BASE"
		class="p-[16px]"
	>
		<div class="flex justify-center items-center mb-[16px] min-h-[44px]">
			<h2 class="text-center text-lg text-darkGray">
				{{ t('createRecipe') }}
			</h2>
		</div>

		<TabsList>
			<TabsTrigger
				:value="RECIPE_CREATION_VARIANTS.BASE"
			>
				{{ t('manualCreation') }}
			</TabsTrigger>

			<TabsTrigger
				:value="RECIPE_CREATION_VARIANTS.AI"
				class="flex gap-[8px] items-center"
			>
				{{ t('aiCreation') }}
				<IconAi :icon-color="mode === 'AI' ? '#319A6E' : '#E1E1E1'" />
			</TabsTrigger>
		</TabsList>

		<TabsContent :value="RECIPE_CREATION_VARIANTS.BASE">
			<CreateBaseRecipe />
		</TabsContent>

		<TabsContent :value="RECIPE_CREATION_VARIANTS.AI">
			<CreateAi />
		</TabsContent>
	</TabsMain>
</template>

<script setup lang="ts">
import { TabsMain, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useTranslation } from '@/shared/lib/i18n'
import localizations from './CreateRecipeTabs.localization.json'
import { IconAi } from 'shared/components/Icon'
import { CreateBaseRecipe } from 'features/Recipe/create'
import { RecipeCreationVariants } from 'features/Recipe/create/model/creation-variants.ts'
import { RECIPE_CREATION_VARIANTS } from 'entities/Recipe/model/use-navigate-to-recipe-creation.ts'

const { t } = useTranslation(localizations)

const mode = defineModel<RecipeCreationVariants>('mode', { required: true })
</script>

<style scoped></style>
