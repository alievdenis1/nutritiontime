<template>
	<el-dialog
		:model-value="isDialogVisible"
		width="159"
		class="cooking-method"
		@close="onClose"
	>
		<div class="flex flex-col text-center">
			<v-button
				v-for="method in methods"
				:key="method.id"
				class="method-btn"
				@click="onChoseCookingMethod(method)"
			>
				<span>{{ method.name }}</span>
				<v-divider
					v-if="methods[methods.length - 1].id !== method.id"
				/>
			</v-button>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, toRefs, watchEffect } from 'vue'
import Localization from './CookingMethodModal.localization.json'
import { useTranslation } from '@/shared/lib/i18n'
import { VDivider } from 'shared/components/Divider'

const { t } = useTranslation(Localization)

const methods = [
	{ id: 1, name: 'hot' },
	{ id: 2, name: 'trick' },
	{ id: 3, name: 'steamed' },
	{ id: 4, name: 'pickling' },
	{ id: 5, name: 'onfire' },
	{ id: 6, name: 'grill' },
]

const emit = defineEmits<{
	(event: 'update:modelValue', isVisible)
}>()

const props = defineProps<{
	modelValue: boolean
}>()

const { modelValue } = toRefs(props)
const isDialogVisible = ref<boolean>(modelValue.value)

watchEffect(() => {
	isDialogVisible.value = modelValue.value
})

const onChoseCookingMethod = (method) => {
	isDialogVisible.value = false
	console.log(method.name)
	emit('update:modelValue', false)
}
const onClose = () => {
	isDialogVisible.value = false
	emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped>
.method_btn {
	@apply bg-white text-[#735F2B] w-full text-center cursor-pointer
}
</style>