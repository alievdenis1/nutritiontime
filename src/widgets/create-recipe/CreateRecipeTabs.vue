<template>
	<TabsMain :default-value="store.defaultValueTabs">
		<div class="flex justify-between items-center mb-[16px]">
			<button
				class="p-[12px] rotate-180 shadow-2xl bg-white rounded-[50%] shadow-custom cursor-pointer"
				@click="$router.go(-1)"
			>
				<IconArrowRight icon-color="#1C1C1C" />
			</button>
			<h2 class="text-center text-lg text-darkGray">
				{{ t('createRecipe') }}
			</h2>
			<div />
		</div>
		<TabsList>
			<TabsTrigger value="ownRecepie">
				{{ t('manualCreation') }}
			</TabsTrigger>
			<TabsTrigger
				value="aiRecepie"
				class="flex gap-[8px]"
			>
				{{ t('aiCreation') }}
				<IconAi :icon-color="'#E1E1E1'" />
			</TabsTrigger>
		</TabsList>
		<TabsContent
			value="ownRecepie"
			class="flex gap-[16px] flex-col mt-[16px] mb-[80px]"
		>
			<CreateRecipeBasicInfo />
			<CreateRecipeGradation />
			<CreateRecipeTime />
			<CreateRecipeIngredients />
			<CreateRecipeNutritional />
			<StepByStepRecipe />
			<KitchenToolsRecipe />
			<TagsRecipe />
			<v-button
				:color="ButtonColors.Green"
				@click="CheckRecipe"
			>
				<div class="flex gap-[12px] items-center">
					<div>{{ t('further') }}</div>
					<IconArrowRight icon-color="#FFFFFF" />
				</div>
			</v-button>
		</TabsContent>
		<TabsContent value="aiRecepie">
			gpt
		</TabsContent>
	</TabsMain>
</template>

<script setup lang="ts">
import { CreateRecipeTime } from 'entities/CreateRecipe/ui/timeRecipe'
import { CreateRecipeNutritional } from 'entities/CreateRecipe/ui/nutritionalRecipe'
import { CreateRecipeBasicInfo } from 'entities/CreateRecipe/ui/baseRecipe/Index'
import { TagsRecipe } from 'entities/CreateRecipe/ui/tagsRecipe'
import { StepByStepRecipe } from 'entities/CreateRecipe/ui/stepByStepRecipe'
import { CreateRecipeGradation } from 'entities/CreateRecipe/ui/gradationRecipe'
import { CreateRecipeIngredients } from 'entities/CreateRecipe/ui/IngredientsRecipe'
import { KitchenToolsRecipe } from 'entities/CreateRecipe/ui/kitchenToolsRecipe'
import { TabsMain, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { ButtonColors, VButton } from '@/shared/components/Button'
import { useModalCreateStore } from '@/entities/CreateRecipe/modal-create/model/model-store'
import { useTranslation } from '@/shared/lib/i18n'
import localizations from './CreateRecipeTabs.localization.json'
import { IconAi, IconArrowRight } from '@/shared/components/Icon'
const store = useModalCreateStore()
const { t } = useTranslation(localizations)

import { useRouter } from 'vue-router'

const router = useRouter()

const CheckRecipe = () => {
	router.push({ path: 'check-recipe' })
}
</script>

<style scoped></style>
