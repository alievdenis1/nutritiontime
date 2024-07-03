<template>
	<div>
		<VAccordion :title="t('basicInformation')">
			<div class="recipe-form p-4">
				<div :class="['photo-upload mb-[8px]', { 'p-[8px]': uploadedImage, 'p-[24px]': !uploadedImage }]">
					<div
						v-if="uploadedImage"
						class="flex gap-[8px] items-center justify-center"
					>
						<img
							:src="uploadedImage"
							alt="Uploaded Photo"
							class="w-[54px] h-[54px] object-cover rounded"
						>
						<button
							class="p-2"
							@click.stop.prevent="removeImage"
						>
							<IconClose icon-color="#9F9FA0" />
						</button>
					</div>
					<label
						v-else
						class="photo-upload-label"
					>
						<input
							type="file"
							class="photo-upload-input"
							@change="handleFileUpload"
						>
						<div class="photo-upload-content flex items-center gap-2">
							<IconPhoto />
							<span class="text-xs">{{ t('uploadMainPhoto') }}</span>
						</div>
					</label>
				</div>
				<p class="text-xs text-gray-500 max-w-xs mb-[24px]">
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
						{{ t('categorySelection') }}
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
						v-for="item in categories"
						:key="item"
						class="category-item p-2 border-b cursor-pointer"
						@click="selectCategory(item)"
					>
						{{ item }}
					</div>
				</div>
			</div>
		</VModal>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { IconArrowRight, IconSearch, IconPhoto, IconClose } from '@/shared/components/Icon'
import { VAccordion } from '@/shared/components/Accordion'
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
const uploadedImage = ref<string | null>(null)

const handleFileUpload = (event: Event) => {
	const target = event.target as HTMLInputElement
	const files = target.files
	if (files && files[0]) {
		const reader = new FileReader()
		reader.onload = (e: ProgressEvent<FileReader>) => {
			uploadedImage.value = e.target?.result as string
		}
		reader.readAsDataURL(files[0])
	}
}

const removeImage = () => {
	uploadedImage.value = null
}

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
.border {
	border: 1px solid #E1E1E1;
}

.photo-upload {
	@apply bg-lightGray rounded-[16px] text-center cursor-pointer;
}

.photo-upload-label {
	@apply flex flex-col items-center;
}

.photo-upload-input {
	@apply hidden;
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