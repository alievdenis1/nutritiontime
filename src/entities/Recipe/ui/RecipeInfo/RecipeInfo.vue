<template>
	<h3 class="text-xl font-bold text-darkGray mb-4">
		{{ t('aboutRecipe') }}
	</h3>
	<div class="space-y-2 mb-[32px]">
		<!-- <div
			v-for="(value, key) in recipeInfo"
			:key="key"
			class="flex justify-between"
		>
			<span class="text-sm text-slateGray">{{ t(`${key}`) }}</span>
			<span class="flex flex-grow text-sm font-medium text-darkGray dashed-gap">{{ value }}</span>
		</div> -->

		<!-- TODO: добавить переводы и проверить -->
		<InfoItem
			:title="t('category')"
			:value="props.recipe?.category.name"
		/>
		<InfoItem
			:title="t('cuisine')"
			:value="props.recipe?.cuisine.name"
		/>
		<InfoItem
			:title="t('dietType')"
			:value="props.recipe?.dietType.name"
		/>
		<InfoItem
			v-if="props.recipe?.cooking_time !== undefined"
			:title="t('cookingTime')"
			:value="t('cookingTimeValue', { time: props.recipe.cooking_time })"
		/>
		<InfoItem
			v-if="props.recipe?.total_time !== undefined"
			:title="t('readyIn')"
			:value="t('readyInValue', { time: props.recipe.total_time })"
		/>
		<InfoItem
			v-if="props.recipe?.spiciness !== undefined"
			:title="t('spicyLevel')"
			:value="t('spicyLevelValue', { level: props.recipe.spiciness })"
		/>
		<InfoItem
			v-if="props.recipe?.difficulty !== undefined"
			:title="t('difficultyLevel')"
			:value="t('difficultyLevelValue', { level: props.recipe.difficulty })"
		/>
	</div>

	<h3 class="text-xl font-bold text-darkGray mb-4">
		{{ t('nutritionalValue') }}
	</h3>

	<!-- TODO: проверить стили и отступы -->
	<div class="space-y-2 mb-6 ">
		<!-- <div
			v-for="(value, key) in nutritionInfo"
			:key="key"
			class="flex justify-between"
		>
			<span class="text-sm text-slateGray">{{ t(`${key}`) }}</span>
			<span class="flex flex-grow text-sm font-medium text-darkGray dashed-gap">{{ value }}</span>
		</div> -->
		<InfoItem
			v-if="props.recipe?.calories !== undefined"
			:title="t('caloriesPer100g')"
			:value="t('caloriesPer100gValue', { value: props.recipe.calories })"
		/>
		<InfoItem
			v-if="props.recipe?.proteins !== undefined"
			:title="t('proteinPer100g')"
			:value="t('proteinPer100gValue', { value: props.recipe.proteins })"
		/>
		<InfoItem
			v-if="props.recipe?.fats !== undefined"
			:title="t('fatPer100g')"
			:value="t('fatPer100gValue', { value: props.recipe.fats })"
		/>
		<InfoItem
			v-if="props.recipe?.carbohydrates !== undefined"
			:title="t('carbsPer100g')"
			:value="t('carbsPer100gValue', { value: props.recipe.carbohydrates })"
		/>
	</div>

	<h3 class="text-xl font-bold text-darkGray mb-4">
		{{ t('kitchenware') }}
	</h3>

	<div class="space-y-2 mb-[32px]">
		<InfoItem
			v-for="item in props.recipe?.kitchenware"
			:key="item.id"
			:title="item.name"
			:value="t('quantityUnits', { quantity: item.quantity })"
		/>
		<!-- <div
			v-for="item in props.recipe?.kitchenware"
			:key="item.id"
			class="flex justify-between"
		>
			<span class="text-sm text-slateGray">{{ item.name }}</span>
			<span class="flex flex-grow text-sm font-medium text-darkGray dashed-gap">
				{{ item.quantity }} {{ t('quantityUnits') }}
			</span>
		</div> -->
	</div>

	<h3 class="text-xl font-bold text-darkGray mb-4">
		{{ t('tags') }}
	</h3>

	<div class="flex flex-wrap gap-2">
		<span
			v-for="tag in props.recipe?.tags"
			:key="tag.id"
			class="inline-block bg-lightGray text-slateGray text-xs px-[12px] py-[8px] rounded-full"
		>
			#{{ tag.name }}
		</span>
	</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import Localization from './RecipeInfo.localization.json'
import { useTranslation } from 'shared/lib/i18n'
import { Recipe } from '../../model'
import InfoItem from './InfoItem.vue'

const { t } = useTranslation(Localization)

const props = defineProps<{
	recipe: Recipe | null,
}>()

</script>

<style scoped>
</style>

