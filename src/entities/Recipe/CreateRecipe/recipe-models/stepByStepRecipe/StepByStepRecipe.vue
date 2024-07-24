<template>
	<VAccordion :title="t('stepByStep')">
		<div class="mt-[20px]">
			<div
				v-for="(step, index) in steps"
				:key="index"
				class="step-container mb-4 rounded relative"
			>
				<div class="flex justify-between mb-[16px]">
					<h3>{{ t('step', { idx: index + 1 }) }}</h3>
					<button @click="removeStep(index)">
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
					:width-image="44"
					:height-image="44"
					:height-main="54"
					:title="t('uploadPhoto')"
					icon-color="#1C1C1C"
					backgrounds="#F3F3F3"
					:icon="IconPhoto"
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
import { ref } from 'vue'
import { VAccordion } from '@/shared/components/Accordion'
import { VAddPhoto } from '@/shared/components/AddPhoto'
import { IconClose, IconPlus, IconPhoto } from 'shared/components/Icon'
import localization from './StepByStepRecipe.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

const { t } = useTranslation(localization)

interface Step {
	description: string
	photo: string | null
}

const steps = ref<Step[]>([
	{ description: '', photo: null }
])

const addStep = () => {
	steps.value.push({ description: '', photo: null })
}

const removeStep = (index: number) => {
	steps.value.splice(index, 1)
}
</script>

<style scoped>
.step-container {
	background-color: #f9f9f9;
	position: relative;
}

textarea {
	resize: none;
	border: 1px solid #d1d5db;
}
</style>
