<script setup lang="ts">
import { VModal } from 'shared/components/Modal'
import { IconClose } from 'shared/components/Icon'

const props = defineProps<{
	title: string
	lifted: boolean
}>()

const isVisible = defineModel<boolean>({ required: true })

const close = () => {
	isVisible.value = false
}
</script>

<template>
	<VModal
		:lifted="lifted"
		:show="isVisible"
		:title="title"
	>
		<div class="flex justify-between mb-[12px] items-center">
			<h2 class="text-xl font-bold text-darkGray">
				{{ title }}
			</h2>

			<button
				class="text-2xl w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[14px] cursor-pointer"
				@click="close"
			>
				<IconClose icon-color="#9F9FA0" />
			</button>
		</div>

		<slot />
	</VModal>
</template>

<style module>

</style>
