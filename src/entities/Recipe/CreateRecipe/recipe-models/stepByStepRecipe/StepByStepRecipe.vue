<template>
	<VAccordion :title="t('stepByStep')">
		<div class="mt-[20px]">
			<div
				v-for="(step, index) in steps"
				:key="index"
				class="mb-4 rounded relative"
			>
				<div class="flex justify-between mb-[16px]">
					<h3>{{ t('step', { idx: index + 1 }) }}</h3>
					<button
						v-if="index !== 0"
						@click="removeStep(index)"
					>
						<IconClose
							icon-color="#9F9FA0"
							class="w-[12px] h-[12px] cursor-pointer"
						/>
					</button>
				</div>

				<div class="relative">
					<span
						v-if="step.description"
						class="absolute text-[12px] top-[12px] left-[12px] text-gray"
					>
						{{ t('stepDescription') }}
					</span>
					<textarea
						v-model="step.description"
						:placeholder="t('stepDescription')"
						class="w-full p-[12px] mb-2 rounded-[4px] h-[122px]"
						:class="{ 'pt-[32px] ': step.description.length > 0 }"
						@input="updateCookingSteps"
					/>
				</div>

				<VAddPhoto
					v-model:error="isUploadError"
					:width-image="44"
					:height-image="44"
					:height-main="54"
					:title="t('uploadPhoto')"
					backgrounds="#F3F3F3"
					:icon="IconPhoto"
					:initial-image="step.image"
					:on-image-uploaded="(imageUrl) => handleImageUpload(index, imageUrl)"
					:error-message="t('errorMessage')"
				/>
			</div>
			<button
				class="px-4 py-2 mt-4 text-white bg-forestGreen rounded-[16px] flex items-center gap-2 cursor-pointer w-full justify-center"
				@click="addStep"
			>
				{{ t('addStep') }}
				<IconPlus icon-color="#FFFFFF" />
			</button>
		</div>
	</VAccordion>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { VAccordion } from '@/shared/components/Accordion'
import { VAddPhoto } from '@/shared/components/AddPhoto'
import { IconClose, IconPlus, IconPhoto } from 'shared/components/Icon'
import localization from './StepByStepRecipe.localization.json'
import { useTranslation } from '@/shared/lib/i18n'
import { useRecipeStore } from '../../../DetailedCardRecipe/stores/recipeStore'

const { t } = useTranslation(localization)
const store = useRecipeStore()
const route = useRoute()

interface Step {
	description: string
	image: string | null
}

const steps = ref<Step[]>([])
const isUploadError = ref<boolean>(false)

const loadSteps = () => {
	const recipeId = route.params.id as string
	if (route.name === 'recipe-edit') {
		const currentRecipe = store.recipes.find(recipe => recipe.id === recipeId)
		if (currentRecipe && currentRecipe.cookingSteps) {
			steps.value = currentRecipe.cookingSteps.map(step => ({
				description: step.description,
				image: step.image || null
			}))
		}
	} else {
		steps.value = [{ description: '', image: null }]
	}
}

onMounted(() => {
	loadSteps()
})

watch(() => route.fullPath, () => {
	loadSteps()
})

const addStep = () => {
	steps.value.push({ description: '', image: null })
	updateCookingSteps()
}

const removeStep = (index: number) => {
	steps.value.splice(index, 1)
	updateCookingSteps()
}

const handleImageUpload = (stepIndex: number, imageUrl: string | null) => {
	steps.value[stepIndex].image = imageUrl
	updateCookingSteps()
}

const updateCookingSteps = () => {
	const recipeId = route.params.id as string
	const currentRecipe = store.recipes.find(recipe => recipe.id === recipeId)
	if (currentRecipe) {
		currentRecipe.cookingSteps = steps.value.map(step => ({
			description: step.description,
			image: step.image || ''
		}))
	}
}

watch(steps, () => {
	updateCookingSteps()
}, { deep: true })
</script>

<style scoped>
textarea {
	resize: none;
	border: 1px solid #d1d5db;
}
</style>