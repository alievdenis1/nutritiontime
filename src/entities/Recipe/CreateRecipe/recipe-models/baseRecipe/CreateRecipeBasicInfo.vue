<template>
	<VAccordion
		:title="t('basicInformation')"
		is-open
	>
		<div class="mt-[20px]">
			<VAddPhoto
				v-model:error="isUploadError"
				:width-image="54"
				:height-image="54"
				:title="t('uploadMainPhoto')"
				:height-main="66"
				backgrounds="#F3F3F3"
				:icon="IconPhoto"
				:initial-image="values.image"
				:error-message="t('errorMessage')"
				@upload:image="handleImageUpload"
			/>

			<p
				v-if="!isUploadError"
				class="text-xs text-gray max-w-xs mb-[24px]"
			>
				{{ t("additionalPhotosInfo") }}
			</p>

			<div class="form-section flex flex-col gap-4">
				<VInput
					v-model="values.title"
					name="title"
					:title="t('recipeTitlePlaceholder')"
					:error="!!errors?.title"
					:error-message="errors?.title?.message"
					:max-length="100"
					@focusout="validateField('title')"
				/>

				<VInput
					v-model="values.description"
					name="description"
					:title="t('recipeDescriptionPlaceholder')"
					textarea
					:error="!!errors?.description"
					:error-message="errors?.description?.message"
					:max-length="500"
					@focusout="validateField('description')"
				/>
			</div>

			<div class="category-selection flex flex-col gap-[12px] mt-[12px]">
				<span
					v-for="category in categoryKeys"
					:key="category"
				>
					<VInput
						v-model="values[category]"
						:title="t(category)"
						class="cursor-pointer"
						:error="!!errors?.[category]"
						:error-message="errors?.[category]?.message"
						readonly
						@click="openCategoryModal(category)"
						@focusout="validateField(category)"
					>
						<template #right-icon>
							<IconArrowRight icon-color="#1C1C1C" />
						</template>
					</VInput>
				</span>
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
				<VInput
					v-model="searchQuery"
					:title="t('searchCategory')"
					class="mb-4"
					clearable
				>
					<template #right-icon>
						<IconSearch icon-color="#1C1C1C" />
					</template>
				</VInput>
			</div>

			<div class="category-list flex-1 overflow-y-auto">
				<div
					v-for="item in filteredCategories"
					:key="item.id"
					class="category-item p-2 border-b cursor-pointer flex items-center gap-[8px]"
					@click="selectCategory(item)"
				>
					<IconRadio
						icon-color="#319a6e"
						:active="item === selectedListItem"
					/>
					{{ item }}
				</div>
			</div>
			<VButton
				class="mt-5"
				:disabled="isDisabled"
				@click="onSave"
			>
				{{ t("save") }}
			</VButton>
		</div>
	</VModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { createRecipeBasicInfoSchema } from 'features/create-recipe/model'
import { useForm } from 'shared/utils/useForm'
import {
	IconArrowRight,
	IconSearch,
	IconClose,
	IconRadio,
	IconPhoto,
} from 'shared/components/Icon'
import { VInput } from 'shared/components/Input'
import { VAccordion } from '@/shared/components/Accordion'
import { VAddPhoto } from '@/shared/components/AddPhoto'
import { VModal } from '@/shared/components/Modal'
import localization from './CreateRecipeBasicInfo.localization.json'
import { useRecipeStore } from '../../../DetailedCardRecipe/stores/recipeStore'
import { useRoute } from 'vue-router'
import { VButton } from '@/shared/components/Button'
import { Category, useCategoryList } from 'entities/Category'
import { Cuisine, useCuisineList } from 'entities/Cuisine'
import { DietType, useDietTypeList } from 'entities/DietType'

const store = useRecipeStore()
const route = useRoute()

const { t } = useTranslation(localization)

export type RecipeBasicInfoModel = {
	title: string;
	description: string;
	image: string;
	dishCategory: string;
	cuisine: string;
	diet: string;
};

const categoryKeys: (keyof RecipeBasicInfoModel)[] = [
	'dishCategory',
	'cuisine',
	'diet',
]

const emit = defineEmits<{
	change: [newModel: RecipeBasicInfoModel];
}>()

const show = ref(false)
const searchQuery = ref('')
const selectedType = ref<keyof RecipeBasicInfoModel | null>(null)
const isUploadError = ref<boolean>(false)

const { errors, values, validateField, validate } = useForm(
	createRecipeBasicInfoSchema,
	{
		defaultValues: {
			title: '',
			description: '',
			image: '',
			dishCategory: '',
			cuisine: '',
			diet: '',
		},
	},
)

watch(
	() => values,
	(newValues) => {
		emit('change', newValues)
	},
	{ deep: true },
)

const { categoryList, isLoadingCategories } = useCategoryList()
const { cuisines, isLoadingCuisines } = useCuisineList()
const { dietTypeList, isLoadingDietTypes, } = useDietTypeList()

const filteredCategories = computed(() => {
	return categoryList.value.filter((category) => {
		return category.name
			.toLowerCase()
			.includes(searchQuery.value.trim().toLowerCase())
	})
})

// TODO: функционал, который нужен будет для работы с конкретным разделом рецепта
// можно вынести в отдельный хук, и в общем компоненте останутся только хуки для конкретных частей рецептов
// функционал из них будет передаваться через пропсы внутрь feature

onMounted(() => {
	const isCreateRoute = route.name === 'CreateRecipe'

	if (!isCreateRoute && store.currentRecipe) {
		values.title = store.currentRecipe.title
		values.description = store.currentRecipe.description
		values.image = store.currentRecipe.image

		if (store.currentRecipe.recipeInfo) {
			(values.dishCategory = store.currentRecipe.recipeInfo['Категория'] || ''),
			(values.cuisine = store.currentRecipe.recipeInfo['Кухня'] || ''),
			(values.diet = store.currentRecipe.recipeInfo['Тип диеты'] || '')
		}
	}
})

const handleImageUpload = (imageUrl: string | null) => {
	if (imageUrl !== null) {
		values.image = imageUrl

		if (store.currentRecipe) {
			store.currentRecipe.image = imageUrl
		}
	} else {
		values.image = ''
	}
}

const categorySelectionTitle = computed(() => {
	const titles: Record<
	keyof Pick<RecipeBasicInfoModel, 'diet' | 'dishCategory' | 'cuisine'>,
	string
	> = {
		dishCategory: t('categorySelection'),
		cuisine: t('cuisineSelection'),
		diet: t('dietSelection'),
	}

	return selectedType.value ? titles[selectedType.value] : ''
})

const isDisabled = computed((): boolean => {
	return !selectedType.value
})

const openCategoryModal = (type: keyof RecipeBasicInfoModel) => {
	selectedType.value = type
	show.value = true
}

const closeModal = (): void => {
	searchQuery.value = ''
	show.value = false
}

const onSave = (): void => {
	closeModal()
	emit('change', values)
}

const selectCategory = (category: Category) => {
	if (selectedType.value !== null) {
		selectedItem.value[selectedType.value] = category
	}
}

const onValidate = (): boolean => {
	return validate()
}

defineExpose({ onValidate })

// Watch for changes and update store
watch(
	values,
	() => {
		if (store.currentRecipe) {
			store.currentRecipe.title = values.title
			store.currentRecipe.description = values.description
			store.currentRecipe.image = values.image

			if (store.currentRecipe.recipeInfo) {
				store.currentRecipe.recipeInfo['Категория'] = values.dishCategory
				store.currentRecipe.recipeInfo['Кухня'] = values.cuisine
				store.currentRecipe.recipeInfo['Тип диеты'] = values.diet
			}
		}
	},
	{ deep: true },
)
</script>

<style scoped>
textarea {
  border: 1px solid #d1d5db;
}

.border {
  border: 1px solid #e1e1e1;
}

.modal-content {
  height: 90vh;
  display: flex;
  flex-direction: column;
}

.category-list {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  scrollbar-color: #319a6e #e1e1e1;
  scrollbar-width: thin;
}

.category-item:hover {
  background-color: #f0f0f0;
}

.category-list::-webkit-scrollbar {
  width: 8px;
}

.category-list::-webkit-scrollbar-track {
  background: #e1e1e1;
}

.category-list::-webkit-scrollbar-thumb {
  background-color: #319a6e;
  border-radius: 10px;
}
</style>
