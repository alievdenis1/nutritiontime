<template>
	<VAccordion :title="t('ingredients')">
		<div>
			<div
				ref="dropdownParent"
				class="mt-4 relative"
			>
				<div
					@click="toggleIngredientsDropdown"
				>
					<div>
						<div class="flex flex-wrap gap-2 mb-4 border border-gray-200 rounded-lg min-h-[50px]">
							<div
								v-if="selectedIngredients.length"
								class="flex p-2 flex-wrap gap-2"
							>
								<div
									v-for="ingredient in selectedIngredients"
									:key="ingredient.id"
									class="flex items-center bg-gray-100 rounded-full px-4 py-2"
								>
									<span class="mr-2 text-sm">{{ ingredient.name }}</span>
									<button
										class="text-gray-400 hover:text-gray-600"
										@click="toggleIngredient(ingredient)"
									>
										<IconClose class="w-4 h-4" />
									</button>
								</div>
							</div>
							<div class="w-full">
								<input
									v-model="query"
									class="sticky py-1 px-4 w-full h-full"
									autofocus
									placeholder="Введите название ингредиента"
									@update:model-value="searchIngredients"
								>
							</div>
						</div>
					</div>
				</div>

				<div
					v-if="isIngredientsDropdownVisible"
					ref="dropdown"
					class="fixed"
					:style="{
						width: dropdownParent?.clientWidth ? `${dropdownParent?.clientWidth}px` : '100%',
						top: `${top + 10 + dropdownParent?.clientHeight ?? 0}px`
					}"
				>
					<div
						class="bg-white border rounded-md shadow-lg absolute left-0 top-[calc(100%)] right-0 z-10 max-h-[250px]"
					>
						<ElScrollbar
							v-loading="isLoadingIngredients"
							:max-height="150"
							wrap-class="relative"
							always
						>
							<div
								v-if="!ingredientsList.length"
								class="h-4 px-4 py-2 h-full"
							>
								{{ t('no_ingredients_found') }}
							</div>

							<div
								v-for="ingredient in ingredientsList"
								:key="ingredient.id"
								class="px-4 py-2 hover:bg-lightGray cursor-pointer"
								:class="{ 'bg-lightGray': selectedIngredientsIdSet.has(ingredient.id) }"
								@click="toggleIngredient(ingredient)"
							>
								<span class="mr-1">
									{{ ingredient.name }}
								</span>

								<el-icon v-if="selectedIngredientsIdSet.has(ingredient.id)">
									<el-icon-check />
								</el-icon>
							</div>
						</ElScrollbar>
					</div>
				</div>
			</div>

			<button
				class="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-400 hover:bg-gray-50 focus:outline-none"
				@click="toggleExcludeMode"
			>
				{{ store.isExcludeIngredientsMode ? t('includeIngredients') : t('excludeIngredients') }}
			</button>
		</div>
	</VAccordion>
</template>

<script setup lang="ts">
import { VAccordion } from '@/shared/components/Accordion'
import { IconClose } from '@/shared/components/Icon'
import { useTranslation } from '@/shared/lib/i18n'
import localization from './SearchFilter.localization.json'
import { useSearchStore } from 'entities/Recipe/Search'
import { computed, onMounted, ref, watch } from 'vue'
import { getIngredientList } from 'entities/Ingredient'
import { Check as ElIconCheck } from '@element-plus/icons-vue'
import { onClickOutside, useElementBounding } from '@vueuse/core'

type Ingredient = {
 name: string
 id: number
}

const { t } = useTranslation(localization)

const dropdownParent = ref<HTMLElement>()
const dropdown = ref<HTMLElement>()

const { top } = useElementBounding(dropdownParent)

onClickOutside(dropdown, () => {
 if (isIngredientsDropdownVisible.value) {
   isIngredientsDropdownVisible.value = false
 }
})

const store = useSearchStore()

const ingredientsList = ref([])
const isLoadingIngredients = ref(false)
const query = ref('')

watch(query, (nV) => {
 isIngredientsDropdownVisible.value = !!nV.trim()
})

const isIngredientsDropdownVisible = ref(false)

const toggleIngredientsDropdown = () => {
 isIngredientsDropdownVisible.value = !isIngredientsDropdownVisible.value

 if (!isIngredientsDropdownVisible.value) {
  query.value = ''
 }
}

const searchIngredients = async () => {
 isLoadingIngredients.value = true

 const ingredientsListApi = getIngredientList({ search: query.value })
 await ingredientsListApi.execute()
 ingredientsList.value = ingredientsListApi.data.value.data
 isLoadingIngredients.value = false
}

onMounted(() => {
 searchIngredients()
})

const selectedIngredients = ref<Ingredient[]>([])

const selectedIngredientsIdSet = computed(() => {
 return new Set(selectedIngredients.value.map(ingredient => ingredient.id))
})

const setIngredientsToStore = (ingredients: Ingredient[]) => {
 const mappedIngredients = ingredients.map(ingredient => ingredient.id)

 if (store.isExcludeIngredientsMode) {
  store.filters.excluded_ingredients = mappedIngredients
 } else {
  store.filters.included_ingredients = mappedIngredients
 }
}

const toggleIngredient = (ingredient: Ingredient) => {
 const index = selectedIngredients.value.findIndex(ingredientItem => ingredientItem.id === ingredient.id)

 if (index === -1) {
  selectedIngredients.value.push(ingredient)
 } else {
  selectedIngredients.value.splice(index, 1)
 }

 setIngredientsToStore(selectedIngredients.value)
}

const toggleExcludeMode = () => {
 store.isExcludeIngredientsMode = !store.isExcludeIngredientsMode

 if (store.isExcludeIngredientsMode) {
  store.filters.excluded_ingredients = store.filters.included_ingredients
  store.filters.included_ingredients = undefined
 } else {
  store.filters.included_ingredients = store.filters.excluded_ingredients
  store.filters.excluded_ingredients = undefined
 }
}
</script>

<style scoped>
.border {
    border-color: #E5E7EB;
}

.bg-gray-100 {
    background-color: #F3F4F6;
}

.text-gray-400 {
    color: #9CA3AF;
}

.text-gray-600 {
    color: #4B5563;
}
</style>
