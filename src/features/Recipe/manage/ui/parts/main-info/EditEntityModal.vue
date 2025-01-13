<script setup lang="ts">
import { VButton } from 'shared/components/Button'
import { VInput } from 'shared/components/Input'
import { IconClose, IconRadio, IconSearch } from 'shared/components/Icon'
import { VModal } from 'shared/components/Modal'
import { computed, ref, watch } from 'vue'
import { useTranslation } from 'shared/lib/i18n'
import Localization from './MainInfo.localization.json'
import { useCategoryList } from 'entities/Category'
import { useCuisineList } from 'entities/Cuisine'
import { useDietTypeList } from 'entities/DietType'
import { softFilterBySearchQuery } from 'shared/lib/mapping/filtering.ts'

type EntityKey = 'diet_type_id' | 'cuisine_id' | 'category_id'

type Value = Entities[number]['id']

const props = defineProps<{
	entityKey: EntityKey | null
	selectedValue: Value | null
}>()

const value = ref<Value | null>(props.selectedValue)

watch(() => props.selectedValue, (nV) => {
	value.value = nV
})

const isVisible = defineModel<boolean>({ required: true })

const searchQuery = ref('')

const emit = defineEmits<{
	'update:selectedValue': [value: Value]
}>()

const { categoryList, isLoadingCategories } = useCategoryList()
const { cuisines, isLoadingCuisines } = useCuisineList()
const { dietTypeList, isLoadingDietTypes } = useDietTypeList()

const isLoadingEntity = computed(() => {
	return isLoadingCuisines.value
      || isLoadingCategories.value
      || isLoadingDietTypes.value
})

type Entities = typeof categoryList.value
    | typeof cuisines.value
    | typeof dietTypeList.value

const filteredEntities = computed<Entities>(() => {
	if (props.entityKey === 'category_id') {
		return softFilterBySearchQuery({
			data: categoryList.value,
			key: 'name',
			query: searchQuery.value
		})
	}

	if (props.entityKey === 'diet_type_id') {
		return softFilterBySearchQuery({
			data: dietTypeList.value,
			key: 'name',
			query: searchQuery.value
		})
	}

	if (props.entityKey === 'cuisine_id') {
		return softFilterBySearchQuery({
			data: cuisines.value,
			key: 'name',
			query: searchQuery.value
		})
	}

	return []
})

const close = () => {
	isVisible.value = false
	searchQuery.value = ''
	value.value = null
}

const { t } = useTranslation(Localization)

const title = computed(() => {
	if (props.entityKey === 'category_id') {
		return t('categorySelection')
	}

	if (props.entityKey === 'cuisine_id') {
		return t('cuisineSelection')
	}

	if (props.entityKey === 'diet_type_id') {
		return t('dietSelection')
	}

	return ''
})

function selectEntity(item: Entities[number]) {
	// emit('update:selectedValue', item.id)
	value.value = item.id
}

const isSaveDisabled = computed(() => {
	return !value.value
})

function onSave() {
	if (!value.value) {
		return
	}

	emit('update:selectedValue', value.value)
	close()
}
</script>

<template>
	<VModal
		v-loading="isLoadingEntity"
		:show="isVisible"
		@close="close"
	>
		<div class="modal-content flex flex-col">
			<div class="flex justify-between items-center mb-[12px] border-b">
				<h2 class="text-xl">
					{{ title }}
				</h2>
				<button
					class="text-2xl w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[14px]"
					@click="close"
				>
					<IconClose icon-color="#1C1C1C" />
				</button>
			</div>
			<div class="relative">
				<VInput
					v-model="searchQuery"
					name="category"
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
					v-for="item in filteredEntities"
					:key="item.id"
					class="category-item p-2 border-b cursor-pointer flex items-center gap-[8px]"
					@click="selectEntity(item)"
				>
					<IconRadio
						icon-color="#319a6e"
						:active="item.id === value"
					/>
					{{ item.name }}
				</div>
			</div>
			<VButton
				class="mt-5"
				:disabled="isSaveDisabled"
				@click="onSave"
			>
				{{ t("save") }}
			</VButton>
		</div>
	</VModal>
</template>

<style scoped>
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
