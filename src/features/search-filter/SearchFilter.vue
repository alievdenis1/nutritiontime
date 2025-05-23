<template>
	<div class="flex flex-col bg-white mb-[100px] gap-[24px]">
		<div class="grid grid-cols-3 items-center p-[16px]">
			<h2 class="col-start-2 col-end-3 text-center text-lg text-darkGray">
				{{ t('filters') }}
			</h2>
			<div class="col-start-3 col-end-4 text-end">
				<div
					v-if="showResetButton"
					class="cursor-pointer text-slateGray text-sm"
					@click="resetFilters"
				>
					{{ t('reset') }}
				</div>
			</div>
		</div>

		<VAccordion
			:title="t('mainParameters')"
			:is-open="true"
			class="flex-grow overflow-y-auto p-4 recipe-search"
		>
			<div class="pb-6">
				<h3 class="text-darkGray text-sm mb-[16px] mt-[20px]">
					{{ t('cuisine') }}
				</h3>
				<Simplebar
					class="h-[212px] pr-2"
					data-simplebar-auto-hide="false"
				>
					<div
						v-for="cuisine in cuisines"
						:key="cuisine.id"
						class="flex items-center mb-3 cursor-pointer"
						@click="toggleCheckbox(cuisine)"
					>
						<div class="w-5 h-5 border-2 border rounded-sm mr-2 flex items-center justify-center border">
							<IconCheck
								v-if="cuisine.checked"
								class="text-white w-4 h-4"
								icon-color="#319A6E"
							/>
						</div>
						<span>{{ t(cuisine.name) }}</span>
					</div>
				</Simplebar>
				<h3 class="text-darkGray text-sm mb-[16px] mt-4">
					{{ t('dietType') }}
				</h3>
				<Simplebar
					class="h-[212px] pr-2"
					data-simplebar-auto-hide="false"
				>
					<div
						v-for="diet in diets"
						:key="diet.id"
						class="flex items-center mb-2 cursor-pointer"
						@click="toggleCheckbox(diet)"
					>
						<div class="w-5 h-5 border-2 border rounded-sm mr-2 flex items-center justify-center border">
							<IconCheck
								v-if="diet.checked"
								class="text-white w-4 h-4"
								icon-color="#319A6E"
							/>
						</div>
						<span>{{ t(diet.name) }}</span>
					</div>
				</Simplebar>
			</div>
			<SearchSlider />
			<div class="pb-5" />
		</VAccordion>
		<SearchIngredients />
		<SearchNutritional />
		<div class="px-[16px] absolute bottom-[20px] w-full">
			<VButton
				:color="ButtonColors.Green"
				@click="searchFilter"
			>
				{{ store.totalRecipes }} {{ t('recipes') }}
				<ElIcon>
					<ElIconLoading v-if="store.isLoading" />
				</ElIcon>
			</VButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, watchEffect } from 'vue'
import { IconCheck } from 'shared/components/Icon'
import { VAccordion } from 'shared/components/Accordion'
import { VButton, ButtonColors } from 'shared/components/Button'
import { SearchSlider, SearchIngredients, SearchNutritional } from 'features/search-filter'
import { useTranslation } from '@/shared/lib/i18n'
import localization from './SearchFilter.localization.json'
import Simplebar from 'simplebar-vue'
import 'simplebar/dist/simplebar.min.css'
import SimpleBar from 'simplebar'
import 'simplebar/dist/simplebar.css'
import { Loading as ElIconLoading } from '@element-plus/icons-vue'

import { useSearchStore } from 'entities/Recipe/Search'
import { useRouter } from 'vue-router'
import { useCuisineList } from 'entities/Cuisine'
import { useDietTypeList } from 'entities/DietType'

const store = useSearchStore()
const { t } = useTranslation(localization)

const router = useRouter()

interface FilterOption {
	id: number;
	name: string;
	checked: boolean;
}

const cuisines = ref<FilterOption[]>([])

const reduceFilterOptions = (filterOptions: FilterOption[]) => {
	return filterOptions.reduce((acc, cur) => {
		if (cur.checked) {
			acc.push(cur.id)
		}

		return acc
	}, [] as number[])
}

watch(cuisines, (newCuisines) => {
	store.filters.cuisine_id = reduceFilterOptions(newCuisines)
}, { deep: true })

const diets = ref<FilterOption[]>([])

watch(diets, (newDiets) => {
	store.filters.diet_type_id = reduceFilterOptions(newDiets)
}, { deep: true })

const showResetButton = computed(() => {
	return cuisines.value.some(cuisine => cuisine.checked) || diets.value.some(diet => diet.checked)
})

const searchFilter = () => {
	store.searchRecipes()
	router.push('/search')
}

const resetFilters = () => {
	cuisines.value.forEach(cuisine => cuisine.checked = false)
	diets.value.forEach(diet => diet.checked = false)
	updateFilters()
}

const toggleCheckbox = (option: FilterOption) => {
	option.checked = !option.checked
	updateFilters()
}

const updateFilters = () => {
	// Здесь можно добавить логику обновления фильтров
}

const {
	cuisines: cuisineList,
	// isLoadingCuisines
} = useCuisineList()
const {
	dietTypeList,
	// isLoadingDietTypes
} = useDietTypeList()

watchEffect(() => {
	cuisines.value = cuisineList.value.map(({ id, name }) => ({ id, name, checked: false }))
	diets.value = dietTypeList.value.map(({ id, name }) => ({ id, name, checked: false }))
})

</script>

<style lang="scss">
.simplebar-scrollbar {
    &::before {
        background-color: #319A6E;
        opacity: 1;
        border-radius: 1px;
        left: 0;
        right: 0;
    }

    &.simplebar-visible:before {
        opacity: 1;
    }
}

.simplebar-track.simplebar-vertical {
    width: 2px;
    background-color: #E5E7EB;
    right: 0;

    .simplebar-scrollbar {
        right: 0;
        width: 100%;
    }
}

.recipe-search {
    border-top: 1px solid #1C1C1C0D;
    border-bottom: 1px solid #1C1C1C0D;
    padding: 20px 16px;
    border-radius: 16px;
}

.border {
    border: 1px solid #E1E1E1;
}
.border-slide {
    border: 1px solid #319A6E33;
    border-radius: 4px;
}
</style>
