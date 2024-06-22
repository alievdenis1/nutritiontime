<template>
	<div>
		<plans-tab
			class="mb-8"
			@action="onSavedPlanActionButtonClicked"
			@update:label="handleParentLabelUpdate"
		/>
		<RecipesList v-if="selectedLabel == 'Коллекции' || selectedLabel === 'Collections'" />
		<ContentBlock
			v-else-if="selectedLabel == 'Мои рецепты' || selectedLabel === 'My recipes'"
			image="../../../../public/image/CatIllustration.png"
			:text="t('createdText')"
			:button-text="t('createdRecipe')"
			button-class="bg-[#FFA767] text-white flex-row-reverse"
			button-icon="green"
		/>
	</div>
</template>

<script setup lang="ts">
import { PlansTab, usePlansStore } from 'entities/Plan'
import { Plan } from 'entities/Plan/types'
import { ref } from 'vue'
import RecipesList from '@/entities/Recipes/ui/RecipesList.vue'
import { ContentBlock } from '@/shared/components/ContentBlock'

import { useTranslation } from '@/shared/lib/i18n'
import Localization from './Plan.localization.json'
const { t } = useTranslation(Localization)

const plansStore = usePlansStore()
plansStore.fetchSavedPlans()

const selectedPlan = ref<Plan | null>(null)
const isActionsDialogVisible = ref<boolean>(false)
const selectedLabel = ref<string>(t('collections'))

const onSavedPlanActionButtonClicked = (plan: Plan) => {
    selectedPlan.value = plan
	isActionsDialogVisible.value = true
}
const handleParentLabelUpdate = (label: string) => {
	selectedLabel.value = label
	console.log('Label received from ParentComponent:', label)
}

</script>

<style lang="scss" scoped></style>
