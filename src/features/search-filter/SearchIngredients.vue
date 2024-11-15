<template>
	<VAccordion :title="t('ingredients')">
		<div class="mt-4">
			<div v-if="selectedIngredients.length">
				<div class="flex flex-wrap gap-2 mb-4 p-4 border border-gray-200 rounded-lg">
					<div
						v-for="ingredient in selectedIngredients"
						:key="ingredient"
						class="flex items-center bg-gray-100 rounded-full px-4 py-2"
					>
						<span class="mr-2 text-sm">{{ ingredient }}</span>
						<button
							class="text-gray-400 hover:text-gray-600"
							@click="removeIngredient(ingredient)"
						>
							<IconClose class="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>

			<div
				v-else
				class="flex flex-wrap gap-2 mb-4 p-4 border border-gray-200 rounded-lg"
			>
				<span class="text-gray-400">
					{{ t('requiredIngredients') }}
				</span>
			</div>

			<button
				class="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-400 hover:bg-gray-50 focus:outline-none"
				@click="toggleExcludeMode"
			>
				{{ excludeMode ? t('includeIngredients') : t('excludeIngredients') }}
			</button>
		</div>
	</VAccordion>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VAccordion } from '@/shared/components/Accordion'
import { IconClose } from '@/shared/components/Icon'
import { useTranslation } from '@/shared/lib/i18n'
import localization from './SearchFilter.localization.json'

const { t } = useTranslation(localization)

const selectedIngredients = ref<string[]>(['Картошка', 'Сыр'])
const excludeMode = ref(false)

const removeIngredient = (ingredient: string) => {
    selectedIngredients.value = selectedIngredients.value.filter(item => item !== ingredient)
}

const toggleExcludeMode = () => {
    excludeMode.value = !excludeMode.value
}
</script>

<style scoped>
.border {
    border-color: #E5E7EB;
}

.bg-gray-100 {
    background-color: #F3F4F6;
}

.text-gray-400 {
    color: #9CA3AF;
}

.text-gray-600 {
    color: #4B5563;
}
</style>