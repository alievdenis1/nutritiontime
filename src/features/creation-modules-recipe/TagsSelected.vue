<template>
	<div class="p-[16px] pb-[124px]">
		<div class="flex justify-center items-center mb-[16px] min-h-[44px]">
			<h2 class="text-center text-lg text-darkGray">
				{{ t('clarificationTitle') }}
			</h2>
		</div>
		<div class="mt-[22px] mb-[32px] flex flex-col gap-[12px]">
			<div class="text-lg text-darkGray">
				{{ t('clarificationSubtitle') }}
			</div>
			<div class="text-sm text-slateGray">
				{{ t('clarificationDescription') }}
			</div>
		</div>
		<TagsCollectionsItem
			:categories-tags="categories"
			:modal-selected-tags="modalSelectedTags"
			@tag-changed="handleTagChanged"
		/>
		<div class="fixed bottom-[20px] left-[16px] right-[16px] flex justify-between flex-col gap-[12px]">
			<button
				:color="ButtonColors.Green"
				class="flex-grow"
				:disabled="modalWatchTags"
				:class="['flex items-center justify-center block w-full px-[20px] h-[50px] rounded-xl text-white text-sm text-center cursor-pointer', buttonClass]"
				@click="TakingIntoMarked"
			>
				<div class="flex items-center gap-[4px]">
					<div>
						{{ t('generateWithSelected') }}
					</div>
					<IconAi
						v-if="!isSmallScreen"
						icon-color="#FFFFFF"
					/>
				</div>
			</button>
			<VButton
				:color="ButtonColors.White"
				class="flex-grow"
				@click="NoTakingIntoMarked"
			>
				{{ t('noThanks') }}
			</VButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { TagsCollectionsItem } from 'entities/Recipe/CreateRecipe/recipe-models'
import { VButton, ButtonColors } from 'shared/components/Button'
import { IconAi } from 'shared/components/Icon'
import { useRouter } from 'vue-router'

import { useTranslation } from '@/shared/lib/i18n'
import localizations from './TagsSelected.localization.json'

const { t } = useTranslation(localizations)

const router = useRouter()

const isSmallScreen = ref(window.innerWidth <= 350)

const modalSelectedTags = ref<string[]>([])

const modalWatchTags = computed(() => {
	return modalSelectedTags.value.length === 0
})

const buttonClass = computed(() => {
	return modalSelectedTags.value.length > 0 ? 'bg-forestGreen' : 'bg-disabled cursor-not-allowed'
})

const handleTagChanged = (updatedTags: string[]) => {
	modalSelectedTags.value = updatedTags
}

const TakingIntoMarked = () => {
	router.push('/select-recipe')
}

const NoTakingIntoMarked = () => {
	router.push('/select-recipe')
}

const categories = ref([
	{ name: 'Категория 1', tags: ['#тег', '#тег1', '#тег2', '#тег3', '#тег4', '#тег5', '#тег6', '#тег7', '#тег8', '#тег9', '#тег10', '#тег11'] },
	{ name: 'Категория 2', tags: ['#тег12', '#тег13', '#тег14', '#тег15', '#тег16', '#тег17', '#тег18', '#тег19', '#тег20', '#тег21', '#тег22', '#тег23'] },
	{ name: 'Категория 3', tags: ['#тег24', '#тег25', '#тег26', '#тег27', '#тег28', '#тег29', '#тег30', '#тег31', '#тег32', '#тег33', '#тег34', '#тег35'] },
	{ name: 'Категория 4', tags: ['#тег36', '#тег37', '#тег38', '#тег39', '#тег40', '#тег41', '#тег42', '#тег43', '#тег44', '#тег45', '#тег46', '#тег47'] },
	{ name: 'Категория 5', tags: ['#тег48', '#тег49', '#тег50', '#тег51', '#тег52', '#тег53', '#тег54', '#тег55', '#тег56', '#тег57', '#тег58', '#тег59'] },
])
</script>

<style scoped></style>