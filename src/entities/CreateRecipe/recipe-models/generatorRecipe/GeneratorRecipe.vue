<template>
	<div>
		<h2 class="text-lg font-semibold mb-4">
			{{ t('generateRecipeTitle') }}
		</h2>

		<div class="mb-[32px] relative">
			<span
				v-if="recipeIdea.length > 0"
				class="absolute text-[12px] top-[6px] left-[12px] text-gray"
			>
				{{ t('describeIdeaPlaceholder') }}
			</span>
			<textarea
				v-model="recipeIdea"
				:class="{ 'border-custom-red': isTextareaActive, 'padding-filled': recipeIdea.length > 0, 'padding-empty': recipeIdea.length === 0 }"
				placeholder="Опишите свою идею"
				class="w-full h-[120px] border-custom rounded-[4px] mb-[4px]"
			/>
			<p class="text-sm text-gray">
				{{ t('exampleIdea') }}
			</p>
		</div>

		<div class="space-y-4 mb-6">
			<router-link
				to=""
				class="flex justify-between items-center p-3 border-custom rounded-[8px] cursor-pointer p-[16px] h-[100px]"
			>
				<div>
					<h3 class="text-lg mb-[4px]">
						{{ t('readyIdeasTitle') }}
					</h3>
					<p class="text-sm text-slateGray">
						{{ t('readyIdeasDescription') }}
					</p>
				</div>
				<IconArrowRight
					icon-color="#1C1C1C"
					class="w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[8px]"
				/>
			</router-link>

			<router-link
				to=""
				class="flex justify-between items-center p-3 border-custom rounded-[8px] cursor-pointer p-[16px] h-[100px]"
			>
				<div>
					<h3 class="text-lg mb-[4px]">
						{{ t('generateByIngredientsTitle') }}
					</h3>
					<p class="text-sm text-slateGray">
						{{ t('generateByIngredientsDescription') }}
					</p>
				</div>
				<IconArrowRight
					icon-color="#1C1C1C"
					class="w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[8px]"
				/>
			</router-link>

			<VButton
				:color="ButtonColors.Green"
				@click="generateRecipe"
			>
				<div class="flex gap-[8px] items-center">
					<div>
						{{ t('generateButtonText') }}
					</div>
					<IconAi :icon-color="'#E1E1E1'" />
				</div>
			</VButton>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { IconArrowRight, IconAi } from 'shared/components/icon'
import { VButton, ButtonColors } from 'shared/components/Button'
import localization from './GeneratorRecipe.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

const { t } = useTranslation(localization)
const recipeIdea = ref('')
const isTextareaActive = ref(false)

const generateRecipe = () => {
    if (!recipeIdea.value.trim()) {
        isTextareaActive.value = true
    } else {
        isTextareaActive.value = false
    }
}
</script>

<style scoped>
.border-custom {
    border: 1px solid #1C1C1C0D;
}

.border-custom-red {
    border: 1px solid red;
}

.padding-filled {
    padding: 26px 0 10px 12px;
}

.padding-empty {
    padding: 12px;
}
</style>