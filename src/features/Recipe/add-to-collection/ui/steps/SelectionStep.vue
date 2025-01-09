<script setup lang="ts">
import { StepModal, SaveButton } from './atoms'
import { CollectionSelect } from 'entities/Сollection'
import { ref } from 'vue'
import { ButtonColors, VButton } from 'shared/components/Button'
import { IconArrowRight } from 'shared/components/Icon'
import Localization from '../AddRecipeToCollection.localization.json'
import { useTranslation } from 'shared/lib/i18n'
import { number } from 'yup'

const { t } = useTranslation(Localization)

const emit = defineEmits<{
	next: [],
	save: [collectionId: number]
	close: [],
	back: []
}>()
const selectedCollection = ref<number | null>(null)

const onSave = () => {
	if (selectedCollection.value) {
		emit('save', selectedCollection.value)
	}
}
</script>

<template>
	<StepModal
		:model-value="true"
		@close="emit('close')"
		@back="emit('back')"
	>
		<CollectionSelect
			v-model="selectedCollection"
			default-first-item
		/>

		<div class="flex gap-2 flex-col">
			<VButton
				:color="ButtonColors.White"
				class="mt-[24px]"
				@click="$emit('next')"
			>
				{{ t('newCollection') }}
				<IconArrowRight
					icon-color="#319A6E"
					class="ml-[12px]"
				/>
			</VButton>

			<SaveButton
				:disabled="!selectedCollection"
				@click="onSave"
			>
				{{ t('save') }}
			</SaveButton>
		</div>
	</StepModal>
</template>

<style module>

</style>
