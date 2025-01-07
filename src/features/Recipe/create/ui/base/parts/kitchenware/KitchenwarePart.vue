<template>
	<div class="pt-[20px]">
		<p
			v-if="model.kitchenware.length === 0"
			class="text-gray text-xs mb-4"
		>
			{{ t('ingredientsDescription') }}
		</p>

		<div
			v-for="(item, index) in model.kitchenware"
			:key="index"
			class="flex items-center justify-between bg-lightGray px-[12px] py-[20px] rounded-[16px] mb-[16px]"
		>
			<span class="text-[12px]">{{ item.name }}</span>
			<div>
				<span class="text-[#535353] text-xs">
					{{ item.quantity }} {{ t('unitPieces') }}
				</span>
				<button
					class="text-forestGreen ml-[14px] cursor-pointer"
					@click="removeKitchenware(index)"
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
			@click="openAddKitchenwareModal"
		>
			{{ t('addIngredientButton') }}

			<IconPlus
				icon-color="#FFFFFF"
				class="w-[12px] h-[12px]"
			/>
		</button>

		<AddKitchenwareModal
			v-model="isAddKitchenwareModalVisible"
			@add="onKitchenwareAdded"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { IconClose, IconPlus } from 'shared/components/Icon'
import localization from './KitchenwarePart.localization.json'
import { useBaseRecipeCreationContext } from 'features/Recipe/create/model/base/use-base-recipe-creation-context.ts'
import AddKitchenwareModal from 'features/Recipe/create/ui/base/parts/kitchenware/AddKitchenwareModal.vue'
import { CreateRecipeKitchenwareModel } from 'features/Recipe/create/model/base/use-base-recipe-creation-validation.ts'

const { t } = useTranslation(localization)

const {
	model
} = useBaseRecipeCreationContext()

const removeKitchenware = (index: number) => {
	model.kitchenware.splice(index, 1)
}

const isAddKitchenwareModalVisible = ref(false)

function openAddKitchenwareModal() {
	isAddKitchenwareModalVisible.value = true
}

function onKitchenwareAdded(kitchenware: CreateRecipeKitchenwareModel) {
	if (!model.kitchenware) {
		model.kitchenware = []
	}

	model.kitchenware.push(kitchenware)
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
</style>
