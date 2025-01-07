<script setup lang="ts">
import { TabsList, TabsMain, TabsTrigger } from 'shared/components/ui/tabs'
import { InputList, InputListItem, VInput } from 'shared/components/Input'
import { VModal } from 'shared/components/Modal'
import { useIngredientList } from 'entities/Ingredient'
import { QuantityType } from 'entities/Recipe/CreateRecipe/recipe-models/types/enum.ts'
import { computed, nextTick, ref, watch } from 'vue'
import {
	type CreateRecipeIngredientModel,
	useIngredientCreationValidation
} from 'features/Recipe/create/model/base/use-base-recipe-creation-validation.ts'
import { softFilterBySearchQuery } from 'features/Recipe/create/model/base/filtering.ts'
import { useTranslation } from 'shared/lib/i18n'
import Localization from './IngredientsPart.localization.json'

const emit = defineEmits<{
	add: [model: CreateRecipeIngredientModel]
}>()

const { t } = useTranslation(Localization)

const { ingredientList, isLoadingIngredients } = useIngredientList()

const searchQuery = ref('')

const filteredIngredientList = computed(() => softFilterBySearchQuery({
	data: ingredientList.value,
	key: 'name',
	query: searchQuery.value
}))

const ingredientOptions = computed(() => {
	return filteredIngredientList.value.map(({ id, name }) => ({
		id: String(id),
		title: name,
		value: id
	}) as InputListItem<number>)
})

const isVisible = defineModel<boolean>({ required: true })

const isLifted = ref(false)

function setModalLifted(flag: boolean) {
	isLifted.value = flag
}

const {
	errors,
	validate,
	values,
	setToDefaultValues,
	clearErrors,
	isValid,
	validateField
} = useIngredientCreationValidation()

function close() {
	isVisible.value = false
	searchQuery.value = ''
	isLifted.value = false
	setToDefaultValues()
	clearErrors()
}

function selectIngredientFromList(data: InputListItem<number>) {
	values.id = data.value
	values.name = data.title
	searchQuery.value = data.title
}

const activeTab = ref<QuantityType>(QuantityType.WEIGHT)

watch(activeTab, (newValue) => {
	values.unit = newValue
})

function onSave() {
	validate()

	if (isValid.value) {
		emit('add', { ...values })
		close()
	}
}

function revalidateField (key: keyof CreateRecipeIngredientModel) {
	validateField(key)
}
</script>

<template>
	<VModal
		v-loading="isLoadingIngredients"
		:show="isVisible"
		:lifted="isLifted"
		@close="close"
	>
		<div class="p-4">
			<div class="text-gray mb-4">
				{{ t('ingredientPlaceholderName') }}
			</div>

			<VInput
				v-model="searchQuery"
				type="text"
				class="mb-4"
				:title="t('ingredientPlaceholderName')"
				:error="errors?.id"
				:error-message="errors?.id"
				name="name"
				autofocus
				no-digital
				searchable
				:z-index="30"
				@clear:error="revalidateField('id')"
				@focus.stop="setModalLifted(true)"
				@blur.stop="setModalLifted(false)"
			>
				<template #list>
					<InputList
						:list="ingredientOptions"
						@select="selectIngredientFromList"
					/>
				</template>
			</VInput>

			<div
				class="relative"
			>
				<VInput
					v-model="values.amount"
					type="number"
					class="mb-4"
					digital
					:title="t('ingredientPlaceholderQuantity')"
					:error="!!errors?.amount"
					:error-message="errors?.amount"
					name="quantity"
					:max-length="10"
					@clear:error="revalidateField('amount')"
					@focus.stop="setModalLifted(true)"
					@blur.stop="setModalLifted(false)"
				/>
			</div>

			<TabsMain
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
				@click="onSave"
			>
				{{ t('saveIngredientButton') }}
			</button>
		</div>
	</VModal>
</template>

<style>

</style>
