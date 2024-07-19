<template>
	<VAccordion :title="t('ingredientsTitle')">
		<div class="mt-[20px]">
			<p
				v-if="ingredients.length === 0"
				class="text-gray text-xs mb-4"
			>
				{{ t('ingredientsDescription') }}
			</p>
			<div
				v-for="(ingredient, index) in ingredients"
				:key="index"
				class="flex items-center justify-between bg-lightGray px-[12px] py-[20px] rounded-[16px] mb-[16px]"
			>
				<span class="text-[12px]">{{ ingredient.name }}</span>
				<div>
					<span class="text-[#535353] text-xs">
						{{ ingredient.quantity }}
						{{ ingredient.type === 'weight' ?
							t('unitGrams') : t('unitPieces') }}</span>
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
				@click="openModal"
			>
				{{ t('addIngredientButton') }}
				<IconPlus
					icon-color="#FFFFFF"
					class="w-[12px] h-[12px]"
				/>
			</button>
			<VModal
				:show="showModal"
				@close="closeModal"
			>
				<div class="p-4">
					<h2 class="text-lg mb-4">
						{{ t('addIngredientTitle') }}
					</h2>
					<div class="relative">
						<span
							v-if="ingredientName.length > 0"
							class="absolute text-[12px] top-[6px] left-[12px] text-gray"
						>
							{{ t('ingredientPlaceholderName') }}
						</span>
						<input
							ref="ingredientNameInput"
							v-model="ingredientName"
							type="text"
							:placeholder="t('ingredientPlaceholderName')"
							class="border rounded px-[12px] py-4 text-base w-full mb-4 h-[54px]"
							:class="{ activeInput: activeInputName, filledInput: notEmptyIngredientName, 'pt-[26px]': notEmptyIngredientName }"
						>
					</div>
					<div class="relative">
						<span
							v-if="ingredientQuantity.length > 0"
							class="absolute text-[12px] top-[6px] left-[12px] text-gray"
						>
							{{ t('ingredientPlaceholderQuantity') }}
						</span>
						<input
							v-model="ingredientQuantity"
							type="text"
							:placeholder="t('ingredientPlaceholderQuantity')"
							class="border rounded px-[12px] py-4 text-base w-full mb-4 h-[54px]"
							:class="{ activeInput: activeInputQuantity, filledInput: notEmptyIngredientQuantity, 'pt-[26px]': notEmptyIngredientQuantity }"
							@input="filterNumericInput"
						>
					</div>
					<TabsMain
						v-model="activeTab"
						default-value="weight"
						class="mb-[20px] mt-[10px]"
					>
						<TabsList>
							<TabsTrigger :value="QuantityType.WEIGHT">
								{{ t('InGrams') }}
							</TabsTrigger>
							<TabsTrigger :value="QuantityType.QUANTITY">
								{{ t('InPieces') }}
							</TabsTrigger>
						</TabsList>
					</TabsMain>
					<button
						class="bg-forestGreen text-white rounded-[16px] py-2 px-4 w-[100%] text-center"
						@click="addIngredient"
					>
						{{ t('saveIngredientButton') }}
					</button>
				</div>
			</VModal>
		</div>
	</VAccordion>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { VAccordion } from '@/shared/components/Accordion'
import { VModal } from '@/shared/components/Modal'
import { IconClose, IconPlus } from '@/shared/components/Icon'
import localization from './CreateRecipeIngredients.localization.json'
import { TabsMain, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { QuantityType } from '../types/enum'

const { t } = useTranslation(localization)

const showModal = ref(false)
const ingredientName = ref<string>('')
const ingredientQuantity = ref<string>('')
const ingredients = ref<{ name: string, quantity: string, type: QuantityType }[]>([])
const tryToSave = ref(false)
const activeTab = ref<QuantityType>(QuantityType.WEIGHT)
const ingredientNameInput = ref<HTMLInputElement | null>(null)

const openModal = () => {
	showModal.value = true
}

const addIngredient = () => {
	tryToSave.value = true
	if (ingredientName.value && ingredientQuantity.value) {
		ingredients.value.push({
			name: ingredientName.value,
			quantity: ingredientQuantity.value,
			type: activeTab.value
		})
		closeModal()
	}
}

const removeIngredient = (index: number) => {
	ingredients.value.splice(index, 1)
}

const closeModal = () => {
	showModal.value = false
	ingredientName.value = ''
	ingredientQuantity.value = ''
	tryToSave.value = false
}

const filterNumericInput = (event: Event) => {
	const target = event.target as HTMLInputElement
	const numericValue = target.value.replace(/\D/g, '')
	ingredientQuantity.value = numericValue
}

const activeInputName = computed(() => tryToSave.value && !ingredientName.value)
const notEmptyIngredientName = computed(() => ingredientName.value.length !== 0)
const activeInputQuantity = computed(() => tryToSave.value && !ingredientQuantity.value)
const notEmptyIngredientQuantity = computed(() => ingredientQuantity.value.length !== 0)

watch(showModal, (newVal) => {
	if (newVal) {
		nextTick(() => {
			if (ingredientNameInput.value) {
				ingredientNameInput.value.focus()
			}
		})
	}
})
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
	/* IE and Edge */
	scrollbar-width: none;
	/* Firefox */
}

.no-scrollbar::-webkit-scrollbar {
	display: none;
	/* Safari and Chrome */
}
</style>