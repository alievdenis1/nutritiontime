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
						v-for="(step, index) in cookingSteps"
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
							:src="step.image"
							:alt=" t('recipe.step')"
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
							v-for="(value, key) in recipeInfo"
							:key="key"
							class="flex justify-between"
						>
							<span class="text-sm text-slateGray">{{ t(`${key}`) }}</span>
							<span class="flex flex-grow text-sm font-medium text-darkGray dashed-gap">{{ value }}</span>
						</div>
					</div>

					<h3 class="text-xl font-bold text-darkGray mt-[32px] mb-4">
						{{ t('nutritionalValue') }}
					</h3>

					<div class="space-y-2">
						<div
							v-for="(value, key) in nutritionInfo"
							:key="key"
							class="flex justify-between"
						>
							<span class="text-sm text-slateGray">{{ t(`${key}`) }}</span>
							<span class="flex flex-grow text-sm font-medium text-darkGray dashed-gap">{{ value }}</span>
						</div>
					</div>

					<h3 class="text-xl font-bold text-darkGray mt-6 mb-4">
						{{ t('kitchenware') }}
					</h3>

					<div class="space-y-2">
						<div
							v-for="item in kitchenware"
							:key="`Kitchenware${ item.name+ item.quantity }`"
							class="flex justify-between"
						>
							<span class="text-sm text-slateGray">{{ item.name }}</span>
							<span class="flex flex-grow text-sm font-medium text-darkGray dashed-gap">
								{{ item.quantity }} {{ t('quantityUnits') }}
							</span>
						</div>
					</div>

					<h3 class="text-xl font-bold text-darkGray mt-[32px] mb-4">
						{{ t('tags') }}
					</h3>

					<div class="flex flex-wrap gap-2">
						<span
							v-for="tag in tags"
							:key="tag"
							class="inline-block bg-lightGray text-slateGray text-xs px-[12px] py-[8px] rounded-full"
						>
							#{{ tag }}
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

const { t } = useTranslation(Localization)

interface RecipeInfoProps {
	recipeInfo: Record<string, string>;
	nutritionInfo: Record<string, string>;
	kitchenware: Array<{ name: string; quantity: string }>;
	tags: string[];
	cookingSteps: {
		description: string;
		image: string;
	}[];
}

defineProps<RecipeInfoProps>()
</script>

<style>
.dashed-gap::before {
    content: '';
    border-bottom: 1px dashed rgba(28, 28, 28, 0.05);
    flex-grow: 1;
    margin: 0 5px;
   }
</style>