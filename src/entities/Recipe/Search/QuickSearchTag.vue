<template>
	<div class="mt-[16px] mb-[12px]">
		<div class="flex items-center">
			<button
				class="flex items-center justify-center w-[88px] h-[40px] bg-forestGreen text-white rounded-[8px] px-[16px]"
				@click="openModal"
			>
				<span class="text-sm">{{ t('tags') }}</span>
				<IconTabs
					v-if="selectedTagsCount <= 0"
					icon-color="#FFFFFF"
					class="ml-[6px]"
				/>
				<div
					v-else
					class="ml-[6px] bg-orange text-white rounded-full px-2 py-1 text-xs"
				>
					{{ selectedTagsCount }}
				</div>
			</button>
			<div class="w-[2px] h-[40px] bg-lightGray ml-[12px] mr-[12px]" />
			<div class="flex-grow overflow-x-auto whitespace-nowrap scrollbar-hide">
				<div class="inline-flex space-x-2">
					<div
						v-for="tag in quickSearchTags"
						:key="tag.id"
						:class="getTagClasses(tag)"
						@click="selectQuickSearchTag(tag)"
					>
						{{ tag.name }}
						<button
							v-if="isTagActive(tag)"
							class="ml-2 text-forestGreen"
							@click.stop="deselectQuickSearchTag"
						>
							<IconClose
								class="w-[12px] h-[12px] cursor-pointer"
								:icon-color="'#319A6E'"
							/>
						</button>
					</div>
				</div>
			</div>
		</div>

		<VModal
			:show="showModal"
			@close="closeModal"
		>
			<div class="h-[90vh] flex flex-col">
				<div class="flex justify-between mb-5">
					<h2 class="text-xl flex items-center">
						{{ t('SearchByTag') }}
					</h2>
					<div class="w-12 h-12 flex items-center justify-center bg-lightGray rounded-full">
						<IconClose
							class="w-6 h-6 cursor-pointer"
							icon-color="#9F9FA0"
						/>
					</div>
				</div>

				<TagSelect
					v-loading="isLoadingTags"
					class="flex-grow overflow-y-auto custom-scrollbar"
					:model-value="selectedTags"
					@update:model-value="handleTagChanged"
				/>

				<button
					:class="['block w-full mt-4 py-2 rounded-xl text-white text-center cursor-pointer', buttonClass]"
					@click="closeModal"
				>
					<ElLoading v-if="store.isLoading" />
					{{ store.totalRecipes }} {{ t('addSelectedTag') }}
				</button>
			</div>
		</VModal>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { IconTabs, IconClose } from 'shared/components/Icon'
import { useTranslation } from 'shared/lib/i18n'
import localization from './QuickSearchTag.localization.json'
import { useSearchStore } from './store/search-store'
import { VModal } from 'shared/components/Modal'
// TODO: вынести эту папку Search отдельно
import { ElLoading } from 'element-plus'
import type { Tag } from 'entities/Tag/@x/Recipe'
import { TagSelect, useTagList } from 'entities/Tag'

const store = useSearchStore()
const { t } = useTranslation(localization)

const openModal = () => {
	showModal.value = true
}

const showModal = ref(false)
const selectedTags = ref<number[]>([])

const closeModal = () => {
	showModal.value = false
}

const handleTagChanged = (updatedTags: number[]) => {
	store.filters.tags = updatedTags
	store.searchRecipes()
}

const selectedTagsCount = computed(() => {
	return store.filters.tags?.length ?? 0
})

const buttonClass = computed(() => {
	return 'bg-forestGreen'
	// return selectedTags.value.length > 0 ? 'bg-forestGreen' : 'bg-disabled cursor-not-allowed'
})

onMounted(() => {
	selectedTags.value = store.filters.tags ?? []
})

const isTagActive = (tag: Tag) => {
	if (tag.category === 'quick_search') {
		return store.activeQuickSearchTag === tag.id
	}

	return store.filters.tags.includes(tag.id)
}

const quickSearchTags = ref<Tag[]>([
	{ id: 1, name: 'Из индейки', category: 'quick_search' },
	{ id: 2, name: 'Завтраки', category: 'quick_search' },
	{ id: 3, name: 'Обед', category: 'quick_search'  },
	{ id: 4, name: 'Ужин', category: 'quick_search'  },
	{ id: 5, name: 'Белковые', category: 'quick_search'  },
])

const getTagClasses = computed(() => (tag: Tag) => {
	return [
		'px-[16px] py-[10px] inline-flex items-center rounded-[100px] text-sm',
		isTagActive(tag)
			? 'bg-transparentGreen text-forestGreen'
			: 'bg-lightGray text-slateGray cursor-pointer'
	]
})

const selectQuickSearchTag = (selectedTag: Tag) => {
	store.activeQuickSearchTag = selectedTag.id
	store.searchRecipes()
}

const deselectQuickSearchTag = () => {
	store.activeQuickSearchTag = null
}
</script>

<style scoped>
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

</style>@/entities/Recipe/Search
