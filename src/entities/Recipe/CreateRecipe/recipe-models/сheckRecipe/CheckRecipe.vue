<template>
	<div class="p-[16px]">
		<div class="flex justify-center items-center mb-[16px] min-h-[44px]">
			<h2 class="text-center text-lg text-darkGray">
				{{ titleText }}
			</h2>
		</div>
		<div class="mb-4">
			<h2 class="text-base font-semibold mb-[12px]">
				{{ subtitleText }}
			</h2>
			<p class="text-slateGray text-sm">
				{{ descriptionText }}
			</p>
		</div>
		<div class="bg-lightGray mb-[66px] rounded-[16px] h-[450px] flex items-center justify-center flex-col">
			<div class="text-gray text-center text-xs">
				{{ t('recipeCardPlaceholderTop') }}
			</div>
			<div class="text-gray text-center text-xs">
				{{ t('recipeCardPlaceholderButton') }}
			</div>
		</div>
		<div class="fixed left-0 right-0 bottom-[112px] px-[16px]">
			<v-button
				:color="ButtonColors.Green"
				class="mt-auto"
			>
				<div class="flex gap-3 justify-center items-center w-full text-sm">
					<div>{{ t('createNftAndPublishRecipe') }}</div>
					<IconArrowRight icon-color="#FFFFFF" />
				</div>
			</v-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { IconArrowRight } from '@/shared/components/Icon'
import { ButtonColors } from '@/shared/components/Button'
import { VButton } from '@/shared/components/Button'
import localizations from './CheckRecipe.localization.json'
import { useRoute } from 'vue-router'

const route = useRoute()
const { t } = useTranslation(localizations)

// Определяем источник перехода
const source = computed(() => route.params.source || route.query.source || 'default')

const titleText = computed(() => {
	return source.value === 'ai' ? t('recipeReviewTitleAI') : t('recipeReviewTitle')
})

const subtitleText = computed(() => {
	return source.value === 'ai' ? t('howUsersWillSeeAI') : t('howUsersWillSee')
})

const descriptionText = computed(() => {
	return source.value === 'ai' ? t('reviewDescriptionAI') : t('reviewDescription')
})
</script>

<style scoped></style>