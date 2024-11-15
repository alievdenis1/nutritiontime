<template>
	<h3 class="text-lg font-semibold text-darkGray mb-[16px]">
		{{ t('ingredients') }}
	</h3>
	<IngredientList class="mb-4">
		<IngredientItem
			v-for="(ingredient, index) in props?.ingredients || []"
			:key="index"
			:value="`${ingredient.amount} ${ingredient.unit}.`"
			:title="ingredient.name"
		/>
	</IngredientList>
	<div class="text-sm text-slateGray">
		{{ t('totalWeight', { weight: props?.totalWeight }) }}
	</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useTranslation } from 'shared/lib/i18n'
import { Ingredient } from '../../model'
import Localization from './Ingredients.localization.json'
import { IngredientItem, IngredientList } from '../IngredientItem'

const { t } = useTranslation(Localization)

const props = defineProps<{
	ingredients: Ingredient[],
    totalWeight: number
}>()

</script>

<style scoped>
</style>

