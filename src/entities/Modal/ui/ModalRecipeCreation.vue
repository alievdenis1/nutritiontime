<template>
	<VModal
		:show="store.isModalCreateOpen"
		@close="handleClose"
	>
		<div>
			<div class="flex justify-between mb-[12px] items-center">
				<h2 class="text-xl font-bold">
					{{ t('createRecipe') }}
				</h2>
				<button
					class="text-2xl w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[14px]"
					@click="handleClose"
				>
					<IconClose />
				</button>
			</div>

			<div class="space-y-4">
				<div
					class="flex items-center justify-between p-4 bg-mainBg rounded-lg cursor-pointer border"
					@click="selectMethod('manual')"
				>
					<div class="text-left w-[255px]">
						<h3 class="font-semibold mb-[8px] text-lg">
							{{ t('manualCreation') }}
						</h3>
						<p class="text-slateGray text-xs	">
							{{ t('manualDescription') }}
						</p>
					</div>
					<IconArrowRight
						icon-color="#1C1C1C"
						class="w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[8px]"
					/>
				</div>
				<div
					class="flex items-center justify-between p-4 bg-mainBg rounded-lg cursor-pointer border"
					@click="selectMethod('ai')"
				>
					<div class="text-left w-[255px]">
						<h3 class="font-semibold mb-[8px] text-lg">
							{{ t('aiCreation') }}
						</h3>
						<p class="text-gray-600 mr-[8px] text-xs">
							{{ t('aiDescription') }}
						</p>
					</div>
					<IconArrowRight
						icon-color="#1C1C1C"
						class="w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[8px]"
					/>
				</div>
			</div>
		</div>
	</VModal>
</template>

<script setup lang="ts">
import { VModal } from 'shared/components/Modal'
import { IconArrowRight, IconClose } from 'shared/components/Icon'
import { useModalStore } from '../model/model.ts'
import { useTranslation } from '@/shared/lib/i18n'
import Localization from './Modal.localization.json'
const store = useModalStore()

const emit = defineEmits(['close', 'selectMethod'])

const { t } = useTranslation(Localization)

const handleClose = () => {
	store.isModalCreateOpen = false
	emit('close')
}

const selectMethod = (method: string) => {
	emit('selectMethod', method)
	handleClose()
}

</script>

<style scoped lang="scss">
.border{
	border: 1px solid #1C1C1C0D
}
</style>