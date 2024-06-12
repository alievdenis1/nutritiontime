<template>
	<el-dialog
		:model-value="isDialogVisible"
		width="326"
		class="remove-dialog"
		@close="onClose"
	>
		<template #header="{ titleId, titleClass }">
			<div class="flex flex-col items-center gap-3">
				<img
					src="/image/icons/icon-trash.svg"
					width="50"
				>
				<div class="text-[#735F2B] flex flex-col">
					<h4
						:id="titleId"
						:class="titleClass"
						style="color: #735F2B; font-weight: 600; font-size: 18px; "
					>
						{{ t('sure') }}
					</h4>
					<span class="text-[12px] leading-[9.5px] opacity-70 w-full">
						{{ t('warning') }}
					</span>
				</div>
			</div>
		</template>

		<div class="flex flex-col items-center gap-[6px]">
			<v-button
				class="remove-dialog__button bg-[#7C473F] text-white"
				@click="onRemoveCollection"
			>
				Удалить
			</v-button>
			<v-button
				class="remove-dialog__button border-[#735F2B] text-[#735F2B]"
				@click="onClose"
			>
				Нет
			</v-button>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, toRefs, watchEffect } from 'vue'
import { useDeletePlanStore } from '../model'
import { Plan } from 'entities/Plan/types'
import Localization from './DeleteModal.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

const { t } = useTranslation(Localization)

const store = useDeletePlanStore()

const emit = defineEmits<{
	(event: 'update:modelValue', isVisible: boolean):void
}>()

const props = defineProps<{
    planId: Plan['id'],
    modelValue: boolean
}>()

const { planId, modelValue } = toRefs(props)
const isDialogVisible = ref<boolean>(modelValue.value)

watchEffect(() => {
	isDialogVisible.value = modelValue.value
})

const onRemoveCollection = () => {
    isDialogVisible.value = false
	store.deletePlan(planId.value)
    emit('update:modelValue', false)
}
const onClose = () => {
    isDialogVisible.value = false
    emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped>
.remove-dialog__button {
    @apply w-[100px] text-center py-2.5 border border-solid rounded-[40px] text-[12px] leading-[94.95%] cursor-pointer
}
</style>