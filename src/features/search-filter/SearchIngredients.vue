<template>
	<VAccordion :title="t('ingredients')">
		<div>
			<SearchIngredientsSelect
				v-model="includedIngredients"
				:placeholder="t('includeIngredients')"
			/>

			<SearchIngredientsSelect
				v-model="excludedIngredients"
				:placeholder="t('excludeIngredients')"
			/>
		</div>
	</VAccordion>
</template>

<script setup lang="ts">
import { VAccordion } from '@/shared/components/Accordion'
import { useTranslation } from '@/shared/lib/i18n'
import localization from './SearchFilter.localization.json'
import { useSearchStore } from 'entities/Recipe/Search'
import { onMounted, onScopeDispose, ref, watch } from 'vue'
import SearchIngredientsSelect from 'features/search-filter/SearchIngredientsSelect.vue'

type Ingredient = {
	name: string
	id: number
}

const { t } = useTranslation(localization)

const store = useSearchStore()

const includedIngredients = ref<Ingredient[]>([])
const excludedIngredients = ref<Ingredient[]>([])

onScopeDispose(() => {
	store.includedIngredients = includedIngredients.value
	store.excludedIngredients = excludedIngredients.value
})

onMounted(() => {
	includedIngredients.value = store.includedIngredients
	excludedIngredients.value = store.excludedIngredients
})

watch(() => [...includedIngredients.value], (included) => {
	const ingredients = included.map(ingredient => ingredient.id)

	store.includedIngredients = ingredients
	store.filters.required_ingredients = ingredients
})

watch(() => [...excludedIngredients.value], (excluded) => {
	const ingredients = excluded.map(ingredient => ingredient.id)

	store.excludedIngredients = ingredients
	store.filters.excluded_ingredients = ingredients
})

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
