<template>
	<div class="grid w-full px-[26px]">
		<footer class="flex py-3 px-14 items-center justify-between bg-[#6BA78E] rounded-[100px]">
			<v-button class="cursor-pointer">
				<img
					height="23"
					src="/image/icons/icon-home.svg"
					width="24"
				>
			</v-button>
			<v-button
				class="cursor-pointer p-[14.5px] border-solid border border-white rounded-[50%]"
				@click="router.push('/create-recipe')"
			>
				<img
					height="9"
					src="/image/icons/icon-plus.svg"
					width="9"
				>
			</v-button>
			<v-button class="cursor-pointer">
				<img
					height="22"
					src="/image/icons/icon-search.svg"
					width="23"
				>
			</v-button>
		</footer>
	</div>
</template>

<script setup lang="ts">
import Localization from './FooterWidget.localization.json'
import { useTranslation } from '@/shared/lib/i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useTranslation(Localization)
</script>

<style lang="scss" scoped></style>