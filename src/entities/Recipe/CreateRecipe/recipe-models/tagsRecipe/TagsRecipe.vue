<template>
	<VAccordion :title="t('tagsTitle')">
		<div class="border custom-border flex items-center mt-5 rounded-md px-4 py-5">
			<div class="flex items-center flex-nowrap space-x-2 overflow-x-auto no-scrollbar">
				<div
					v-if="selectedTags.length === 0"
					class="flex items-center text-gray"
				>
					<span class="mr-1">{{ t('selectTag') }}</span>
				</div>
				<div
					v-for="tag in selectedTags"
					:key="tag"
					class="flex items-center gap-3.5 bg-lightGray rounded-full p-1 whitespace-nowrap px-3.5 py-2.5"
				>
					<span class="mr-1">{{ tag }}</span>
					<button
						class="bg-transparent border-none cursor-pointer text-lg"
						@click="removeTag(tag)"
					>
						<IconClose
							icon-color="#9F9FA0"
							class="w-5 h-5"
						/>
					</button>
				</div>
			</div>
			<button
				class="bg-transparent border-none text-2xl cursor-pointer ml-auto px-1"
				@click="openModal"
			>
				<IconArrowRight
					icon-color="#1C1C1C"
					class="w-6 h-6"
				/>
			</button>
		</div>
		<VModal
			:show="showModal"
			@close="closeModal"
		>
			<div class="h-[90vh] flex flex-col">
				<div class="flex justify-between mb-5">
					<h2 class="text-xl flex items-center">
						{{ t('addTagTitle') }}
					</h2>
					<div class="w-12 h-12 flex items-center justify-center bg-lightGray rounded-full">
						<IconClose
							class="w-6 h-6 cursor-pointer"
							icon-color="#9F9FA0"
							@click="closeModal"
						/>
					</div>
				</div>
				<div class="flex-grow overflow-y-auto custom-scrollbar">
					<div
						v-for="category in mockTags"
						:key="category.id"
					>
						<span class="font-medium">{{ category.name }}</span>

						<TagsCollectionsItem
							:categories-tags="category.list"
							:modal-selected-tags="modalSelectedTags"
							:chunk-amount="100"
							is-subtitle
							@tag-changed="handleTagChanged"
						/>
					</div>
				</div>
				<button
					:class="['block w-full mt-4 py-2 rounded-xl text-white text-center cursor-pointer', buttonClass]"
					:disabled="isButtonDisabled"
					@click="saveTags"
				>
					{{ t('addSelectedTag') }}
				</button>
			</div>
		</VModal>
	</VAccordion>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { mockTags } from '../mocks/mock-tags'
import { VAccordion } from '@/shared/components/Accordion'
import { VModal } from '@/shared/components/Modal'
import { useTranslation } from '@/shared/lib/i18n'
import localizations from './TagsRecipe.localization.json'
import { IconArrowRight, IconClose } from 'shared/components/Icon'
import TagsCollectionsItem from './TagsSelect.vue'
import { useRecipeStore } from '../../../DetailedCardRecipe/stores/recipeStore'
import { useRoute } from 'vue-router'

const { t } = useTranslation(localizations)
const store = useRecipeStore()
const route = useRoute()

const showModal = ref(false)
const selectedTags = ref<string[]>([])
const modalSelectedTags = ref<string[]>([])

onMounted(() => {
	loadTags()
})

const loadTags = () => {
	const recipeId = route.params.id as string
	const currentRecipe = store.recipes.find(recipe => recipe.id === recipeId)
	if (currentRecipe && currentRecipe.tags) {
		selectedTags.value = [...currentRecipe.tags]
		modalSelectedTags.value = [...currentRecipe.tags]
	}
}

const handleTagChanged = (updatedTags: string[]) => {
	modalSelectedTags.value = updatedTags
}

const openModal = () => {
	showModal.value = true
	modalSelectedTags.value = [...selectedTags.value]
}

const closeModal = () => {
	showModal.value = false
}

const removeTag = (tag: string) => {
	selectedTags.value = selectedTags.value.filter(t => t !== tag)
	updateRecipeTags()
}

const saveTags = () => {
	selectedTags.value = [...modalSelectedTags.value]
	updateRecipeTags()
	closeModal()
}

const updateRecipeTags = () => {
	const recipeId = route.params.id as string
	const currentRecipe = store.recipes.find(recipe => recipe.id === recipeId)
	if (currentRecipe) {
		currentRecipe.tags = [...selectedTags.value]
	}
}

const isButtonDisabled = computed(() => modalSelectedTags.value.length === 0)

const buttonClass = computed(() => {
	return modalSelectedTags.value.length > 0 ? 'bg-forestGreen' : 'bg-disabled cursor-not-allowed'
})

watch(() => route.params.id, () => {
	loadTags()
})
</script>

<style scoped>
.border {
	border: 1px solid #E1E1E1;
}

.overflow-x-auto {
	overflow-x: auto;
	display: flex;
	white-space: nowrap;
}

.no-scrollbar {
	-ms-overflow-style: none;
	/* IE and Edge */
	scrollbar-width: none;
	/* Firefox */
}

.no-scrollbar::-webkit-scrollbar {
	display: none;
	/* Safari and Chrome */
}

.custom-scrollbar {
	overflow-y: auto;
}

.custom-scrollbar::-webkit-scrollbar {
	width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
	@apply bg-lightGray;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
	@apply bg-forestGreen rounded;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	@apply bg-darkGray;
}
</style>
