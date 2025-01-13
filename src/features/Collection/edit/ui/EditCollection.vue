<script setup lang="ts">
import { ref, watch } from 'vue'
import { CollectionModal, CollectionModalSaveButton } from 'entities/Сollection'
import { VInput } from 'shared/components/Input'
import { IconFavorites } from 'shared/components/Icon'
import { useTranslation } from 'shared/lib/i18n'
import Localization from './EditCollection.localization.json'
import { string, ValidationError } from 'yup'
import { Collection } from 'entities/Сollection/types/typesCollection.ts'
import { ElMessage } from 'element-plus'
import { updateCollectionV2 } from 'entities/Сollection/api'

const { t } = useTranslation(Localization)

const props = defineProps<{
	collection: Pick<Collection, 'id' | 'name'> & Record<string, unknown>
}>()

const isVisible = defineModel<boolean>({ required: true })

const emit = defineEmits<{
	success: [collection: Collection],
}>()

const isLifted = ref(false)

const setModalLifted = (flag: boolean) => {
	isLifted.value = flag
}

const schema = string().required(t('requiredMessage')).min(1, t('requiredMessage'))

const collectionName = ref('')

watch(() => props.collection, (newCollection) => {
	collectionName.value = newCollection.name
})

const errorMessage = ref('')
const isLoading = ref(false)

const onSave = async () => {
	isLoading.value = true

	try {
		errorMessage.value = ''
		schema.validateSync(collectionName.value)
		const { collection, message } = await updateCollectionV2({ name: collectionName.value, id: props.collection.id })
		emit('success', collection)
		ElMessage.success(message)
		isVisible.value = false
	} catch(err) {
		if (err instanceof ValidationError) {
			errorMessage.value = err.message
		} else {
			console.error(err)
		}
	} finally {
		isLoading.value = false
	}
}
</script>

<template>
	<CollectionModal
		v-model="isVisible"
		v-loading="isLoading"
		:title="t('collectionName')"
		:lifted="isLifted"
	>
		<div class="space-y-4">
			<p class="w-[260px] inline text-slateGray text-sm">
				<IconFavorites
					class="inline-block align-text-center w-[15px] h-[15px]"
					icon-color="#9F9FA0"
				/>
			</p>

			<VInput
				v-model="collectionName"
				:title="t('collectionName')"
				:error="!!errorMessage"
				:error-message="errorMessage"
				:autofocus="true"
				name="collectionName"
				@focus="setModalLifted(true)"
				@blur="setModalLifted(false)"
			/>

			<CollectionModalSaveButton @click="onSave">
				{{ t('save') }}
			</CollectionModalSaveButton>
		</div>
	</CollectionModal>
</template>
