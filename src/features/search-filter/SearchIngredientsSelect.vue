<template>
	<div
		ref="dropdownParent"
		class="relative"
	>
		<div
			@click="toggleDropdown"
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
							:placeholder="placeholder"
						>
					</div>
				</div>
			</div>
		</div>

		<div
			v-if="isDropdownVisible"
			ref="dropdown"
			class="fixed z-20"
			:style="{
				width: dropdownParent?.clientWidth ? `${dropdownParent?.clientWidth}px` : '100%',
				top: `${top + 10 + (dropdownParent?.clientHeight ?? 0)}px`
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
						v-if="!filteredIngredients.length"
						class="h-4 px-4 py-2 h-full"
					>
						{{ t('no_ingredients_found') }}
					</div>

					<div
						v-for="ingredient in filteredIngredients"
						:key="ingredient.id"
						class="px-4 py-2 hover:bg-lightGray cursor-pointer"
						:class="{ 'bg-lightGray': selectedIngredientsSet.has(ingredient.id) }"
						@click.stop="toggleIngredient(ingredient)"
					>
						<span class="mr-1">
							{{ ingredient.name }}
						</span>

						<el-icon v-if="selectedIngredientsSet.has(ingredient.id)">
							<el-icon-check />
						</el-icon>
					</div>
				</ElScrollbar>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { IconClose } from '@/shared/components/Icon'
import { useTranslation } from '@/shared/lib/i18n'
import localization from './SearchFilter.localization.json'
import { computed, ref, watch } from 'vue'
import { useIngredientList } from 'entities/Ingredient'
import { Check as ElIconCheck } from '@element-plus/icons-vue'
import { onClickOutside, useElementBounding } from '@vueuse/core'
import { softFilterBySearchQuery } from 'shared/lib/mapping/filtering.ts'

type Ingredient = {
	name: string
	id: number
}

const selectedIngredients = defineModel<Ingredient[]>({ required: true })

defineProps<{
	placeholder: string
}>()

const selectedIngredientsSet = computed(() => {
	return new Set(selectedIngredients.value.map(ingredient => ingredient.id))
})

const { t } = useTranslation(localization)

const isDropdownVisible = ref(false)

const dropdownParent = ref<HTMLElement>()
const dropdown = ref<HTMLElement>()

const { top } = useElementBounding(dropdownParent)

onClickOutside(dropdown, () => {
	if (isDropdownVisible.value) {
		isDropdownVisible.value = false
	}
})

const {
	ingredientList,
	isLoadingIngredients
} = useIngredientList()

const query = ref('')

const filteredIngredients = computed(() => {
	return softFilterBySearchQuery({
		data: ingredientList.value,
		key: 'name',
		query: query.value
	})
})

watch(isDropdownVisible, (flag) => {
	if (!flag) {
		query.value = ''
	}
})

const toggleDropdown = () => {
	isDropdownVisible.value = !isDropdownVisible.value
}

const toggleIngredientInIngredientsArray = (array: Ingredient[], ingredient: Ingredient) => {
	const index = array.findIndex(ingredientItem => ingredientItem.id === ingredient.id)

	if (index === -1) {
		array.push(ingredient)
	} else {
		array.splice(index, 1)
	}
}

const toggleIngredient = (ingredient: Ingredient) => {
	toggleIngredientInIngredientsArray(selectedIngredients.value, ingredient)
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
