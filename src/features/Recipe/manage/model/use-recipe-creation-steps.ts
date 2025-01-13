import { ref } from 'vue'

const RECIPE_CREATION_STEPS = {
	CREATION: 'Creation',
	CHECK: 'Check'
} as const satisfies Record<string, string>

type RecipeCreationStep = (typeof RECIPE_CREATION_STEPS)[keyof typeof RECIPE_CREATION_STEPS]

export const useRecipeCreationSteps = () => {
	const currentStep = ref<RecipeCreationStep>(RECIPE_CREATION_STEPS.CREATION)

	const goToNextStep = () => {
		if (currentStep.value === 'Check') {
			return
		}

		currentStep.value = 'Check'
	}

	const goToPreviousStep = () => {
		if (currentStep.value === 'Creation') {
			return
		}

		currentStep.value = 'Creation'
	}

	return {
		currentStep,
		goToNextStep,
		goToPreviousStep
	}
}
