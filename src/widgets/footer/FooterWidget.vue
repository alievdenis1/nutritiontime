<template>
	<div class="grid w-full rounded-[4px] py-5 px-9 bg-white drop-shadow-[0_3px_2px_rgba(237, 216, 194, 0.35)]">
		<footer class="flex items-center justify-between">
			<v-button class="cursor-pointer flex flex-col-reverse items-center gap-[6px]">
				<span class="text-xs font-medium text-[#968D7D] w-[72px] h-[15px] text-center">
					{{ t('receipts')}}
				</span>
				<img
					height="15"
					src="/image/icons/icon-my-reciepts.svg"
					width="15"
				>
			</v-button>
			<v-button class="cursor-pointer p-5 rotate-45 bg-[#056760] rounded-[15px]">
				<img
					class="rotate-45"
					height="15"
					src="/image/icons/icon-plus.svg"
					width="9"
				>
			</v-button>
			<v-button class="cursor-pointer flex flex-col-reverse items-center gap-[6px]">
				<span class="text-xs font-medium text-[#968D7D] w-[72px] h-[15px] text-center">
					{{t('search')}}
				</span>
				<img
					height="12"
					src="/image/icons/icon-search.svg"
					width="12"
				>
			</v-button>
		</footer>
	</div>
</template>

<script setup lang="ts">
import Localization from './FooterWidget.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

const { t } = useTranslation(Localization)
</script>

<style lang="scss" scoped></style>