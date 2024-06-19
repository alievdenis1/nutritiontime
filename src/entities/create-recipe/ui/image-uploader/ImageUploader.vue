<template>
	<div class="bg-[url('/image/placeholder.png')] bg-cover w-full h-[168px] relative rounded-[40px]">
		<v-button
			class="absolute right-[18px] top-[18px] cursor-pointer"
			@click="isDialogVisible = true"
		>
			<icon-pen />
		</v-button>
	</div>
	<el-dialog
		:model-value="isDialogVisible"
		class="dialog-uploader"
		@close="onClose"
	>
		<div class="flex flex-col">
			<v-button class="modal-btn">
				<icon-image />
				Gallery
			</v-button>
			<v-divider />
			<v-button class="modal-btn ">
				<icon-file />
				File
			</v-button>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VDivider } from 'shared/components/Divider'
import { IconFile, IconImage, IconPen } from '@/shared/components/Icon'

const isDialogVisible = ref(false)

const onClose = () => {
	isDialogVisible.value = false
}
</script>

<style scoped>
.modal-btn {
	@apply flex gap-2 py-2 px-3 cursor-pointer
}
</style>