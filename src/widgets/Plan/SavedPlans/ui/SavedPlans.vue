<template>
	<div>
		<plans-tab
			class="mb-8"
			@action="onSavedPlanActionButtonClicked"
			@update:label="handleParentLabelUpdate"
		/>
		<RecipesList v-if="selectedLabel == 'Коллекции'" />
		<ContentBlock
			v-else-if="selectedLabel == 'Мои рецепты'"
			image="../../../../public/image/CatIllustration.png"
			text="Здесь будут храниться рецепты, которые вы создали"
			button-text="Создать свой рецепт"
			button-class="bg-[#FFA767] text-white flex-row-reverse"
			button-icon="green"
		/>
	</div>
</template>

<script setup lang="ts">
import { PlansTab, usePlansStore } from 'entities/Plan'
import { Plan } from 'entities/Plan/types'
import { ref } from 'vue'
import RecipesList from '../../../../entities/Recipes/ui/RecipesList.vue'
import { ContentBlock } from '@/shared/components/ContentBlock'
const plansStore = usePlansStore()
plansStore.fetchSavedPlans()

const selectedPlan = ref<Plan | null>(null)
const isActionsDialogVisible = ref<boolean>(false)
const selectedLabel = ref<string>('Коллекции')

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
