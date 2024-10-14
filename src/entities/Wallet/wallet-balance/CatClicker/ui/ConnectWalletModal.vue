<template>
	<VModal
		:show="props.isShowConnectWalletModal"
		@close="handleCloseConnectWalletModal"
	>
		<div class="flex items-center justify-between">
			<div class="text-xl text-darkGray">
				{{ t('connectWalletModalTitle') }}
			</div>
			<button
				class="text-2xl w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[14px] cursor-pointer"
				@click="handleCloseConnectWalletModal"
			>
				<IconClose />
			</button>
		</div>
		<div>
			{{ t('connectWalletModalDescription') }}
		</div>
		<div class="max-w-md mx-auto">
			<VButton
				class="mt-[20px]"
				:color="ButtonColors.Green"
				@click="openWallet"
			>
				<div class="flex gap-[4px] items-center justify-center">
					<IconTon />
					{{ t('connectWallet') }}
				</div>
			</VButton>
		</div>
	</VModal>
</template>
<script setup lang="ts">
import { watch } from 'vue'
import { useTonConnectModal } from '@townsquarelabs/ui-vue'
import { VModal } from '@/shared/components/Modal'
import { VButton, ButtonColors } from '@/shared/components/Button'
import { IconClose, IconTon } from '@/shared/components/Icon'
import { useTranslation } from '@/shared/lib/i18n'
import Localization from '../CatClicker.localization.json'

const { t } = useTranslation(Localization)

const { open } = useTonConnectModal()

const props =
  defineProps<{ isShowConnectWalletModal: boolean; walletConnected: boolean }>()

const emit = defineEmits<{
  (e: 'closeConnectWalletModal'): void
}>()

const handleCloseConnectWalletModal = () => {
    emit('closeConnectWalletModal')
}

const openWallet = () => {
    open()
}

watch(() => props.walletConnected, (isWalletConnected) => {
  if (isWalletConnected) {
    handleCloseConnectWalletModal()
  }
 })
</script>

<style scoped>
</style>