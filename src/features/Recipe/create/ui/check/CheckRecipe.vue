<template>
	<div class="p-[16px]">
		<div class="flex items-center mb-[16px] min-h-[44px] relative">
			<span
				class="absolute hover:border hover:border-darkGray top-0 left-0 bottom-0 w-[44px] rounded-[100px] h-[44px] bg-white shadow-2xl cursor-pointer flex items-center justify-center"
				@click="onBackButtonClicked"
			>
				<IconArrowLeft />
			</span>

			<h2 class="flex-grow text-center text-lg text-darkGray">
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
				@click="onSave"
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
import { ButtonColors, VButton } from '@/shared/components/Button'
import localizations from './CheckRecipe.localization.json'
import { RecipeCreationVariants } from 'entities/Recipe/model/use-navigate-to-recipe-creation.ts'
import IconArrowLeft from 'shared/components/Icon/IconArrowLeft.vue'

const { t } = useTranslation(localizations)

const props = defineProps<{
	creationType: RecipeCreationVariants
}>()

const emit = defineEmits<{
	save: [],
	back: []
}>()

const titleText = computed(() => {
	return props.creationType === 'AI'
		? t('recipeReviewTitleAI')
		: t('recipeReviewTitle')
})

const subtitleText = computed(() => {
	return props.creationType === 'AI'
		? t('howUsersWillSeeAI')
		: t('howUsersWillSee')
})

const descriptionText = computed(() => {
	return props.creationType === 'AI'
		? t('reviewDescriptionAI')
		: t('reviewDescription')
})

const onSave = () => {
	emit('save')
}

function onBackButtonClicked() {
	emit('back')
}
</script>

<style scoped></style>
