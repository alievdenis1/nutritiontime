<template>
	<div class="flex flex-col gap-[16px] mt-[16px] mb-[60px]">
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
	</div>
</template>

<script setup lang="ts">
import
{
	CreateRecipeBasicInfo,
	CreateRecipeGradation,
	CreateRecipeIngredients,
	KitchenToolsRecipe,
	CreateRecipeNutritional,
	StepByStepRecipe,
	TagsRecipe,
	CreateRecipeTime
}
	from
	'entities/CreateRecipe/recipe-models'
import { ButtonColors, VButton } from '@/shared/components/Button'
import { useRouter } from 'vue-router'
import { useTranslation } from '@/shared/lib/i18n'
import localizations from './CreateOwn.localization.json'

const router = useRouter()
const { t } = useTranslation(localizations)
const CheckRecipe = () => {
	router.push({ path: 'check-recipe' })
}
</script>

<style scoped>

</style>