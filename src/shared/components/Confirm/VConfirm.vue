<template>
	<VModal
		:show="confirmStore.isOpen"
		hide-close-icon
		@close="onClose(false)"
	>
		<p
			v-if="confirmStore?.props?.title"
			class="text-[#1c1c1c] text-title font-medium"
		>
			{{ confirmStore?.props?.title }}
		</p>

		<p
			v-if="confirmStore?.props?.description"
			class="text-[#535353] text-description font-normal mt-4"
		>
			{{ confirmStore?.props?.description }}
		</p>

		<div class="flex justify-between items-center gap-2 mt-5">
			<VButton @click="onClose(false)">
				<p>{{ cancelButtonText }}</p>
			</VButton>

			<VButton
				:color="ButtonColors.White"
				@click="onConfirm"
			>
				<p>{{ confirmButtonText }}</p>
			</VButton>
		</div>
	</VModal>
</template>

<script setup lang="ts">
import { VModal } from '../Modal'
import { VButton, ButtonColors } from '../Button'
import { useConfirmStore } from './model'
import { useTranslation } from '@/shared/lib/i18n'
import Localization from './Confirm.localization.json'
import { computed } from 'vue'

const { t } = useTranslation(Localization)

const confirmStore = useConfirmStore()

const confirmButtonText = computed((): string => confirmStore.props?.confirmButtonText || t('confirm'))
const cancelButtonText = computed((): string => confirmStore.props?.cancelButtonText || t('cancel'))

const onConfirm = (): void => {
    confirmStore.onClose(true)
}
const onClose = (value: boolean): void => {
    if (!value) confirmStore.onClose(false)
}
</script>