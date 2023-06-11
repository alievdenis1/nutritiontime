<template>
	<el-dialog
		:model-value="isDialogVisible"
		:title="plan.name"
		@close="onClose"
	>
		<div
			v-loading="isLoadingDeletePlan || isLoadingCopyPlan"
			class="flex flex-col"
		>
			<v-divider />

			<copy-plan />

			<v-divider />

			<edit-plan />

			<v-divider />

			<delete-plan />
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, toRefs, watchEffect } from 'vue'
import { CopyPlan, useCopyPlanStore } from 'features/Plan/copy'
import { Plan } from 'entities/Plan/types'
import { VDivider } from 'shared/components/Divider'
import { EditPlan } from 'features/Plan/edit'
import { DeletePlan, useDeletePlanStore } from 'features/Plan/delete'
import { storeToRefs } from 'pinia'

const deletePlanStore = useDeletePlanStore()
const copyPlanStore = useCopyPlanStore()

const { isLoadingDeletePlan } = storeToRefs(deletePlanStore)
const { isLoadingCopyPlan } = storeToRefs(copyPlanStore)

const emit = defineEmits<{
	(event: 'update:modelValue', isVisible: boolean)
}>()

const props = defineProps<{
	plan: Plan,
	modelValue: boolean
}>()

const { plan, modelValue } = toRefs(props)

const isDialogVisible = ref<boolean>(modelValue.value)

watchEffect(() => {
	isDialogVisible.value = modelValue.value
})

const onClose = () => {
	isDialogVisible.value = false
	emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped></style>
