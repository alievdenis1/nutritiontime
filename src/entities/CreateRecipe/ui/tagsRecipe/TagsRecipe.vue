<template>
	<VAccordion :title="t('tagsTitle')">
		<div class="border flex items-center mt-[20px] rounded-md px-[16px] py-[18px]">
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
					class="flex items-center gap-[14px] bg-lightGray rounded-full p-1 whitespace-nowrap px-[14px] py-[10px]"
				>
					<span class="mr-1">{{ tag }}</span>
					<button
						class="bg-transparent border-none cursor-pointer text-lg"
						@click="removeTag(tag)"
					>
						<IconClose
							icon-color="#9F9FA0"
							class="w-[20px] h-[20px]"
						/>
					</button>
				</div>
			</div>
			<button
				class="bg-transparent border-none text-2xl cursor-pointer ml-auto px-[4px]"
				@click="openModal"
			>
				<IconArrowRight
					icon-color="#1C1C1C"
					class="w-[24px] h-[24px]"
				/>
			</button>
		</div>
		<VModal
			:show="showModal"
			@close="closeModal"
		>
			<div class="h-[90vh] flex flex-col">
				<div class="flex justify-between mb-[20px]">
					<h2 class="text-xl flex items-center">
						{{ t('addTagTitle') }}
					</h2>
					<div class="w-[48px] h-[48px] flex items-center justify-center bg-lightGray rounded-[50%]">
						<IconClose
							class="w-[24px] h-[24px] cursor-pointer"
							@click="closeModal"
						/>
					</div>
				</div>
				<div class="flex-grow overflow-y-auto custom-scrollbar">
					<div
						v-for="(category, index) in categories"
						:key="index"
						class="mb-[20px]"
					>
						<h3 class="mb-[15px] text-lg">
							{{ category.name }}
						</h3>
						<div class="flex flex-wrap gap-2">
							<button
								v-for="tag in category.tags"
								:key="tag"
								:class="['px-2 py-1 border rounded-full cursor-pointer', { 'bg-forestGreen ': modalSelectedTags.includes(tag), 'bg-lightGray': !modalSelectedTags.includes(tag) }]"
								@click="toggleTag(tag)"
							>
								{{ tag }}
							</button>
						</div>
					</div>
				</div>
				<button
					:class="['block w-full mt-4 py-2 rounded-[16px] text-white text-center cursor-pointer', { 'bg-forestGreen': modalSelectedTags.length > 0, 'bg-gray cursor-not-allowed': modalSelectedTags.length === 0 }]"
					:disabled="modalSelectedTags.length === 0"
					@click="saveTags"
				>
					{{ t('addSelectedTag') }}
				</button>
			</div>
		</VModal>
	</VAccordion>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VAccordion } from '@/shared/components/Accordion'
import { VModal } from '@/shared/components/Modal'
import { useTranslation } from '@/shared/lib/i18n'
import localizations from './TagsRecipe.localization.json'
import { IconArrowRight, IconClose } from '@/shared/components/Icon'

const { t } = useTranslation(localizations)

const showModal = ref(false)
const selectedTags = ref<string[]>([])
const modalSelectedTags = ref<string[]>([])

const categories = ref([
    { name: 'Категория 1', tags: ['#тег', '#тег1', '#тег2', '#тег3', '#тег4', '#тег5', '#тег6', '#тег7', '#тег8', '#тег9', '#тег10', '#тег11'] },
    { name: 'Категория 2', tags: ['#тег12', '#тег13', '#тег14', '#тег15', '#тег16', '#тег17', '#тег18', '#тег19', '#тег20', '#тег21', '#тег22', '#тег23'] },
    { name: 'Категория 3', tags: ['#тег24', '#тег25', '#тег26', '#тег27', '#тег28', '#тег29', '#тег30', '#тег31', '#тег32', '#тег33', '#тег34', '#тег35'] },
    { name: 'Категория 4', tags: ['#тег36', '#тег37', '#тег38', '#тег39', '#тег40', '#тег41', '#тег42', '#тег43', '#тег44', '#тег45', '#тег46', '#тег47'] },
    { name: 'Категория 5', tags: ['#тег48', '#тег49', '#тег50', '#тег51', '#тег52', '#тег53', '#тег54', '#тег55', '#тег56', '#тег57', '#тег58', '#тег59'] },
])

const openModal = () => {
    showModal.value = true
    modalSelectedTags.value = [...selectedTags.value]
}

const closeModal = () => {
    showModal.value = false
}

const toggleTag = (tag: string) => {
    if (modalSelectedTags.value.includes(tag)) {
        modalSelectedTags.value = modalSelectedTags.value.filter(t => t !== tag)
    } else {
        modalSelectedTags.value.push(tag)
    }
}

const removeTag = (tag: string) => {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
}

const saveTags = () => {
    selectedTags.value = [...modalSelectedTags.value]
    closeModal()
}
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
    background: #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #319A6E;
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555;
}

.bg-gray {
    background-color: #ccc;
}
</style>