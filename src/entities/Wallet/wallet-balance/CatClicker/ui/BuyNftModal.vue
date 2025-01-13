<template>
	<VModal
		:show="props.isShowBuyNftModal"
		@close="handleCloseBuyNftModal"
	>
		<div class="flex items-center justify-between">
			<div class="text-xl text-darkGray">
				{{ t('buyNftModalTitle') }}
			</div>
			<button
				class="text-2xl w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[14px] cursor-pointer"
				@click="handleCloseBuyNftModal"
			>
				<IconClose />
			</button>
		</div>
		<div>
			{{ t('buyNftModalDescription') }}
		</div>
		<div class="max-w-md mx-auto">
			<VButton
				class="mt-[20px]"
				:color="ButtonColors.Green"
				@click="buyNft"
			>
				{{ t('buyNft') }}
			</VButton>
		</div>
	</VModal>
</template>
<script setup lang="ts">
import { watch } from 'vue'
import { VModal } from '@/shared/components/Modal'
import { VButton, ButtonColors } from '@/shared/components/Button'
import { IconClose } from '@/shared/components/Icon'
import { useTranslation } from '@/shared/lib/i18n'
import Localization from '../CatClicker.localization.json'

const { t } = useTranslation(Localization)

const props =
  defineProps<{ isShowBuyNftModal: boolean; hasNft: boolean }>()

const emit = defineEmits<{
	(e: 'closeBuyNftModal'): void
}>()

const handleCloseBuyNftModal = () => {
	emit('closeBuyNftModal')
}

const buyNft = () => {
	window.open(
		import.meta.env.VITE_NFT_COLLECTION_LINK
            || 'https://getgems.io/collection/EQDERkmRDrXxzEbZUMMgo3uDJwe24qUYpnasJ83WpQZaqjJ1',
		'_blank'
	)
}

watch(() => props.hasNft, (hasNft) => {
	if (hasNft) {
		handleCloseBuyNftModal()
	}
})
</script>

<style scoped>
</style>