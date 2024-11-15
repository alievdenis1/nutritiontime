<template>
	<VAccordion :title="title">
		<div class="mt-[20px]">
			<p
				v-if="ingredients.length === 0"
				class="text-gray text-xs mb-4"
			>
				{{ desc }}
			</p>
			<div
				v-for="(ingredient, index) in ingredients"
				:key="index"
				class="flex items-center justify-between bg-lightGray px-[12px] py-[20px] rounded-[16px] mb-[16px]"
			>
				<span class="text-[12px]">{{ ingredient.name }}</span>
				<div>
					<span
						v-if="!isExclusionMode"
						class="text-[#535353] text-xs"
					>
						{{ ingredient.quantity }}
						{{ ingredient.type === QuantityType.WEIGHT ? t('unitGrams') : t('unitPieces') }}
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
				:lifted="isModalLifted"
				@close="closeModal"
			>
				<div
					class="p-4"
					@click="handleModalClick"
				>
					<div
						class="text-gray mb-4"
					>
						{{ t('ingredientPlaceholderName') }}
					</div>
					<VInput
						v-model="ingredientName"
						type="text"
						class="mb-4"
						:title="t('ingredientPlaceholderName')"
						:error="ingredientErrors?.name"
						name="name"
						autofocus
						no-digital
						searchable
						:max-length="maxIngredientName.title.length"
						@clear:error="clearFieldError"
						@focus.stop="setModalLifted(true)"
						@blur.stop="setModalLifted(false)"
					>
						<template #list>
							<InputList
								:list="filteredList"
								@select="selectSuggestion"
							/>
						</template>
					</VInput>
					<div
						v-if="!isExclusionMode"
						class="relative"
					>
						<VInput
							v-model="ingredientQuantity"
							type="text"
							class="mb-4"
							digital
							:title="t('ingredientPlaceholderQuantity')"
							:error="ingredientErrors?.quantity"
							name="quantity"
							:max-length="10"
							@clear:error="clearFieldError"
							@focus.stop="setModalLifted(true)"
							@blur.stop="setModalLifted(false)"
						/>
					</div>
					<TabsMain
						v-if="!isExclusionMode"
						v-model="activeTab"
						default-value="weight"
						class="mb-[20px]"
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
		<slot />
	</VAccordion>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { VAccordion } from '@/shared/components/Accordion'
import { VModal } from '@/shared/components/Modal'
import { VInput, type InputListItem, InputList } from '@/shared/components/Input'
import { IconClose, IconPlus } from 'shared/components/Icon'
import localization from './CreateRecipeIngredients.localization.json'
import { TabsMain, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { QuantityType } from '../types/enum'
import { useRecipeStore } from '../../../DetailedCardRecipe/stores/recipeStore'
import { useRoute } from 'vue-router'

interface Props {
	title: string;
	desc: string;
	isExclusionMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	isExclusionMode: false
})

const { t } = useTranslation(localization)
const store = useRecipeStore()
const route = useRoute()

const showModal = ref(false)
const ingredientName = ref<string>('')
const ingredientQuantity = ref<string>('')
const ingredients = ref<{ name: string; quantity?: string; type?: QuantityType }[]>([])
const tryToSave = ref(false)
const activeTab = ref<QuantityType>(QuantityType.WEIGHT)
const ingredientNameContainer = ref<HTMLElement | null>(null)
const quantityLimitReached = ref(false)
const isModalLifted = ref(false)
const ingredientErrors = ref<{name: boolean, quantity: boolean}>({ name: false, quantity: false })

const ingredientSuggestions:InputListItem[] = [
	{ id: '1', title: 'Мука', value: 'Мука' },
	{ id: '2', title: 'Сахар', value: 'Сахар' },
	{ id: '3', title: 'Соль', value: 'Соль' },
	{ id: '4', title: 'Яйца', value: 'Яйца' },
	{ id: '5', title: 'Молоко', value: 'Молоко' },
	{ id: '6', title: 'Масло', value: 'Масло' },
	{ id: '7', title: 'Картофель', value: 'Картофель' },
	{ id: '8', title: 'Морковь', value: 'Морковь' },
	{ id: '9', title: 'Лук', value: 'Лук' },
	{ id: '10', title: 'Чеснок', value: 'Чеснок' },
	{ id: '11', title: 'Помидоры', value: 'Помидоры' },
	{ id: '12', title: 'Огурцы', value: 'Огурцы' },
	{ id: '13', title: 'Перец', value: 'Перец' },
	{ id: '14', title: 'Курица', value: 'Курица' },
	{ id: '15', title: 'Говядина', value: 'Говядина' },
	{ id: '16', title: 'Свинина', value: 'Свинина' },
	{ id: '17', title: 'Рыба', value: 'Рыба' },
	{ id: '18', title: 'Рис', value: 'Рис' },
	{ id: '19', title: 'Макароны', value: 'Макароны' },
	{ id: '20', title: 'Сыр', value: 'Сыр' },
]

const activeSuggestionIndex = ref(-1)

onMounted(() => {
	const isCreateRoute = route.name === 'CreateRecipe'
	if (!isCreateRoute && store.currentRecipe) {
		ingredients.value = store.currentRecipe.ingredients.map(ingredient => ({
			name: ingredient.name,
			quantity: ingredient.amount?.split(' ')[0],
			type: ingredient.type === 'weight' ? QuantityType.WEIGHT : QuantityType.QUANTITY,
		}))
	}
})

const openModal = () => {
	showModal.value = true
}

const ingredientValidate = () => {
	let errors = { name: false, quantity: false }

	if (!ingredientName.value) {
		errors.name = true
	}

	if (!ingredientQuantity.value) {
		errors.quantity = true
	}

	return errors
}

const clearFieldError = (field: 'name' | 'quantity') => {
	ingredientErrors.value[field] = false
}

const clearAllErrors = () => {
	ingredientErrors.value = { name: false, quantity: false }
}

const addIngredient = (): void => {
	ingredientErrors.value = ingredientValidate()

	tryToSave.value = true
	if (ingredientName.value && (props.isExclusionMode || ingredientQuantity.value)) {
		const newIngredient: { name: string; quantity?: string; type?: QuantityType } = {
			name: ingredientName.value
		}
		if (!props.isExclusionMode) {
			newIngredient.quantity = ingredientQuantity.value
			newIngredient.type = activeTab.value
		}
		ingredients.value.push(newIngredient)
		closeModal()
	}
}

const removeIngredient = (index: number) => {
	ingredients.value.splice(index, 1)
}

const closeModal = () => {
	clearAllErrors()

	showModal.value = false
	ingredientName.value = ''
	ingredientQuantity.value = ''
	tryToSave.value = false
	activeSuggestionIndex.value = -1
	quantityLimitReached.value = false
}

const selectSuggestion = (item: InputListItem): void => {
	clearFieldError('name')
	ingredientName.value = item.title
}

const handleModalClick = (event: MouseEvent) => {
	const target = event.target as HTMLElement
	if (ingredientNameContainer.value && !ingredientNameContainer.value.contains(target)) {
		activeSuggestionIndex.value = -1
	}
}

const setModalLifted= (isLifted: boolean) => {
	isModalLifted.value = isLifted
}

const maxIngredientName = computed(() => {
	return ingredientSuggestions.reduce((longest: InputListItem, currentString: InputListItem) => {
		return currentString.title.length > longest.title.length ? currentString : longest
  })
})

const filteredList = computed((): InputListItem[] => {
	return ingredientSuggestions.filter((item) => item.title.toLowerCase().includes(ingredientName.value.toLowerCase()))
})

watch(ingredients, () => {
	if (store.currentRecipe) {
		store.currentRecipe.ingredients = ingredients.value.map(ingredient => ({
			name: ingredient.name,
			amount: props.isExclusionMode ? t('excluded') : `${ingredient.quantity} ${ingredient.type === QuantityType.WEIGHT ? t('unitGrams') : t('unitPieces')}`,
			type: ingredient.type === 'weight' ? QuantityType.WEIGHT : QuantityType.QUANTITY
		}))
	}
}, { deep: true })
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