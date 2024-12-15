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
				<TagsCollectionsItem
					class="flex-grow overflow-y-auto custom-scrollbar"
					:categories-tags="tagsByCategories"
					:modal-selected-tags="modalSelectedTags"
					@tag-changed="handleTagChanged"
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
import TagsCollectionsItem  from '../CreateRecipe/recipe-models/tagsRecipe/TagsCollectionsItem.vue'
// TODO: вынести эту папку Search отдельно
import { getCategoryList, CategoryList, Category } from '@/entities/Category'
import { ElLoading } from 'element-plus'
import { getTagList, type Tag } from 'entities/Tag/@x/Recipe'

const store = useSearchStore()
const { t } = useTranslation(localization)
const openModal = () => {
	showModal.value = true
}
// interface Tag {
//     id: number;
//     text: string;
//     isActive: boolean;
// }
const showModal = ref(false)
const modalSelectedTags = ref<string[]>([])
const categoryList = ref<CategoryList>([])
const tagList = ref<Tag[]>([])

const closeModal = () => {
	showModal.value = false
}

const handleTagChanged = (updatedTags: string[]) => {
 store.filters.tags = updatedTags
 store.searchRecipes()
}

const selectedTagsCount = computed(() => {
 return store.filters.tags.length ?? 0
})

const buttonClass = computed(() => {
 return 'bg-forestGreen'
	// return modalSelectedTags.value.length > 0 ? 'bg-forestGreen' : 'bg-disabled cursor-not-allowed'
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

// const categories = ref([
// 	{ name: 'Категория 1', tags: ['#тег', '#тег1', '#тег2', '#тег3', '#тег4', '#тег5', '#тег6', '#тег7', '#тег8', '#тег9', '#тег10', '#тег11'] },
// 	{ name: 'Категория 2', tags: ['#тег12', '#тег13', '#тег14', '#тег15', '#тег16', '#тег17', '#тег18', '#тег19', '#тег20', '#тег21', '#тег22', '#тег23'] },
// 	{ name: 'Категория 3', tags: ['#тег24', '#тег25', '#тег26', '#тег27', '#тег28', '#тег29', '#тег30', '#тег31', '#тег32', '#тег33', '#тег34', '#тег35'] },
// 	{ name: 'Категория 4', tags: ['#тег36', '#тег37', '#тег38', '#тег39', '#тег40', '#тег41', '#тег42', '#тег43', '#тег44', '#тег45', '#тег46', '#тег47'] },
// 	{ name: 'Категория 5', tags: ['#тег48', '#тег49', '#тег50', '#тег51', '#тег52', '#тег53', '#тег54', '#тег55', '#тег56', '#тег57', '#тег58', '#тег59'] },
// ])

const tagsByCategories = computed(() => {
 return categoryList.value.reduce((acc, category) => {
  const tags = tagList.value.filter(tag => tag.category === category.name)

  acc.push({
   ...category,
   tags
  })

  return acc
 }, [] as Category[])
})

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

const fetchTagList = async () => {
 const { execute, data, error } = getTagList({})

 await execute()

 if (data.value && !error.value) {
  return data.value.data
 }

 return []
}

const fetchCategoryList = async () => {
	const { execute, data, error } = getCategoryList()

	await execute()

	if (data.value && !error.value) {
		return data.value
	}

	return []
}

onMounted(async () => {
 const [categories, tags] = await Promise.all([fetchCategoryList(), fetchTagList()])
	categoryList.value = categories
 tagList.value = tags
})
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
