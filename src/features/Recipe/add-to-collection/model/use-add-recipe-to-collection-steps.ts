import { ref } from 'vue'

export const STEPS = {
	SELECT: 'Select',
	CREATE_NEW: 'CreateNew'
}

export type AddRecipeToCollectionSteps = (typeof STEPS)[keyof typeof STEPS]

export const useAddRecipeToCollectionSteps = () => {
	const currentStep = ref<AddRecipeToCollectionSteps | null>(null)

	const init = () => {
		currentStep.value = STEPS.SELECT
	}

	const reset = () => {
		currentStep.value = null
	}

	const goToNextStep = () => {
		if (currentStep.value === STEPS.CREATE_NEW) {
			return
		}

		currentStep.value = STEPS.CREATE_NEW
	}

	const goToPreviousStep = () => {
		if (currentStep.value === STEPS.SELECT) {
			return
		}

		currentStep.value = STEPS.SELECT
	}

	return {
		currentStep,
		goToNextStep,
		goToPreviousStep,
		init,
		reset
	}
}
