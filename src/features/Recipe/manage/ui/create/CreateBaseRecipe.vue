<script setup lang="ts">
import {
	createBaseRecipeModel,
	useBaseRecipeCreation
} from 'features/Recipe/manage/model/use-base-recipe-creation.ts'
import {
	ManageBaseRecipeModel,
	useBaseRecipeValidation
} from 'features/Recipe/manage/model/use-manage-recipe-validation.ts'
import { VAccordion } from 'shared/components/Accordion'
import { useTranslation } from 'shared/lib/i18n'
import Localization from '../ManageRecipe.localization.json'
import { ButtonColors, VButton } from 'shared/components/Button'
import { IconArrowRight } from 'shared/components/Icon'
import { useRecipeCreationSteps } from 'features/Recipe/manage/model/use-recipe-creation-steps.ts'
import CheckRecipe from 'features/Recipe/manage/ui/check/CheckRecipe.vue'
import {
	createBaseRecipeManageContext,
} from 'features/Recipe/manage/model/use-manage-recipe-context.ts'
import { useManageRecipeBlocks } from 'features/Recipe/manage/ui/use-manage-recipe-blocks.ts'

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
} = useBaseRecipeValidation(createBaseRecipeModel())

createBaseRecipeManageContext({
	model: values,
	isLoading,
	validateField(data: { key: keyof ManageBaseRecipeModel }) {
		validateField(data.key)
	},
	errors
})

const {
	blocks
} = useManageRecipeBlocks()

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
