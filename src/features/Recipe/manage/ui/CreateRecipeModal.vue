<template>
	<VModal
		:show="isVisible"
		@close="onClose"
	>
		<div>
			<div class="flex justify-between mb-[12px] items-center">
				<h2 class="text-xl font-bold text-darkGray">
					{{ t('createRecipe') }}
				</h2>

				<button
					class="text-2xl w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[14px] cursor-pointer"
					@click="onClose"
				>
					<IconClose icon-color="#9F9FA0" />
				</button>
			</div>

			<div class="space-y-4">
				<div
					class="flex items-center justify-between p-4 bg-mainBg rounded-lg cursor-pointer border"
					@click="selectMethod('Base')"
				>
					<div class="text-left w-[255px]">
						<h3 class="font-semibold mb-[8px] text-lg text-darkGray">
							{{ t('manualCreation') }}
						</h3>

						<p class="text-slateGray text-xs">
							{{ t('manualDescription') }}
						</p>
					</div>

					<IconArrowRight
						icon-color="#1C1C1C"
						class="w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[8px]"
					/>
				</div>

				<div
					class="flex items-center justify-between p-4 bg-mainBg rounded-lg cursor-pointer border"
					@click="selectMethod('AI')"
				>
					<div class="text-left w-[255px]">
						<h3 class="flex gap-[8px] font-semibold mb-[8px] text-lg text-darkGray">
							{{ t('aiCreation') }}
							<IconAi :icon-color="'#319A6E'" />
						</h3>

						<p class="text-gray-600 mr-[8px] text-xs">
							{{ t('aiDescription') }}
						</p>
					</div>

					<IconArrowRight
						icon-color="#1C1C1C"
						class="w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[8px]"
					/>
				</div>
			</div>
		</div>
	</VModal>
</template>

<script setup lang="ts">
import { VModal } from '@/shared/components/Modal'
import { IconClose, IconArrowRight, IconAi } from '@/shared/components/Icon'
import { useTranslation } from '@/shared/lib/i18n'
import Localization from './ModalCreateRecipe.localization.json'
import {
	type RecipeCreationVariants,
	useNavigateToRecipeCreation
} from 'entities/Recipe/model/use-navigate-to-recipe-creation.ts'

const { t } = useTranslation(Localization)

const {
	goToRecipeCreation
} = useNavigateToRecipeCreation()

const isVisible = defineModel<boolean>('visible', { required: true })

const selectMethod = async (variant: RecipeCreationVariants) => {
	isVisible.value = false
	await goToRecipeCreation(variant)
}

function onClose() {
	isVisible.value = false
}
</script>

<style scoped lang="scss">
.border {
  border: 1px solid #1C1C1C0D
}
</style>
