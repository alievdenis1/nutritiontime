<template>
	<el-dialog
		:model-value="isDialogVisible"
		modal-class="v-dialog-wrapper"
		width="326"
		class="bg-[#FEF6DF] flex flex-col gap-0"
		@close="onClose"
	>
		<template #header="{ titleId, titleClass }">
			<div>
				<h4
					:id="titleId"
					:class="titleClass"
					style="color: #735F2B; font-weight: 600;"
				>
					{{ collection.name }}
				</h4>
			</div>
		</template>
		<div
			v-loading="isLoadingDeleteCollection || isLoadingCopyCollection"
			class="flex flex-col"
		>
			<v-divider />

			<edit-collection />

			<v-divider />

			<delete-collection :plan-id="collection.id" />
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, toRefs, watchEffect } from 'vue'
import { useCopyCollectionStore } from 'features/Collection/copy'
import { Collection } from 'entities/Сollection/types/typesCollection.ts'
import { VDivider } from 'shared/components/Divider'
import { EditCollection } from 'features/Collection/edit'
import { DeleteCollection, useDeleteCollectionStore } from 'features/Collection/delete'
import { storeToRefs } from 'pinia'

const deleteCollectionStore = useDeleteCollectionStore()
const copyCollectionStore = useCopyCollectionStore()

const { isLoadingDeleteCollection } = storeToRefs(deleteCollectionStore)
const { isLoadingCopyCollection } = storeToRefs(copyCollectionStore)

const emit = defineEmits<{
	(event: 'update:modelValue', isVisible: boolean): void
}>()

const props = defineProps<{
	collection: Collection,
	modelValue: boolean
}>()

const { collection, modelValue } = toRefs(props)

const isDialogVisible = ref<boolean>(modelValue.value)

watchEffect(() => {
	isDialogVisible.value = modelValue.value
})

const onClose = () => {
	isDialogVisible.value = false
	emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped>
</style>
