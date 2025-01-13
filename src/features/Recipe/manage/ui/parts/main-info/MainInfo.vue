<template>
	<div class="pt-[20px]">
		<VAddPhoto
			v-model:error="isUploadError"
			:width-image="54"
			:height-image="54"
			:title="t('uploadMainPhoto')"
			:height-main="66"
			backgrounds="#F3F3F3"
			:icon="IconPhoto"
			:error-message="t('errorMessage')"
			@upload:image="onImageUpload"
		/>

		<p
			v-if="!isUploadError"
			class="text-xs text-gray max-w-xs mb-[24px]"
		>
			{{ t("additionalPhotosInfo") }}
		</p>

		<div class="form-section flex flex-col gap-4">
			<VInput
				v-model="model.title"
				name="title"
				:title="t('recipeTitlePlaceholder')"
				:error="!!errors?.title"
				:error-message="errors?.title?.message"
				:max-length="100"
				@focusout="validateField({ key: 'title' })"
			/>

			<VInput
				v-model="model.description"
				name="description"
				:title="t('recipeDescriptionPlaceholder')"
				textarea
				:error="!!errors?.description"
				:error-message="errors?.description?.message"
				:max-length="500"
				@focusout="validateField({ key: 'description' })"
			/>
		</div>

		<div class="category-selection flex flex-col gap-[12px] mt-[12px]">
			<span
				v-for="category in categoryKeys"
				:key="category"
			>
				<VInput
					v-model="texts[category]"
					:name="category"
					:title="t(category)"
					class="cursor-pointer"
					:error="!!errors?.[category]"
					:error-message="errors?.[category]?.message"
					readonly
					@click="openCategoryModal(category)"
					@focusout="validateField({ key: category })"
				>
					<template #right-icon>
						<IconArrowRight icon-color="#1C1C1C" />
					</template>
				</VInput>
			</span>
		</div>
	</div>

	<EditEntityModal
		v-model="isEditEntityModalVisible"
		:entity-key="selectedEntityToEdit"
		:selected-value="selectedEntityToEdit ? model[selectedEntityToEdit] : null"
		@update:selected-value="onEntityValueUpdated"
	/>
</template>

<script setup lang="ts">
import { computed, ComputedRef, reactive, ref } from 'vue'
import { useTranslation } from 'shared/lib/i18n'
import {
	IconArrowRight,
	IconPhoto,
} from 'shared/components/Icon'
import { VInput } from 'shared/components/Input'
import { VAddPhoto } from 'shared/components/AddPhoto'
import localization from './MainInfo.localization.json'
import { useBaseRecipeManageContext } from 'features/Recipe/manage/model/use-manage-recipe-context.ts'
import { ManageBaseRecipeModel } from 'features/Recipe/manage/model/use-manage-recipe-validation.ts'
import EditEntityModal from './EditEntityModal.vue'
import { useDietTypeList } from 'entities/DietType'
import { useCategoryList } from 'entities/Category'
import { useCuisineList } from 'entities/Cuisine'

const { t } = useTranslation(localization)

const { dietTypeList } = useDietTypeList()
const { categoryList } = useCategoryList()
const { cuisines } = useCuisineList()

const {
	model,
	errors,
	validateField
} = useBaseRecipeManageContext()

const dietTypeText = computed(() => dietTypeList.value.find(dietType => dietType.id === model.diet_type_id)?.name ?? '')
const categoryText = computed(() => categoryList.value.find(category => category.id === model.category_id)?.name ?? '')
const cuisineText = computed(() => cuisines.value.find(cuisine => cuisine.id === model.cuisine_id)?.name ?? '')

const texts = reactive<Record<CategoryKey, ComputedRef<string>>>({
	category_id: categoryText,
	cuisine_id: cuisineText,
	diet_type_id: dietTypeText
})

const categoryKeys = ['diet_type_id', 'category_id', 'cuisine_id'] as const satisfies (keyof ManageBaseRecipeModel)[]
type CategoryKey = (typeof categoryKeys)[number]

function onImageUpload(_: string, image: Blob) {
	model.image = image
}

const isUploadError = ref(false)

const isEditEntityModalVisible = ref(false)
const selectedEntityToEdit = ref<CategoryKey | null>(null)

function closeCategoryModal() {
	isEditEntityModalVisible.value = false
	selectedEntityToEdit.value = null
}

function openCategoryModal(key: CategoryKey) {
	selectedEntityToEdit.value = key
	isEditEntityModalVisible.value = true
}

function onEntityValueUpdated(value: ManageBaseRecipeModel[CategoryKey]) {
	if (!selectedEntityToEdit.value)
		return

	model[selectedEntityToEdit.value] = value
	closeCategoryModal()
}
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
</style>
