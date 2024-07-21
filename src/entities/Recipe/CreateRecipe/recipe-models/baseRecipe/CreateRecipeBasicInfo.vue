<template>
	<VAccordion :title="t('basicInformation')">
		<div class="mt-[20px]">
			<VAddPhoto
				:width-image="54"
				:height-image="54"
				:title="t('uploadMainPhoto')"
				:height-main="66"
				backgrounds="#F3F3F3"
				:icon="IconPhoto"
			/>
			<p class="text-xs text-gray max-w-xs mb-[24px]">
				{{ t('additionalPhotosInfo') }}
			</p>
			<div class="form-section flex flex-col gap-4">
				<input
					v-model="recipeTitle"
					type="text"
					:placeholder="t('recipeTitlePlaceholder')"
					class="border rounded px-2 py-4 text-base"
				>
				<textarea
					v-model="recipeDescription"
					:placeholder="t('recipeDescriptionPlaceholder')"
					class="border rounded px-2 py-4 text-base min-h-[122px]"
				/>
			</div>

			<div class="category-selection flex flex-col gap-[12px] mt-[12px]">
				<div
					class="border rounded px-2 py-4 cursor-pointer flex justify-between items-center text-gray"
					@click="openCategoryModal('dishCategory')"
				>
					<input
						v-model="selectedCategory.dishCategory"
						type="text"
						:placeholder="t('dishCategory')"
						readonly
					>
					<IconArrowRight icon-color="#1C1C1C" />
				</div>
				<div
					class="border rounded px-2 py-4 cursor-pointer flex justify-between items-center text-gray"
					@click="openCategoryModal('cuisine')"
				>
					<input
						v-model="selectedCategory.cuisine"
						type="text"
						:placeholder="t('cuisineNationality')"
						readonly
					>
					<IconArrowRight icon-color="#1C1C1C" />
				</div>
				<div
					class="border rounded px-2 py-4 cursor-pointer flex justify-between items-center text-gray"
					@click="openCategoryModal('diet')"
				>
					<input
						v-model="selectedCategory.diet"
						type="text"
						:placeholder="t('dietType')"
						readonly
					>
					<IconArrowRight icon-color="#1C1C1C" />
				</div>
			</div>
		</div>
	</VAccordion>

	<VModal
		:show="show"
		@close="show = false"
	>
		<div class="modal-content flex flex-col">
			<div class="flex justify-between items-center mb-[12px] border-b">
				<h2 class="text-xl">
					{{ categorySelectionTitle }}
				</h2>
				<button
					class="text-2xl w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[14px]"
					@click="show = false"
				>
					<IconClose icon-color="#1C1C1C" />
				</button>
			</div>
			<div class="relative">
				<input
					v-model="searchQuery"
					type="text"
					:placeholder="t('searchCategory')"
					class="border rounded p-[16px] text-base w-full mb-4"
				>
				<IconSearch
					icon-color="#1C1C1C"
					class="absolute top-[15px] right-[14px]"
				/>
			</div>

			<div class="category-list flex-1 overflow-y-auto">
				<div
					v-for="item in filteredCategories"
					:key="item"
					class="category-item p-2 border-b cursor-pointer flex items-center gap-[8px]"
					@click="selectCategory(item)"
				>
					<IconRadio icon-color="#ffffff" />{{ item }}
				</div>
			</div>
		</div>
	</VModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { IconArrowRight, IconSearch, IconClose, IconRadio, IconPhoto } from 'shared/components/Icon'
import { VAccordion } from '@/shared/components/Accordion'
import { VAddPhoto } from '@/shared/components/AddPhoto'
import { VModal } from '@/shared/components/Modal'
import localization from './CreateRecipeBasicInfo.localization.json'

interface Category {
	dishCategory: string;
	cuisine: string;
	diet: string;
}

const { t } = useTranslation(localization)
const show = ref(false)
const searchQuery = ref('')
const selectedType = ref<keyof Category | null>(null)
const selectedCategory = ref({
	dishCategory: '',
	cuisine: '',
	diet: ''
})
const categories = ref([
	'Категория 1',
	'Категория 2',
	'Категория 3',
	'Категория 4',
	'Категория 5',
	'Категория 6',
	'Категория 7',
	'Категория 8',
	'Категория 9',
	'Категория 10',
	'Категория 11',
	'Категория 12',
	'Категория 13',
	'Категория 14',
	'Категория 15',
	'Категория 16',
	'Категория 17',
	'Категория 18',
	'Категория 19',
	'Категория 20'
])

const recipeTitle = ref('')
const recipeDescription = ref('')

const filteredCategories = computed(() => {
	return categories.value.filter(category => category.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const categorySelectionTitle = computed(() => {
	const titles: Record<keyof Category, string> = {
		dishCategory: t('dishCategory'),
		cuisine: t('cuisineNationality'),
		diet: t('dietType')
	}

	return selectedType.value ? titles[selectedType.value] : ''
})

const openCategoryModal = (type: keyof Category) => {
	selectedType.value = type
	show.value = true
}

const selectCategory = (category: string) => {
	if (selectedType.value !== null) {
		selectedCategory.value[selectedType.value] = category
		show.value = false
	}
}

</script>

<style scoped>
textarea {
	border: 1px solid #d1d5db;
}
.border {
	border: 1px solid #E1E1E1;
}

.modal-content {
	height: 90vh;
	display: flex;
	flex-direction: column;
}

.category-list {
	max-height: calc(100vh - 200px);
	overflow-y: auto;
	scrollbar-color: #319A6E #E1E1E1;
	scrollbar-width: thin;
}

.category-item:hover {
	background-color: #f0f0f0;
}

.category-list::-webkit-scrollbar {
	width: 8px;
}

.category-list::-webkit-scrollbar-track {
	background: #E1E1E1;
}

.category-list::-webkit-scrollbar-thumb {
	background-color: #319A6E;
	border-radius: 10px;
}
</style>