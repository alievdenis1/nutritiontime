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
			<div class="mb-6">
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
		</VAccordion>
		<SearchIngredients />
		<SearchNutritional />
		<div class="px-[16px] absolute bottom-[20px] w-full">
			<VButton
				:color="ButtonColors.Green"
				@click="searchFilter"
			>
				440 {{ t('recipes') }}
			</VButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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

import { useSearchStore } from 'entities/Recipe/Search'
const store = useSearchStore()

const { t } = useTranslation(localization)
import { useRouter } from 'vue-router'
const router = useRouter()

interface FilterOption {
    id: number;
    name: string;
    checked: boolean;
}

const cuisines = ref<FilterOption[]>([
    { id: 1, name: 'Греческая', checked: false },
    { id: 2, name: 'Грузинская', checked: false },
    { id: 3, name: 'Европейская', checked: false },
    { id: 4, name: 'Русская', checked: false },
    { id: 5, name: 'Украинская', checked: false },
    { id: 6, name: 'Кавказская', checked: false },
    { id: 7, name: 'Турецкая', checked: false },
    { id: 7, name: 'Американская', checked: false },
    { id: 7, name: 'Индийская', checked: false },
])

const diets = ref<FilterOption[]>([
    { id: 1, name: 'Тип диеты 1', checked: false },
    { id: 2, name: 'Тип диеты 2', checked: false },
    { id: 3, name: 'Тип диеты 3', checked: false },
    { id: 4, name: 'Тип диеты 4', checked: false },
    { id: 5, name: 'Тип диеты 5', checked: false },
    { id: 6, name: 'Тип диеты 6', checked: false },
    { id: 7, name: 'Тип диеты 7', checked: false },
    { id: 8, name: 'Тип диеты 8', checked: false },
    { id: 9, name: 'Тип диеты 9', checked: false },
    { id: 10, name: 'Тип диеты 10', checked: false },
])
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

onMounted(() => {
	setTimeout(() => {
		const simplebarElement = document.querySelector('.simplebar-content-wrapper')
		if (simplebarElement) {
			const simplebarInstance = new SimpleBar(simplebarElement as HTMLElement)
			simplebarInstance.recalculate()
		}
	}, 100)
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
</style>@/entities/Recipe/Search