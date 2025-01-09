<template>
	<div>
		<TabsMain default-value="cooking">
			<TabsList class="mb-[24px] mt-[38px]">
				<TabsTrigger value="cooking">
					{{ t('howToCook') }}
				</TabsTrigger>
				<TabsTrigger value="info">
					{{ t('information') }}
				</TabsTrigger>
			</TabsList>
			<TabsContent value="cooking">
				<div class="space-y-6">
					<div
						v-for="(step, index) in recipe.steps"
						:key="index"
						class="space-y-3"
					>
						<h3 class="text-lg font-semibold text-darkGray">
							{{ t('step') }}
							{{ index + 1 }}
						</h3>
						<p class="text-sm text-slateGray mt-[12]">
							{{ step.description }}
						</p>
						<img
							:src="normalizeImageUrl(step.image)"
							:alt=" t('step')"
							class="w-full h-[250px] object-cover rounded-[12px]"
						>
					</div>
				</div>
			</TabsContent>
			<TabsContent value="info">
				<div>
					<h3 class="text-xl font-bold text-darkGray mb-4">
						{{ t('aboutRecipe') }}
					</h3>

					<div class="space-y-2">
						<div
							v-for="item in mainInfo"
							:key="item.key"
							class="flex justify-between"
						>
							<span class="text-sm text-slateGray">{{ item.title }}</span>
							<span class="flex flex-grow text-sm font-medium text-darkGray dashed-gap">{{ item.value }}</span>
						</div>
					</div>

					<h3 class="text-xl font-bold text-darkGray mt-[32px] mb-4">
						{{ t('nutritionalValue') }}
					</h3>

					<div class="space-y-2">
						<div
							v-for="item in nutritionInfo"
							:key="item.key"
							class="flex justify-between"
						>
							<span class="text-sm text-slateGray">{{ item.title }}</span>
							<span class="flex flex-grow text-sm font-medium text-darkGray dashed-gap">{{ item.value }}</span>
						</div>
					</div>

					<h3 class="text-xl font-bold text-darkGray mt-6 mb-4">
						{{ t('kitchenware') }}
					</h3>

					<div class="space-y-2">
						<div
							v-for="item in recipe.kitchenware"
							:key="`Kitchenware${ item.name + item.pivot.quantity }`"
							class="flex justify-between"
						>
							<span class="text-sm text-slateGray">{{ item.name }}</span>
							<span class="flex flex-grow text-sm font-medium text-darkGray dashed-gap">
								{{ item.pivot.quantity }} {{ t('quantityUnits') }}
							</span>
						</div>
					</div>

					<h3 class="text-xl font-bold text-darkGray mt-[32px] mb-4">
						{{ t('tags') }}
					</h3>

					<div class="flex flex-wrap gap-2">
						<span
							v-for="tag in recipe.tags"
							:key="tag.id"
							class="inline-block bg-lightGray text-slateGray text-xs px-[12px] py-[8px] rounded-full"
						>
							{{ tag.name }}
						</span>
					</div>
				</div>
			</TabsContent>
		</TabsMain>
	</div>
</template>

<script setup lang="ts">
import { TabsMain, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'

import Localization from './RecipeDetailsTabs.localization.json'
import { useTranslation } from 'shared/lib/i18n'
import { FullRecipe } from 'entities/Recipe/model/recipe.ts'
import { normalizeImageUrl } from 'shared/lib/mapping/normalize-image-url.ts'
import { computed } from 'vue'

const { t } = useTranslation(Localization)

const props = defineProps<{
	recipe: FullRecipe
}>()

const nutritionInfo = computed(() => {
	return [
		{
			key: 'calories',
			title: t('caloriesPer100g'),
			value: props.recipe.calories,
		},
		{
			key: 'fats',
			title: t('fatPer100g'),
			value: props.recipe.fats,
		},
		{
			key: 'carbohydrates',
			title: t('carbsPer100g'),
			value: props.recipe.carbohydrates
		},
		{
			key: 'proteins',
			title: t('proteinPer100g'),
			value: props.recipe.proteins
		}
	]
})

const mainInfo = computed(() => {
	return [
		{
			key: 'category',
			title: t('category'),
			value: props.recipe.category.name
		},
		{
			key: 'cuisine',
			title: t('cuisine'),
			value: props.recipe.cuisine.name
		},
		{
			key: 'dietType',
			title: t('dietType'),
			value: props.recipe.diet_type.name
		},
		{
			key: 'time_in_kitchen',
			title: t('cookingTime'),
			value: props.recipe.cooking_time
		},
		{
			key: 'time_of_cooking',
			title: t('readyIn'),
			value: props.recipe.total_time
		},
		{
			key: 'spiciness',
			title: t('spicyLevel'),
			value: props.recipe.spiciness
		},
		{
			key: 'difficulty',
			title: t('difficultyLevel'),
			value: props.recipe.difficulty
		}
	]
})
</script>

<style>
.dashed-gap::before {
    content: '';
    border-bottom: 1px dashed rgba(28, 28, 28, 0.05);
    flex-grow: 1;
    margin: 0 5px;
   }
</style>
