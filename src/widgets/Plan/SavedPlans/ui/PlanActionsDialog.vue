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
					{{ plan.name }}
				</h4>
			</div>
		</template>
		<div
			v-loading="isLoadingDeletePlan || isLoadingCopyPlan"
			class="flex flex-col"
		>
			<v-divider/>

			<edit-plan />

			<v-divider />

			<delete-plan />
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, toRefs, watchEffect } from 'vue'
import { useCopyPlanStore } from 'features/Plan/copy'
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

<style lang="scss" scoped>
</style>
