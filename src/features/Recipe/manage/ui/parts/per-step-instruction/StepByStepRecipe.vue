<template>
	<div class="pt-[20px]">
		<div
			v-for="(step, index) in model.steps"
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
				:initial-image="step.imageUrl"
				:error-message="t('errorMessage')"
				@upload:image="(imageUrl, imageFile) => onUploadStepImage(index, imageUrl, imageFile)"
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
</template>

<script setup lang="ts">
import { ref  } from 'vue'
import { VAddPhoto } from '@/shared/components/AddPhoto'
import { IconClose, IconPlus, IconPhoto } from 'shared/components/Icon'
import localization from './StepByStepRecipe.localization.json'
import { useTranslation } from '@/shared/lib/i18n'
import { useBaseRecipeManageContext } from 'features/Recipe/manage/model/use-manage-recipe-context.ts'

const { t } = useTranslation(localization)

const { model } = useBaseRecipeManageContext()

const isUploadError = ref<boolean>(false)

function addStep() {
	model.steps.push({
		description: '',
		image: null,
		imageUrl: ''
	})
}

function removeStep(index: number) {
	model.steps.splice(index, 1)
}

function onUploadStepImage(stepIndex: number, imageUrl: string | null, imageFile: Blob) {
	const exactStep = model.steps[stepIndex]

	if (exactStep) {
		exactStep.image = imageFile
		exactStep.imageUrl = imageUrl
	}
}
</script>

<style scoped>
textarea {
	resize: none;
	border: 1px solid #d1d5db;
}
</style>
