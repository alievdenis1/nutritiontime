<template>
	<div class="pt-[20px]">
		<p
			v-if="model.ingredients.length === 0"
			class="text-gray text-xs mb-4"
		>
			{{ t('desc') }}
		</p>

		<div
			v-for="(ingredient, index) in model.ingredients"
			:key="index"
			class="flex items-center justify-between bg-lightGray px-[12px] py-[20px] rounded-[16px] mb-[16px]"
		>
			<span class="text-[12px]">{{ ingredient.name }}</span>

			<div>
				<span
					class="text-[#535353] text-xs"
				>
					{{ ingredient.amount }}
					{{ ingredient.unit === QuantityType.WEIGHT ? t('unitGrams') : t('unitPieces') }}
				</span>

				<button
					class="text-forestGreen ml-[14px] cursor-pointer"
					@click="removeIngredient(index)"
				>
					<IconClose
						icon-color="#9F9FA0"
						class="w-[12px] h-[12px]"
					/>
				</button>
			</div>
		</div>

		<button
			class="flex bg-forestGreen items-center gap-[12px] justify-center text-white rounded-[16px] py-2 px-4 w-[100%] mb-4 cursor-pointer"
			@click="openAddIngredientModal"
		>
			{{ t('addIngredientButton') }}
			<IconPlus
				icon-color="#FFFFFF"
				class="w-[12px] h-[12px]"
			/>
		</button>
	</div>

	<AddIngredientModal
		v-model="isAddIngredientModalVisible"
		is-exclusion-mode
		@add="onIngredientAdded"
	/>
</template>

<script setup lang="ts">
import { IconClose, IconPlus } from 'shared/components/Icon'
import { QuantityType } from 'entities/Recipe/CreateRecipe/recipe-models/types/enum.ts'
import AddIngredientModal from 'features/Recipe/create/ui/base/parts/ingredients/AddIngredientModal.vue'
import { useBaseRecipeCreationContext } from 'features/Recipe/create/model/base/use-base-recipe-creation-context.ts'
import { ref } from 'vue'
import Localization from './IngredientsPart.localization.json'
import { useTranslation } from 'shared/lib/i18n'
import { CreateRecipeIngredientModel } from 'features/Recipe/create/model/base/use-base-recipe-creation-validation.ts'

const { t } = useTranslation(Localization)

const {
	model,
	validateField
} = useBaseRecipeCreationContext()

const isAddIngredientModalVisible = ref(false)

const openAddIngredientModal = () => {
	isAddIngredientModalVisible.value = true
}

function onIngredientAdded(ingredient: CreateRecipeIngredientModel) {
	if (!model.ingredients) {
		model.ingredients = []
	}

	model.ingredients.push(ingredient)
	validateField({ key: 'ingredients' })
}

function removeIngredient(index: number) {
	model.ingredients.splice(index, 1)
}
</script>

<style scoped>
.border {
	border: 1px solid #E1E1E1;
}

.activeInput {
	border: 1px solid #F04F4F;
}

.filledInput {
	border: 2px solid #319A6E33;
}

.overflow-x-auto {
	overflow-x: auto;
	display: flex;
	white-space: nowrap;
}

.no-scrollbar {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
	display: none;
}
</style>
