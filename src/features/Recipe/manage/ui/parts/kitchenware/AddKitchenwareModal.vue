<script setup lang="ts">
import { InputList, InputListItem, VInput } from 'shared/components/Input'
import { VModal } from 'shared/components/Modal'
import localization from './KitchenwarePart.localization.json'
import { useTranslation } from 'shared/lib/i18n'
import { computed, ref } from 'vue'
import {
	type ManageRecipeKitchenwareModel,
	useKitchenwareValidation
} from 'features/Recipe/manage/model/use-manage-recipe-validation.ts'
import { useKitchenwareList } from 'entities/Kitchenware'
import { softFilterBySearchQuery } from 'shared/lib/mapping/filtering.ts'

const { t } = useTranslation(localization)

const searchQuery = ref('')

const isVisible = defineModel<boolean>({ required: true })

const emit = defineEmits<{
	add: [model: ManageRecipeKitchenwareModel]
}>()

const {
	values,
	errors,
	setToDefaultValues,
	validate,
	clearError,
	clearErrors,
	isValid
} = useKitchenwareValidation()

function close() {
	isVisible.value = false
	searchQuery.value = ''
	setToDefaultValues()
	clearErrors()
}

const {
	kitchenwareList,
	isLoadingKitchenwareList
} = useKitchenwareList()

const kitchenwareOptions = computed(() => {
	return kitchenwareList.value?.map((kitchenware) => {
		return {
			id: String(kitchenware.id),
			title: kitchenware.name,
			value: kitchenware.id
		} as InputListItem<number>
	}) ?? []
})

const filteredKitchenwareOptions = computed(() => {
	return softFilterBySearchQuery({
		data: kitchenwareOptions.value,
		key: 'title',
		query: searchQuery.value
	})
})

function onKitchenwareSelected(item: InputListItem<number>) {
	values.id = item.value
	values.name = item.title
	searchQuery.value = item.title
}

function onSave() {
	validate()

	if (isValid.value) {
		emit('add', { ...values })
		close()
	}
}
</script>

<template>
	<VModal
		v-loading="isLoadingKitchenwareList"
		:show="isVisible"
		@close="close"
	>
		<div class="p-4">
			<h2 class="text-lg mb-4">
				{{ t('addIngredientTitle') }}
			</h2>

			<VInput
				ref="kitchenwareNameInput"
				v-model="searchQuery"
				autofocus
				no-digital
				searchable
				:error="errors?.name"
				:error-message="errors?.name"
				name="name"
				:title="t('ingredientPlaceholderName')"
				:z-index="30"
				@clear:error="clearError('id')"
			>
				<template #list>
					<InputList
						:list="filteredKitchenwareOptions"
						@select="onKitchenwareSelected"
					/>
				</template>
			</VInput>

			<div class="text-gray mb-4">
				{{ t('forExampleBlender') }}
			</div>

			<VInput
				v-model.number="values.quantity"
				class="mb-4"
				digital
				:error="errors?.quantity"
				:error-message="errors?.quantity"
				:title="t('ingredientPlaceholderQuantity')"
				name="quantity"
				:max-length="4"
				@clear:error="clearError('quantity')"
			/>

			<button
				class="bg-forestGreen text-white rounded-[16px] py-2 px-4 w-[100%] text-center"
				@click="onSave"
			>
				{{ t('saveIngredientButton') }}
			</button>
		</div>
	</VModal>
</template>

<style module>

</style>
