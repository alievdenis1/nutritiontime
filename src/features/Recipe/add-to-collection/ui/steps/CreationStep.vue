<script setup lang="ts">
import { SaveButton, StepModal } from 'features/Recipe/add-to-collection/ui/steps/atoms'
import { VInput } from 'shared/components/Input'
import Localization from '../AddRecipeToCollection.localization.json'
import { useTranslation } from 'shared/lib/i18n'
import { string, ValidationError } from 'yup'
import { ref } from 'vue'

const { t } = useTranslation(Localization)

const emit = defineEmits<{
	next: [],
	save: [collectionName: string]
	close: [],
	back: []
}>()

const name = ref('')

const schema = string().required(t('nameIsRequiredMessage')).min(1, t('nameIsRequiredMessage'))

const errorMessage = ref('')

const onSave = () => {
	try {
		schema.validateSync(name.value)
		errorMessage.value = ''
		emit('save', name.value)
	} catch(error) {
		if (error instanceof ValidationError) {
			errorMessage.value = error.message
		} else {
			console.error(error)
		}
	}
}

const isModalLifted = ref(false)

const setModalLifted = (flag: boolean) => {
	isModalLifted.value = flag
}
</script>

<template>
	<StepModal
		:model-value="true"
		:lifted="isModalLifted"
		with-back-action
		@back="$emit('back')"
		@next="$emit('next')"
		@close="$emit('close')"
	>
		<VInput
			v-model="name"
			type="text"
			name="collectionName"
			:title="t('collectionName')"
			:style="{ color: '#535353' }"
			:error-message="errorMessage"
			:error="errorMessage"
			@focus="setModalLifted(true)"
			@blur="setModalLifted(false)"
		/>

		<SaveButton
			class="mt-[24px]"
			@click="onSave"
		>
			{{ t('saveCollectionAndSaveRecipe') }}
		</SaveButton>
	</StepModal>
</template>

<style module>

</style>
