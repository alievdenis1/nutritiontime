<template>
	<div class="flex flex-col p-[16px] pb-[86px] gap-[20px]">
		<div class="flex justify-center items-center min-h-[44px]">
			<h2 class="text-center text-lg text-darkGray">
				{{ t('editTitle') }}
			</h2>
		</div>
		<div class="flex flex-col gap-[16px]">
			<CreateRecipeBasicInfo />
			<CreateRecipeGradation />
			<CreateRecipeTime />
			<CreateRecipeIngredients
				:title="t('ingredientsTitle')"
				:desc="t('ingredientsDescription')"
			/>
			<CreateRecipeNutritional />
			<StepByStepRecipe />
			<KitchenToolsRecipe />
			<TagsRecipe />
		</div>
		<div class="fixed bottom-[20px] left-[16px] right-[16px] flex justify-between flex-col gap-[12px]">
			<VButton
				:color="ButtonColors.Green"
				class="mt-auto"
				@click="saveRecipe"
			>
				<div class="flex gap-[12px] items-center">
					<div> {{ t('further') }}</div>
					<IconArrowRight icon-color="#FFFFFF" />
				</div>
			</VButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useTranslation } from '@/shared/lib/i18n'
import {
	CreateRecipeBasicInfo,
	CreateRecipeGradation,
	CreateRecipeIngredients,
	KitchenToolsRecipe,
	CreateRecipeNutritional,
	StepByStepRecipe,
	TagsRecipe,
	CreateRecipeTime
} from 'entities/Recipe/CreateRecipe/recipe-models'
import { ButtonColors, VButton } from '@/shared/components/Button'
import { IconArrowRight } from '@/shared/components/Icon'
import localizations from './EditingRecipe.localization.json'

const router = useRouter()
const route = useRoute()
const { t } = useTranslation(localizations)

const saveRecipe = () => {
	router.push({ name: 'details-recipe', params: { id: route.params.id } })
}
</script>