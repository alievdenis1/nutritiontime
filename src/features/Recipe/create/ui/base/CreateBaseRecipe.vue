<script setup lang="ts">
import {
	createBaseRecipeModel,
	useBaseRecipeCreation
} from 'features/Recipe/create/model/base/use-base-recipe-creation.ts'
import {
	CreateBaseRecipeModel,
	useBaseRecipeCreationValidation
} from 'features/Recipe/create/model/base/use-base-recipe-creation-validation.ts'
import { createBaseRecipeCreationContext } from 'features/Recipe/create/model/base/use-base-recipe-creation-context.ts'
import { VAccordion } from 'shared/components/Accordion'
import type { Component } from 'vue'
import { useTranslation } from 'shared/lib/i18n'
import Localization from './CreateBaseRecipe.localization.json'
import {
	MainInfo,
	DifficultyAndSpiciness,
	CookingTime,
	IngredientsPart,
	NutritionalValue,
	KitchenwarePart, TagsPart, PerStepInstruction
} from './parts'
import { ButtonColors, VButton } from 'shared/components/Button'
import { IconArrowRight } from 'shared/components/Icon'
import { useRecipeCreationSteps } from 'features/Recipe/create/model/use-recipe-creation-steps.ts'
import CheckRecipe from 'features/Recipe/create/ui/check/CheckRecipe.vue'

const { t } = useTranslation(Localization)

const {
	save,
	isLoading
} = useBaseRecipeCreation()

const {
	errors,
	validateField,
	validate,
	values,
	isValid
} = useBaseRecipeCreationValidation(createBaseRecipeModel())

createBaseRecipeCreationContext({
	model: values,
	isLoading,
	validateField(data: { key: keyof CreateBaseRecipeModel }) {
		validateField(data.key)
	},
	errors
})

type Block = {
	id: number
	title: string
	component: Component
}

const blocks: Block[] = [
	{
		id: 1,
		title: t('basicInformation'),
		component: MainInfo
	},
	{
		id: 2,
		title: t('spicinessAndDifficulty'),
		component: DifficultyAndSpiciness
	},
	{
		id: 3,
		title: t('cookingTime'),
		component: CookingTime
	},
	{
		id: 4,
		title: t('ingredientsTitle'),
		component: IngredientsPart
	},
	{
		id: 5,
		title: t('nutritionalValueTitle'),
		component: NutritionalValue
	},
	{
		id: 8,
		title: t('stepByStep'),
		component: PerStepInstruction
	},
	{
		id: 6,
		title: t('kitchenware'),
		component: KitchenwarePart
	},
	{
		id: 7,
		title: t('tagsTitle'),
		component: TagsPart
	}
]

const {
	currentStep,
	goToNextStep,
	goToPreviousStep
} = useRecipeCreationSteps()

async function onSave() {
	validate()

	if (isValid.value) {
		await save(values)
	}
}
</script>

<template>
	<template v-if="currentStep === 'Creation'">
		<div class="relative flex flex-col gap-[16px] mt-[16px] mb-[62px]">
			<VAccordion
				v-for="(block, index) in blocks"
				:key="block.id"
				:title="block.title"
				:is-open="index === 0"
			>
				<component
					:is="block.component"
				/>
			</VAccordion>

			<div class="px-[16px] fixed bottom-[112px] left-0 w-full">
				<v-button
					:color="ButtonColors.Green"
					@click="goToNextStep"
				>
					<div class="flex gap-[12px] items-center">
						<div>{{ t('further') }}</div>
						<IconArrowRight icon-color="#ffffff" />
					</div>
				</v-button>
			</div>
		</div>
	</template>

	<template v-else-if="currentStep === 'Check'">
		<CheckRecipe
			creation-type="Base"
			@save="onSave"
			@back="goToPreviousStep"
		/>
	</template>
</template>

<style module>

</style>
